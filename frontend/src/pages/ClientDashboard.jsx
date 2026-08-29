import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, PlusCircle, Trash2, Star, ArrowRight, AlertCircle, CheckCircle2, Clock3, DollarSign, FileText, Users, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';


function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[1,2,3,4,5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 ${
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ClientDashboard({ currentUser }) {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    overallRating: 5,
    communicationRating: 5,
    qualityRating: 5,
    timelinessRating: 5,
    comment: ""
  });
  const [filter, setFilter] = useState('ALL');

  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'Programming & Tech',
    description: '',
    budget: '',
    deadlineDays: '3'
  });

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setDashboardLoading(true);
        setDashboardError('');

        const [dashboardRes, jobsRes, ordersRes] = await Promise.all([
          API.get('/client/dashboard'),
          API.get('/jobs/my-projects'),
          API.get('/orders')
        ]);

        if (!mounted) return;

        setDashboardData(dashboardRes.data);
        setJobs(jobsRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        if (!mounted) return;
        setDashboardError(
          err.response?.data?.error || 'Unable to load your dashboard.'
        );
      } finally {
        if (mounted) {
          setDashboardLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/jobs', {
        title: jobForm.title,
        category: jobForm.category,
        description: jobForm.description,
        budget: Number(jobForm.budget),
        reviewWindow: Number(jobForm.deadlineDays)
      });

      const createdJob = res.data.job || res.data;

      setJobs([createdJob, ...jobs]);

      setShowPostJobModal(false);

      confetti({
        particleCount: 100,
        spread: 70
      });

      setJobForm({
        title: '',
        category: 'Programming & Tech',
        description: '',
        budget: '',
        deadlineDays: '3'
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Error posting job');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/reviews/${selectedOrderId}`, reviewForm);
      alert("Review submitted successfully.");
      setShowReviewModal(false);
      setSelectedOrderId(null);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit review.");
    }
  };

  const handleDeleteJob = (id) => {
    setJobToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = async () => {
    try {
      await API.delete(`/jobs/${jobToDelete}`);

      setJobs(prev =>
        prev.filter(j => j.id !== jobToDelete)
      );

      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch {
      alert('Failed to delete job.');
    }
  };

  const getStatusLabel = (job) => {
    switch ((job.status || '').toUpperCase()) {
      case 'DRAFT':
        return 'Draft';
      case 'OPEN':
        return 'Published';
      case 'PENDING_PAYMENT':
        return 'Payment Pending';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return job.status || 'Unknown';
    }
  };

  const dashboardSummary = dashboardData?.summary || {
    activeProjects: 0,
    pendingProposals: 0,
    totalSpend: 0,
    escrowAmount: 0,
    completedProjects: 0,
    unreadNotifications: 0
  };

  const attention = dashboardData?.attention || {
    proposalJobs: [],
    deliveryApprovalItems: [],
    paymentItems: []
  };

  const activeProjects = dashboardData?.activeProjects || [];

  const attentionItems = [
    ...attention.deliveryApprovalItems.map(item => ({
      key: `delivery-${item.orderId}`,
      type: 'DELIVERY',
      title: 'Delivery awaiting approval',
      subtitle: item.projectTitle,
      detail: `${item.studentName} · ₹${Number(item.amount || 0).toLocaleString('en-IN')}`,
      action: 'Review Delivery',
      href: `/orders/${item.orderId}`
    })),
    ...attention.paymentItems.map(item => ({
      key: `payment-${item.orderId}`,
      type: 'PAYMENT',
      title: 'Payment required to continue hiring',
      subtitle: item.projectTitle,
      detail: `${item.studentName} · ₹${Number(item.amount || 0).toLocaleString('en-IN')}`,
      action: 'Open Project Room',
      href: `/orders/${item.orderId}`
    })),
    ...attention.proposalJobs.map(item => ({
      key: `proposal-${item.id}`,
      type: 'PROPOSAL',
      title: `${item.pendingProposalCount} proposal${item.pendingProposalCount === 1 ? '' : 's'} awaiting review`,
      subtitle: item.title,
      detail: 'Choose the right student for this project',
      action: 'Review Proposals',
      href: `/my-projects/${item.id}/proposals`
    }))
  ].slice(0, 5);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN')}`;

  const filteredJobs = jobs.filter(job => {
    if (filter === 'ALL') return true;

    if (filter === 'DRAFTS') {
      return (job.status || '').toUpperCase() === 'DRAFT';
    }

    if (filter === 'PUBLISHED') {
      return (job.status || '').toUpperCase() === 'OPEN';
    }

    if (filter === 'IN_PROGRESS') {
      return (job.status || '').toUpperCase() === 'IN_PROGRESS';
    }

    if (filter === 'COMPLETED') {
      return (job.status || '').toUpperCase() === 'COMPLETED';
    }

    if (filter === 'CANCELLED') {
      return (job.status || '').toUpperCase() === 'CANCELLED';
    }

    return true;
  });

  return (
    <div className="space-y-7 pb-16">

      <div className="glass-panel p-7 md:p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm font-black text-emerald-400 mb-3">
            <Briefcase className="w-4 h-4" />
            <span>Verified Client Management Portal</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Welcome back, {currentUser?.fullName}
          </h2>

          <p className="text-base text-slate-400 mt-2">
            Manage your projects, hiring, approvals and payments from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowPostJobModal(true)}
            className="px-6 py-3.5 neon-airflow-btn text-white rounded-2xl text-sm font-black shadow-xl flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post New Project</span>
          </button>

          <Link
            to="/notifications"
            className="px-4 py-3.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-2xl flex items-center gap-2"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {dashboardSummary.unreadNotifications > 0 && (
              <span className="text-sm font-black">
                {dashboardSummary.unreadNotifications}
              </span>
            )}
          </Link>
        </div>
      </div>

      {dashboardError && (
        <div className="glass-panel p-4 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-base font-bold text-red-300">{dashboardError}</p>
            <p className="text-sm text-slate-400 mt-1">
              The dashboard could not load its latest summary.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Projects',
            value: dashboardSummary.activeProjects,
            note: dashboardSummary.activeProjects === 0
              ? 'No active projects'
              : 'Currently in progress',
            icon: Briefcase
          },
          {
            label: 'Pending Proposals',
            value: dashboardSummary.pendingProposals,
            note: dashboardSummary.pendingProposals === 0
              ? 'Nothing waiting'
              : 'Ready for your review',
            icon: Users
          },
          {
            label: 'Total Spend',
            value: formatCurrency(dashboardSummary.totalSpend),
            note: 'Across non-refunded orders',
            icon: DollarSign
          },
          {
            label: 'In Escrow',
            value: formatCurrency(dashboardSummary.escrowAmount),
            note: 'Currently secured',
            icon: Clock3
          }
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="glass-panel p-5 rounded-3xl border border-slate-800"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black uppercase tracking-wide text-slate-400">
                  {card.label}
                </span>
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="text-2xl md:text-3xl font-black text-white mt-3">
                {dashboardLoading ? '—' : card.value}
              </div>

              <p className="text-sm text-slate-500 mt-1">
                {card.note}
              </p>
            </div>
          );
        })}
      </div>

      <div className="glass-panel p-6 md:p-7 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-black text-white">
                Needs Your Attention
              </h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Important actions that should not be buried in your project list.
            </p>
          </div>
        </div>

        {dashboardLoading ? (
          <div className="py-8 text-center text-base text-slate-500">
            Loading action items…
          </div>
        ) : attentionItems.length === 0 ? (
          <div className="py-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-200">
              You are all caught up.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              No immediate client actions require your attention.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {attentionItems.map((item) => {
              const itemIcon =
                item.type === 'DELIVERY'
                  ? CheckCircle2
                  : item.type === 'PAYMENT'
                    ? DollarSign
                    : FileText;

              const Icon = itemIcon;

              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className="group flex items-center justify-between gap-4 p-4 md:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-950 transition"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-base font-bold text-white">
                        {item.title}
                      </p>
                      <p className="text-sm font-semibold text-slate-300 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {item.detail}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-black text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 shrink-0">
                    {item.action}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="glass-panel p-6 md:p-7 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-xl font-black text-white">Active Projects</h3>
            <p className="text-sm text-slate-400 mt-1">
              A focused view of work currently moving through your marketplace.
            </p>
          </div>

          <Link
            to="/my-projects"
            className="text-sm font-black text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

        {dashboardLoading ? (
          <div className="py-8 text-center text-base text-slate-500">
            Loading active projects…
          </div>
        ) : activeProjects.length === 0 ? (
          <div className="py-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center">
            <Briefcase className="w-7 h-7 text-slate-500 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-200">
              No active projects yet.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Post a project and start finding student freelancers.
            </p>

            <button
              onClick={() => setShowPostJobModal(true)}
              className="mt-4 px-5 py-3 neon-airflow-btn rounded-xl text-white text-sm font-black"
            >
              Post a Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm uppercase font-black text-indigo-400">
                        {project.category}
                      </span>
                      <span className="text-sm px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 font-bold">
                        {getStatusLabel(project)}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-white mt-2 truncate">
                      {project.title}
                    </h4>
                  </div>

                  <FileText className="w-5 h-5 text-slate-500 shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <p className="text-sm text-slate-500">Budget</p>
                    <p className="text-base font-black text-white mt-1">
                      {formatCurrency(project.budget)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <p className="text-sm text-slate-500">Proposals</p>
                    <p className="text-base font-black text-white mt-1">
                      {project.proposalCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-4">
                  <span className="text-sm text-slate-500">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => navigate(`/my-projects/${project.id}`)}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm font-black flex items-center gap-1.5"
                  >
                    Open
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {(() => {
        const pendingReviews = orders
          .filter((order) => {
            if (order.status !== 'COMPLETED') return false;

            return !(order.reviews || []).some(
              (review) => review.reviewerId === order.client?.id
            );
          })
          .slice(0, 4);

        return (
          <div className="glass-panel p-6 md:p-7 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-xl font-black text-white">
                  Completed Projects Needing Review
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Share feedback on recently completed student work.
                </p>
              </div>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="py-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-base font-bold text-slate-200">
                  No reviews waiting.
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  You have reviewed all completed projects shown here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviews.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-bold text-white truncate">
                        {order.job?.title || `Order #${order.id.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {order.seller?.fullName || 'Student'} · {formatCurrency(order.totalAmount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setShowReviewModal(true);
                        }}
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-black rounded-xl"
                      >
                        Leave Review
                      </button>

                      <Link
                        to={`/orders/${order.id}`}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-black rounded-xl"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-black text-white">Project Pipeline</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ['Drafts', dashboardData?.projectCounts?.drafts || 0],
              ['Published', dashboardData?.projectCounts?.published || 0],
              ['In Progress', dashboardData?.projectCounts?.inProgress || 0],
              ['Completed', dashboardData?.projectCounts?.completed || 0],
              ['Cancelled', dashboardData?.projectCounts?.cancelled || 0],
              ['Total', dashboardData?.projectCounts?.all || 0]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-950/50 border border-slate-800 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-black text-white mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-black text-white">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setShowPostJobModal(true)}
              className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black text-left"
            >
              + Post a Project
            </button>

            <Link
              to="/talent-search"
              className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-sm font-black"
            >
              Find Students
            </Link>

            <Link
              to="/notifications"
              className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-sm font-black"
            >
              Notifications
            </Link>

          </div>
        </div>
      </div>

      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="neon-border-box max-w-lg w-full p-7 shadow-2xl relative">

            <button
              onClick={() => setShowPostJobModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-white mb-4">
              Post a Project Brief
            </h3>

            <form onSubmit={handlePostJob} className="space-y-4">

              <input
                required
                type="text"
                value={jobForm.title}
                onChange={e => setJobForm({...jobForm, title: e.target.value})}
                placeholder="Project Title"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white"
              />

              <input
                required
                type="number"
                value={jobForm.budget}
                onChange={e => setJobForm({...jobForm, budget: e.target.value})}
                placeholder="Budget in ₹"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white"
              />

              <textarea
                required
                rows="4"
                value={jobForm.description}
                onChange={e => setJobForm({...jobForm, description: e.target.value})}
                placeholder="Requirements description..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white"
              />

              <button
                type="submit"
                className="w-full py-3.5 neon-airflow-btn text-white font-black rounded-2xl"
              >
                Publish Project Brief
              </button>

            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-black text-white mb-6">
              Leave Review
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">

              <div>
                <label className="block text-sm text-slate-300 mb-2">Overall Rating</label>
                <StarRating
                  value={reviewForm.overallRating}
                  onChange={(v) => setReviewForm({...reviewForm, overallRating: v})}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Communication</label>
                <StarRating
                  value={reviewForm.communicationRating}
                  onChange={(v) => setReviewForm({...reviewForm, communicationRating: v})}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Quality</label>
                <StarRating
                  value={reviewForm.qualityRating}
                  onChange={(v) => setReviewForm({...reviewForm, qualityRating: v})}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Timeliness</label>
                <StarRating
                  value={reviewForm.timelinessRating}
                  onChange={(v) => setReviewForm({...reviewForm, timelinessRating: v})}
                />
              </div>

              <textarea
                required
                minLength={10}
                maxLength={1000}
                value={reviewForm.comment}
                onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                placeholder="Describe your experience..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white"
                rows="4"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedOrderId(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black"
                >
                  Submit Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-white mb-3">
              Delete Project Brief
            </h3>

            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete this project?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteJob}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
