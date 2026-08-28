import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function ClientProposalsPage() {
  const { projectId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  useEffect(() => {
    API.get(`/jobs/${projectId}`)
      .then(res => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [projectId]);

  const updateProposalStatus = async (bidId, action) => {
    try {
      const res = await API.post(
        `/jobs/${projectId}/${action}/${bidId}`
      );

      alert(res.data?.message || 'Proposal updated');

      const refreshed = await API.get(`/jobs/${projectId}`);
      setJob(refreshed.data);
    } catch (err) {
      alert(
        err?.response?.data?.error ||
        'Failed to update proposal'
      );
    }
  };

  const hireStudent = async (bidId, amount) => {
    try {
      const confirmHire = window.confirm(`You are about to hire this freelancer for ₹${amount}. This will redirect you to secure the funds in escrow. Proceed?`);
      if (!confirmHire) return;

      const res = await API.post(`/jobs/${projectId}/accept-bid/${bidId}`);
      
      if (res.data?.checkoutRequired && res.data?.order?.razorpayOrderId) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          alert('Failed to load payment gateway. Please check your connection.');
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', // Ensure this is in frontend/.env
          amount: Math.round(res.data.order.totalAmount * 100), // convert to paise
          currency: 'INR',
          name: 'SkillLaunch Escrow',
          description: `Project Funding: ${job?.title || 'Deliverables'}`,
          order_id: res.data.order.razorpayOrderId,
          handler: function (response) {
             // Webhook handles backend status, frontend just updates UI
             alert('Escrow funded successfully! The freelancer has been hired.');
             API.get(`/jobs/${projectId}`).then(refreshed => setJob(refreshed.data));
          },
          prefill: {
            name: 'Client Account',
            email: 'client@skilllaunch.com'
          },
          theme: {
            color: '#4f46e5' // Indigo
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
           alert('Payment Failed: ' + response.error.description);
        });
        rzp.open();
      } else {
         // Fallback if no checkout required (e.g., zero amount or testing)
         alert(res.data?.message || 'Student hired successfully');
         const refreshed = await API.get(`/jobs/${projectId}`);
         setJob(refreshed.data);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err?.response?.data?.error || 'Failed to initialize escrow funding');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading proposals...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 text-white">
        Project not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-3xl font-black text-white">
          Proposals
        </h1>

        <p className="text-slate-400 mt-2">
          {job.title}
        </p>

        <div className="mt-3 text-slate-300">
          Total Proposals: {job.bids?.length || 0}
        </div>
      </div>

      {!job.bids?.length ? (
        <div className="glass-panel p-10 rounded-3xl border border-slate-800 text-center">
          <h2 className="text-white text-xl font-bold">
            No proposals yet
          </h2>

          <p className="text-slate-400 mt-2">
            Student proposals will appear here.
          </p>
        </div>
      ) : (
        job.bids.map(bid => (
          <div
            key={bid.id}
            className="glass-panel p-6 rounded-3xl border border-slate-800"
          >
            <div className="flex justify-between flex-wrap gap-4">

              <div>
                <h3 className="text-xl font-bold text-white">
                  {bid.student?.fullName || 'Student'}
                </h3>

                <div className="text-slate-400 mt-2">
                  Submitted:
                  {' '}
                  {new Date(bid.createdAt).toLocaleDateString()}
                </div>

                <div className="mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-white">
                    {bid.status || 'PENDING'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-indigo-400 font-black text-xl">
                  ₹{bid.proposedAmount}
                </div>

                <div className="text-slate-400">
                  {bid.deliveryDays} Days
                </div>
              </div>

            </div>

            <div className="mt-5">
              <h4 className="text-white font-bold mb-2">
                Cover Letter
              </h4>

              <p className="text-slate-300 whitespace-pre-wrap">
                {bid.coverLetter}
              </p>
            </div>

            <div className="mt-5 flex gap-3 flex-wrap">

              <button
                onClick={() => updateProposalStatus(bid.id, 'shortlist-bid')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white text-sm font-bold"
              >
                Shortlist
              </button>

              <button
                onClick={() => updateProposalStatus(bid.id, 'reject-bid')}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-white text-sm font-bold"
              >
                Reject
              </button>

              <button
                onClick={() => hireStudent(bid.id, bid.proposedAmount)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-sm font-bold"
              >
                Hire Student
              </button>

              <Link
                to={`/u/${bid.student?.id}`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm font-bold"
              >
                View Student Profile
              </Link>

            </div>
          </div>
        ))
      )}

    </div>
  );
}
