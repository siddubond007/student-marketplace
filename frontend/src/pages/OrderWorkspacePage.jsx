import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, FileText, Send, AlertTriangle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';

export default function OrderWorkspacePage({ currentUser }) {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [deliverLink, setDeliverLink] = useState('');
  const [deliverNote, setDeliverNote] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Welcome to Order Workspace. Realtime AI chat filter active.' }
  ]);
  const [chatWarning, setChatWarning] = useState('');

  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState('');

  const isClient = currentUser?.id === order?.clientId;
  const isSeller = currentUser?.id === order?.sellerId;
  const isFunded = ['FUNDED_IN_ESCROW', 'REQUIREMENTS_SUBMITTED', 'IN_PROGRESS', 'DELIVERED', 'REVISION_REQUESTED', 'IN_REVIEW', 'DISPUTED', 'COMPLETED'].includes(order?.status);
  const canDeliver = isSeller && ['FUNDED_IN_ESCROW', 'REQUIREMENTS_SUBMITTED', 'IN_PROGRESS', 'REVISION_REQUESTED', 'IN_REVIEW'].includes(order?.status);
  const canApprove = isClient && ['DELIVERED', 'IN_REVIEW'].includes(order?.status);

  useEffect(() => {
    API.get(`/orders/${orderId}`)
      .then(res => {
        if (res.data) setOrder(res.data);
      })
      .catch(() => {});

    API.get(`/orders/${orderId}/messages`)
      .then(res => {
        setChatMessages(
          res.data.map(m => ({
            sender: m.sender?.fullName || 'User',
            text: m.content
          }))
        );
      })
      .catch(() => {});
  }, [orderId]);

  const handleDeliver = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/orders/${orderId}/deliver`, { driveLinks: [deliverLink], message: deliverNote });
      alert('Work submitted! 5-day client review timer started.');
      confetti();
      window.location.reload();
    } catch (err) {
      alert('Error submitting work.');
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Approve work and release escrow payout?')) return;
    try {
      const res = await API.post(`/orders/${orderId}/approve`);
      confetti({ particleCount: 200, spread: 100 });
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert('Error approving order.');
    }
  };


  const handleOpenDispute = async () => {
    if (!disputeReason.trim()) {
      alert('Please enter a dispute reason.');
      return;
    }

    try {
      const res = await API.post('/disputes', {
        orderId,
        reason: disputeReason,
        evidence: disputeEvidence
      });

      alert(res.data.message || 'Dispute opened successfully.');
      setShowDisputeModal(false);
      window.location.reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to open dispute.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const leakPattern = /(phone|call|whatsapp|gpay|paytm|upi|telegram|@|\b\d{10}\b)/i;
    if (leakPattern.test(chatInput)) {
      setChatWarning('🚨 AI Safety Alert: Message blocked. Sharing contact numbers or external payments violates safety rules.');
      setTimeout(() => setChatWarning(''), 6000);
      setChatInput('');
      return;
    }

    try {
      const res = await API.post(`/orders/${orderId}/messages`, {
        content: chatInput
      });

      setChatMessages(prev => [
        ...prev,
        {
          sender: res.data.sender?.fullName || 'You',
          text: res.data.content
        }
      ]);

      setChatInput('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const statusMeta = {
    PENDING_PAYMENT: {
      label: 'Payment Pending',
      tone: 'amber',
      step: 0,
      next: isClient ? 'Complete payment to secure the project.' : 'Awaiting client payment.'
    },
    FUNDED_IN_ESCROW: {
      label: 'Funded in Escrow',
      tone: 'emerald',
      step: 1,
      next: isSeller ? 'Review the scope and start the project.' : 'Project secured in escrow; work is ready to begin.'
    },
    REQUIREMENTS_SUBMITTED: {
      label: 'Requirements Submitted',
      tone: 'cyan',
      step: 2,
      next: isSeller ? 'Continue working and prepare the delivery.' : 'Requirements are being worked on.'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      tone: 'cyan',
      step: 2,
      next: isSeller ? 'Continue the work and submit deliverables when ready.' : 'Track progress and collaborate with the freelancer.'
    },
    DELIVERED: {
      label: 'Delivered',
      tone: 'violet',
      step: 3,
      next: isClient ? 'Review the submitted deliverables.' : 'Awaiting client review.'
    },
    REVISION_REQUESTED: {
      label: 'Revision Requested',
      tone: 'amber',
      step: 2,
      next: isSeller ? 'Address the revision request and resubmit.' : 'Waiting for the revised delivery.'
    },
    IN_REVIEW: {
      label: 'In Review',
      tone: 'violet',
      step: 4,
      next: isClient ? 'Review and approve the delivery.' : 'Awaiting client review.'
    },
    COMPLETED: {
      label: 'Completed',
      tone: 'emerald',
      step: 5,
      next: 'Project completed and payment released.'
    },
    DISPUTED: {
      label: 'Disputed',
      tone: 'red',
      step: 4,
      next: 'Review the dispute case and its resolution status.'
    },
    CANCELLED_REFUNDED: {
      label: 'Cancelled / Refunded',
      tone: 'slate',
      step: 0,
      next: 'This order is no longer active.'
    }
  };

  const meta = statusMeta[order?.status] || {
    label: 'Loading',
    tone: 'slate',
    step: 0,
    next: 'Loading workspace state...'
  };

  const progressSteps = [
    'Paid',
    'Accepted',
    'In Progress',
    'Delivered',
    'Review',
    'Completed'
  ];

  const toneClasses = {
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    violet: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    red: 'border-red-500/30 bg-red-500/10 text-red-300',
    slate: 'border-slate-700 bg-slate-800/40 text-slate-300'
  };

  const projectTitle =
    order?.job?.title ||
    order?.gig?.title ||
    order?.GigPackage?.tierName ||
    `Order #${orderId?.slice(0, 8)}`;

  const daysRemaining = order?.deadline
    ? Math.ceil((new Date(order.deadline).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="space-y-6 pb-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal</span>
      </Link>

      <section className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-7">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">
              Order Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-2 break-words">
              {projectTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400">
              <span>Order #{orderId?.slice(0, 8)}</span>
              <span>•</span>
              <span>{isClient ? 'Client view' : isSeller ? 'Freelancer view' : 'Administrator view'}</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:justify-end gap-3">
            <div className={`px-4 py-3 rounded-2xl border ${toneClasses[meta.tone]}`}>
              <div className="text-[9px] font-black uppercase tracking-widest opacity-70">
                Current Status
              </div>
              <div className="text-sm font-black mt-1">{meta.label}</div>
            </div>

            <div className="px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950/70">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Escrow
              </div>
              <div className="text-sm font-black text-white mt-1">
                {order?.totalAmount != null ? `₹${Number(order.totalAmount).toLocaleString('en-IN')}` : '—'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {isFunded ? 'Held in escrow' : 'Payment pending'}
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950/70">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Deadline
              </div>
              <div className="text-sm font-black text-white mt-1">
                {order?.deadline
                  ? new Date(order.deadline).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : '—'}
              </div>
              <div className={`text-[10px] mt-0.5 ${daysRemaining != null && daysRemaining < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                {daysRemaining == null
                  ? 'No deadline available'
                  : daysRemaining < 0
                    ? `${Math.abs(daysRemaining)} day(s) overdue`
                    : `${daysRemaining} day(s) remaining`}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
            Action Required
          </div>
          <div className="text-lg font-black text-white mt-1">{meta.next}</div>

          <div className="flex flex-wrap gap-3 mt-4">
            {canDeliver && (
              <button
                type="button"
                onClick={() => document.getElementById('delivery-center')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-5 py-3 neon-airflow-btn text-white text-xs font-black rounded-xl"
              >
                Submit Deliverables
              </button>
            )}

            {canApprove && (
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black rounded-xl"
              >
                Approve & Release
              </button>
            )}

            {isClient && order?.status === 'PENDING_PAYMENT' && (
              <div className="px-5 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs font-bold text-amber-300">
                Payment required to continue
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Project Progress
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {meta.label}
              </div>
            </div>
            <div className="text-[10px] font-bold text-slate-500">
              Step {Math.min(meta.step + 1, progressSteps.length)} / {progressSteps.length}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {progressSteps.map((step, index) => {
              const complete = meta.step > index;
              const current = meta.step === index;

              return (
                <div
                  key={step}
                  className={`rounded-xl border px-3 py-3 ${
                    current
                      ? 'border-indigo-500/40 bg-indigo-500/10'
                      : complete
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black mb-2 ${
                    current
                      ? 'bg-indigo-500 text-white'
                      : complete
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-500'
                  }`}>
                    {complete ? '✓' : index + 1}
                  </div>
                  <div className={`text-[10px] font-black ${
                    current ? 'text-white' : complete ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <section className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-sm font-black text-white">Project Details</h2>
                <p className="text-[10px] text-slate-500 mt-0.5">Authoritative project context</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Description
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">
                  {order?.job?.description || order?.gig?.description || 'No project description provided.'}
                </p>
              </div>

              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Requirements / Scope
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">
                  {order?.job?.requirements || order?.requirements || 'No additional requirements recorded.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(order?.job?.skills?.length ? order.job.skills : []).map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                        {skill}
                      </span>
                    ))}
                    {!order?.job?.skills?.length && (
                      <span className="text-xs text-slate-500">No skills specified.</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Deliverables
                  </div>
                  <p className="text-sm text-slate-300">
                    {order?.job?.deliverables?.length
                      ? order.job.deliverables.join(', ')
                      : 'No deliverable scope recorded yet.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="delivery-center" className="glass-panel p-6 rounded-3xl border border-slate-800">
            {canDeliver ? (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h2 className="text-sm font-black text-white">Delivery Center</h2>
                <form onSubmit={handleDeliver} className="space-y-3">
                  <input
                    required
                    type="url"
                    value={deliverLink}
                    onChange={e => setDeliverLink(e.target.value)}
                    placeholder="Google Drive / GitHub Deliverable Link"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                  <textarea
                    rows="3"
                    value={deliverNote}
                    onChange={e => setDeliverNote(e.target.value)}
                    placeholder="Delivery notes..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 neon-airflow-btn text-white text-xs font-black rounded-xl"
                  >
                    Submit Deliverables
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h2 className="text-sm font-black text-white mb-3">Delivery Center</h2>
                {order?.deliverables?.length ? (
                  <div className="space-y-3">
                    {order.deliverables.map((d, index) => (
                      <div key={d.id || index} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                          Submission {order.deliverables.length - index}
                        </div>
                        <div className="text-xs text-slate-300 mt-2 whitespace-pre-wrap">
                          {d.message || 'Deliverable submitted.'}
                        </div>
                        {d.driveLinks?.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {d.driveLinks.map(link => (
                              <a
                                key={link}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-xs text-indigo-400 hover:underline break-all"
                              >
                                {link}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-xs text-slate-500">
                    No deliverables submitted yet.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h2 className="text-sm font-black text-white mb-4">Participants</h2>

            <div className="space-y-3">
              {[
                { label: 'Client', user: order?.client },
                { label: 'Freelancer', user: order?.seller }
              ].map(({ label, user }) => (
                <div key={label} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {label}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    {user?.profile?.avatarUrl ? (
                      <img
                        src={user.profile.avatarUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-slate-300">
                        {user?.fullName?.slice(0, 2)?.toUpperCase() || '—'}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="text-sm font-black text-white truncate">
                        {user?.fullName || 'Unknown user'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {user?.username ? `@${user.username}` : user?.profile?.tagline || 'Marketplace participant'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
                    <div className="p-2.5 rounded-xl bg-slate-900">
                      <div className="text-slate-500">Rating</div>
                      <div className="font-black text-white mt-1">
                        {Number(user?.averageRating || 0).toFixed(1)} / 5
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900">
                      <div className="text-slate-500">Reviews</div>
                      <div className="font-black text-white mt-1">
                        {user?.totalReviews || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h2 className="text-sm font-black text-white mb-4">Payment Summary</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Project price</span>
                <span className="font-black text-white">₹{Number(order?.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Platform fee</span>
                <span className="font-bold text-slate-300">₹{Number(order?.platformFee || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-800 pt-3">
                <span className="text-slate-400">Freelancer earnings</span>
                <span className="font-black text-emerald-300">₹{Number(order?.sellerEarnings || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                {isFunded ? 'Funds are currently represented as secured in escrow.' : 'Payment has not yet been secured.'}
              </div>
            </div>
          </section>

          {(isClient || isSeller) && (
            <section className="glass-panel p-6 rounded-3xl border border-slate-800">
              <h2 className="text-sm font-black text-white mb-4">Protection</h2>

              {canApprove && (
                <button
                  onClick={handleApprove}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Release
                </button>
              )}

              <button
                onClick={() => setShowDisputeModal(true)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl mt-3 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Open Dispute
              </button>
            </section>
          )}
        </div>
      </div>

      <section className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-slate-800 text-xs font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AI Monitored Escrow Chat</span>
        </div>

        <div className="h-[360px] p-4 overflow-y-auto space-y-2 text-xs bg-slate-950/40">
          {chatMessages.map((m, i) => {
            const mine = m.sender === currentUser?.fullName;
            return (
              <div key={i} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                <div className={`text-[10px] mb-1 ${mine ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {m.sender}
                </div>
                <div className={`p-2.5 rounded-xl max-w-xl ${
                  mine ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300'
                }`}>
                  {m.text}
                </div>
              </div>
            );
          })}

          {chatWarning && (
            <div className="p-2 bg-red-500/20 text-red-300 rounded-xl text-xs">
              {chatWarning}
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 neon-airflow-btn text-white rounded-xl text-xs font-bold"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </section>

      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-black text-white mb-4">Open Dispute</h3>

            <textarea
              rows="4"
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
              placeholder="Explain the issue..."
              className="w-full mb-3 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />

            <input
              type="text"
              value={disputeEvidence}
              onChange={e => setDisputeEvidence(e.target.value)}
              placeholder="Evidence link (optional)"
              className="w-full mb-4 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleOpenDispute}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
