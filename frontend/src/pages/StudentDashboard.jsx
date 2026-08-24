import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Award, ShieldCheck, Zap, PlusCircle, ArrowUpRight, FolderPlus, PackageCheck, Upload, FileText, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';

const getReputationLevel = (points = 0) => {
  if (points >= 1000) return { title: 'Legend', color: 'text-yellow-400' };
  if (points >= 500) return { title: 'Elite', color: 'text-purple-400' };
  if (points >= 250) return { title: 'Professional', color: 'text-indigo-400' };
  if (points >= 100) return { title: 'Trusted', color: 'text-emerald-400' };
  return { title: 'Rookie', color: 'text-slate-400' };
};


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


export default function StudentDashboard({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCreateGigModal, setShowCreateGigModal] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    overallRating: 5,
    communicationRating: 5,
    qualityRating: 5,
    timelinessRating: 5,
    comment: ""
  });

  const [gigForm, setGigForm] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    price: '999',
    deliveryDays: '2'
  });

  const [withdrawForm, setWithdrawForm] = useState({ upiId: '', amount: '500' });

  const hasReviewedOrder = (order) => {
    return (order.reviews || []).some(
      review => review.reviewerId === currentUser?.id
    );
  };

  const getReviewCountForOrder = (order) => {
    return (order.reviews || []).length;
  };


  useEffect(() => {
    API.get('/orders').then(res => setOrders(res.data || [])).catch(() => {});
    API.get('/gigs').then(res => setGigs(res.data || [])).catch(() => {});
  }, []);

  const handleCreateGig = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/gigs', {
        title: gigForm.title,
        category: gigForm.category,
        description: gigForm.description,
        packages: [{ tierName: 'Single', price: Number(gigForm.price), deliveryDays: Number(gigForm.deliveryDays), revisions: 2, description: 'Standard Service' }]
      });
      setGigs([res.data, ...gigs]);
      setShowCreateGigModal(false);
      confetti();
    } catch (err) {
      alert(err.response?.data?.error || 'Error publishing gig');
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

  const handleWithdraw = async (e) => {
    e.preventDefault();

    try {
      await API.post('/payouts', {
        amount: Number(withdrawForm.amount),
        upiId: withdrawForm.upiId
      });

      alert('Withdrawal request submitted successfully.');

      setShowWithdrawModal(false);

      setWithdrawForm({
        upiId: '',
        amount: '500'
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit withdrawal request.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Student Portal Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-black text-indigo-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Student Freelancer Workspace</span>
          </div>
          <h2 className="text-3xl font-black text-white">{currentUser?.fullName}</h2>
          <p className="text-xs text-slate-400 mt-1">{currentUser?.email} • Age: {currentUser?.age || 20} Years Old</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowVerifyModal(true)}
            className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-white rounded-xl text-xs font-black transition flex items-center space-x-2"
          >
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Upload Student ID Card</span>
          </button>
          <button 
            onClick={() => setShowCreateGigModal(true)}
            className="px-5 py-2.5 neon-airflow-btn text-white rounded-xl text-xs font-black shadow-lg flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Gig</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-black uppercase">Cleared Wallet Balance</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">₹{currentUser?.wallet?.availableBalance ?? 939}.00</div>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black rounded-xl transition flex items-center justify-center space-x-1.5"
          >
            <span>Withdraw via UPI</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-black uppercase">Monthly Proposal Quota</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{currentUser?.freeBidsRemaining ?? 15} Free Bids Left</div>
          <p className="text-[11px] text-slate-500">Refreshes every 30 days automatically</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-black uppercase">Student Reputation</span>
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{currentUser?.points ?? 50} Points</div>
          <div className={`text-sm font-black ${getReputationLevel(currentUser?.points ?? 50).color}`}>
            {getReputationLevel(currentUser?.points ?? 50).title}
          </div>
          <p className="text-[11px] text-emerald-400 font-bold">0/3 Strikes • Excellent Standing</p>
        </div>
      </div>

      {/* Student's Orders */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-black text-white">Active Client Orders ({orders.length})</h3>
        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No active client orders yet. Publish gigs or bid on client jobs to get hired!</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-black uppercase text-indigo-400">Order #{order.id.slice(0, 8)}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Client: {order.client?.fullName}</h4>
                  <span className="text-xs text-slate-400">Status: {order.status}</span>
                </div>
                <div className="flex items-center space-x-4">

                  {order.status === "COMPLETED" && (
                    hasReviewedOrder(order) ? (
                      <span className="px-3 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl">
                        Review Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setShowReviewModal(true);
                        }}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black rounded-xl"
                      >
                        Leave Review
                      </button>
                    )
                  )}

                  <div className="text-lg font-black text-emerald-400">₹{order.totalAmount}</div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 neon-airflow-btn text-white text-xs font-black rounded-xl"
                  >
                    Open Project Room →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateGigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="neon-border-box max-w-lg w-full p-7 shadow-2xl relative">
            <button onClick={() => setShowCreateGigModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-black text-white mb-4">Publish Student Service Gig</h3>
            <form onSubmit={handleCreateGig} className="space-y-4">
              <input required type="text" value={gigForm.title} onChange={e => setGigForm({...gigForm, title: e.target.value})} placeholder="Gig Title (e.g. React Web App)" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
              <input required type="number" value={gigForm.price} onChange={e => setGigForm({...gigForm, price: e.target.value})} placeholder="Starting Price in ₹" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
              <textarea required rows="3" value={gigForm.description} onChange={e => setGigForm({...gigForm, description: e.target.value})} placeholder="Service description..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
              <button type="submit" className="w-full py-3.5 neon-airflow-btn text-white text-xs font-black rounded-2xl uppercase">Publish to Marketplace</button>
            </form>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="neon-border-box max-w-md w-full p-7 shadow-2xl relative">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-black text-white mb-4">Withdraw via UPI</h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <input required type="text" value={withdrawForm.upiId} onChange={e => setWithdrawForm({...withdrawForm, upiId: e.target.value})} placeholder="Enter UPI ID (e.g. name@okhdfcbank)" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
              <input required type="number" min="100" value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-bold" />
              <button type="submit" className="w-full py-3.5 neon-airflow-btn text-white text-xs font-black rounded-2xl uppercase">Submit Instant Withdrawal</button>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg">
            <h3 className="text-xl font-black text-white mb-5">
              Leave Review
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">

                <StarRating
                  value={reviewForm.overallRating}
                  onChange={(v) =>
                    setReviewForm({
                      ...reviewForm,
                      overallRating: v
                    })
                  }
                />
                <p className="text-xs text-amber-400 -mt-2">
                  ⭐ Rate overall experience with the client
                </p>

                <StarRating
                  value={reviewForm.communicationRating}
                  onChange={(v) =>
                    setReviewForm({
                      ...reviewForm,
                      communicationRating: v
                    })
                  }
                />
                <p className="text-xs text-cyan-400 -mt-2">
                  💬 How well did the client communicate?
                </p>

                <StarRating
                  value={reviewForm.qualityRating}
                  onChange={(v) =>
                    setReviewForm({
                      ...reviewForm,
                      qualityRating: v
                    })
                  }
                />
                <p className="text-xs text-purple-400 -mt-2">
                  📋 Were requirements clear and detailed?
                </p>

                <StarRating
                  value={reviewForm.timelinessRating}
                  onChange={(v) =>
                    setReviewForm({
                      ...reviewForm,
                      timelinessRating: v
                    })
                  }
                />
                <p className="text-xs text-emerald-400 -mt-2">
                  💰 Was payment handled professionally?
                </p>

                <textarea
                rows="4"
                required
                value={reviewForm.comment}
                onChange={e => setReviewForm({...reviewForm, comment:e.target.value})}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                placeholder="Write your review..."
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-5 py-2 bg-slate-700 text-white rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white rounded-xl font-black"
                >
                  Submit Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
