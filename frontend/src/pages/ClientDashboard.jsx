import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, PlusCircle, Trash2, Star } from 'lucide-react';
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
    API.get('/jobs/my-projects')
      .then(res => setJobs(res.data || []))
      .catch(() => {});

    API.get('/orders')
      .then(res => setOrders(res.data || []))
      .catch(() => {});
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
    <div className="space-y-8 pb-16">

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-black text-emerald-400 mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Verified Client Management Portal</span>
          </div>

          <h2 className="text-3xl font-black text-white">
            {currentUser?.fullName}
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            {currentUser?.email}
          </p>
        </div>

        <button
          onClick={() => setShowPostJobModal(true)}
          className="px-6 py-3 neon-airflow-btn text-white rounded-2xl text-xs font-black shadow-xl flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project Brief</span>
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-wrap gap-2 mb-5">

          {[
            'ALL',
            'DRAFTS',
            'PUBLISHED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED'
          ].map(item => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-2 rounded-xl text-xs font-bold ${
                filter === item
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}
            >
              {item.replace('_', ' ')}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-black text-white mb-4">
          My Projects ({filteredJobs.length})
        </h3>

        {filteredJobs.length === 0 ? (
          <div className="text-center p-10 bg-slate-950/40 rounded-2xl">
            <h4 className="text-white font-bold mb-2">
              No projects yet
            </h4>

            <p className="text-slate-400 text-sm mb-4">
              Post your first job and start finding student freelancers.
            </p>

            <button
              onClick={() => setShowPostJobModal(true)}
              className="px-5 py-3 neon-airflow-btn rounded-xl text-white text-sm font-bold"
            >
              Post a Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] uppercase font-black text-indigo-400">
                        {job.category}
                      </span>

                      <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-200">
                        {getStatusLabel(job)}
                      </span>
                    </div>

                    <h4 className="text-white text-lg font-bold">
                      {job.title}
                    </h4>

                    <div className="text-sm text-slate-400">
                      Budget: ₹{job.budget}
                    </div>

                    <div className="text-sm text-slate-400">
                      Proposals: {job.bids?.length || 0}
                    </div>

                    <div className="text-sm text-slate-400">
                      Deadline: {(job.timeline || 'Not specified').toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </div>

                    <div className="text-xs text-slate-500">
                      Created: {new Date(job.createdAt).toLocaleDateString()}
                    </div>

                    <div className="text-xs text-slate-500">
                      Updated: {new Date(job.updatedAt).toLocaleDateString()}
                    </div>

                  </div>

                  <div className="flex flex-col gap-2">

                    {(job.status || '').toUpperCase() === 'DRAFT' ? (
                      <button
                        onClick={() =>
                          navigate(`/post-job?draftId=${job.id}`)
                        }
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white text-xs font-bold"
                      >
                        Continue Editing
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/my-projects/${job.id}`)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-bold"
                      >
                        View Job
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-white text-xs font-bold flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-black text-white">
          Hired Student Projects & Escrow ({orders.filter(o => o.status !== 'CANCELLED_REFUNDED').length})
        </h3>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">
            No active hired orders yet.
          </p>
        ) : (
          <div className="space-y-3">
            {orders
              .filter(o => o.status !== 'CANCELLED_REFUNDED')
              .map(o => (
              <div
                key={o.id}
                className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-black uppercase text-indigo-400">
                    Order #{o.id.slice(0, 8)}
                  </span>

                  <h4 className="text-sm font-bold text-white">
                    Student: {o.seller?.fullName}
                  </h4>

                  <span className="text-xs text-slate-400">
                    Escrow Status: {o.status === 'PENDING_PAYMENT' ? 'Payment Pending' : o.status}
                  </span>
                </div>

                  {o.status === "COMPLETED" && (() => {
                    const clientReviewed = (o.reviews || []).some(
                      r => r.reviewerId === o.client?.id
                    );

                    const freelancerReviewed = (o.reviews || []).some(
                      r => r.reviewerId === o.seller?.id
                    );

                    return (
                      <div className="flex flex-col items-end gap-2 mr-2">
                        <div className="flex gap-2 text-[10px] font-black">
                          <span className={clientReviewed ? "text-emerald-400" : "text-slate-500"}>
                            Client Reviewed {clientReviewed ? "✓" : "✗"}
                          </span>

                          <span className={freelancerReviewed ? "text-emerald-400" : "text-slate-500"}>
                            Freelancer Reviewed {freelancerReviewed ? "✓" : "✗"}
                          </span>
                        </div>

                        {clientReviewed ? (
                          <span className="px-4 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl">
                            Review Submitted
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedOrderId(o.id);
                              setShowReviewModal(true);
                            }}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black rounded-xl"
                          >
                            Leave Review
                          </button>
                        )}
                      </div>
                    );
                  })()}

                <Link
                  to={`/orders/${o.id}`}
                  className="px-5 py-2 neon-airflow-btn text-white text-xs font-black rounded-xl"
                >
                  Open Project Room →
                </Link>
              </div>
            ))}
          </div>
        )}
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
