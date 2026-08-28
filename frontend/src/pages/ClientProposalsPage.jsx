import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function ClientProposalsPage() {
  const { projectId } = useParams();

  const [job, setJob] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uiModal, setUiModal] = useState({
    open: false,
    type: 'info',
    title: '',
    message: '',
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',
    onConfirm: null
  });

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const showModal = (config) => {
    setUiModal({
      open: true,
      type: config.type || 'info',
      title: config.title || 'SkillLaunch',
      message: config.message || '',
      confirmLabel: config.confirmLabel || 'OK',
      cancelLabel: config.cancelLabel || 'Cancel',
      onConfirm: config.onConfirm || null
    });
  };

  const closeModal = () => {
    setUiModal(prev => ({ ...prev, open: false, onConfirm: null }));
  };

  const refreshPageState = async () => {
    const [jobRes, ordersRes] = await Promise.all([
      API.get(`/jobs/${projectId}`),
      API.get('/orders')
    ]);
    setJob(jobRes.data);
    setOrders(ordersRes.data || []);
  };

  useEffect(() => {
    Promise.all([
      API.get(`/jobs/${projectId}`),
      API.get('/orders')
    ])
      .then(([jobRes, ordersRes]) => {
        setJob(jobRes.data);
        setOrders(ordersRes.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [projectId]);

  const updateProposalStatus = async (bidId, action) => {
    if (hasVerifiedHire) {
      showModal({
        type: 'warning',
        title: 'Freelancer Already Hired',
        message: 'A freelancer has already been hired for this project. The selected freelancer cannot be changed after payment verification.',
        confirmLabel: 'Understood'
      });
      return;
    }

    try {
      const res = await API.post(
        `/jobs/${projectId}/${action}/${bidId}`
      );

      await refreshPageState();

      showModal({
        type: 'success',
        title: action === 'shortlist-bid' ? 'Proposal Shortlisted' : 'Proposal Rejected',
        message: res.data?.message || 'Proposal updated successfully.',
        confirmLabel: 'Done'
      });
    } catch (err) {
      showModal({
        type: 'error',
        title: 'Action Failed',
        message: err?.response?.data?.error || 'Failed to update proposal.',
        confirmLabel: 'Close'
      });
    }
  };

  const hireStudent = async (bidId, amount) => {
    if (hasVerifiedHire) {
      showModal({
        type: 'warning',
        title: 'Freelancer Already Hired',
        message: 'This project already has a verified hired freelancer. A second freelancer cannot be hired for the same project.',
        confirmLabel: 'Understood'
      });
      return;
    }

    if (hasPendingPayment) {
      showModal({
        type: 'warning',
        title: 'Payment Still Pending',
        message: 'A payment attempt is already in progress for this project. Complete or cancel that checkout before starting another hiring attempt.',
        confirmLabel: 'Understood'
      });
      return;
    }

    const confirmed = await new Promise((resolve) => {
      showModal({
        type: 'warning',
        title: 'Important: Choose Carefully',
        message: `You are selecting this freelancer for ₹${amount}. Please review your choice carefully before continuing. Once payment is successfully verified and escrow is funded, this freelancer cannot be changed and another freelancer cannot be hired for this project.`,
        confirmLabel: 'Continue to Secure Payment',
        cancelLabel: 'Go Back',
        onConfirm: () => resolve(true)
      });
    });

    if (!confirmed) return;

    closeModal();

    try {
      const res = await API.post(`/jobs/${projectId}/accept-bid/${bidId}`);
      
      if (res.data?.checkoutRequired && res.data?.order?.razorpayOrderId) {
        let paymentFlowSettled = false;
        let cancellationStarted = false;

        const cancelPendingHiring = async () => {
          if (paymentFlowSettled || cancellationStarted) return;

          cancellationStarted = true;
          try {
            await API.post(`/jobs/${projectId}/cancel-hiring`);
          } catch (cancelErr) {
            console.error('Failed to cancel pending hiring reservation:', cancelErr);
          }
        };

        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          await cancelPendingHiring();
          showModal({
            type: 'error',
            title: 'Payment Gateway Unavailable',
            message: 'The payment gateway could not be loaded. Your hiring reservation has been released and the project remains available.',
            confirmLabel: 'Close'
          });
          await refreshPageState();
          return;
        }

        const refreshJob = async () => {
          try {
            const refreshed = await API.get(`/jobs/${projectId}`);
            setJob(refreshed.data);
          } catch (refreshErr) {
            console.error('Failed to refresh project state:', refreshErr);
          }
        };

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
          amount: Math.round(res.data.order.totalAmount * 100),
          currency: 'INR',
          name: 'SkillLaunch Escrow',
          description: `Project Funding: ${job?.title || 'Deliverables'}`,
          order_id: res.data.order.razorpayOrderId,
          handler: async function (response) {
            try {
              const verification = await API.post(
                `/orders/${res.data.order.id}/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }
              );

              paymentFlowSettled = true;

              await refreshPageState();

              showModal({
                type: 'success',
                title: 'Freelancer Hired Successfully',
                message: verification.data?.message ||
                  'Payment verified successfully. Escrow is funded and the freelancer is now hired for this project.',
                confirmLabel: 'Done'
              });
            } catch (verifyErr) {
              console.error('Razorpay verification failed:', verifyErr);

              showModal({
                type: 'warning',
                title: 'Payment Received — Verification Pending',
                message:
                  verifyErr?.response?.data?.error ||
                  'Razorpay reported the payment, but SkillLaunch could not verify it immediately. The project will not be marked as hired until payment verification succeeds.',
                confirmLabel: 'Close'
              });

              await refreshPageState();
            }
          },
          modal: {
            ondismiss: async function () {
              if (paymentFlowSettled) return;

              await cancelPendingHiring();
              await refreshPageState();
              showModal({
                type: 'info',
                title: 'Hiring Attempt Cancelled',
                message: 'No freelancer was hired. The project is available again, and you may choose the same freelancer or another proposal.',
                confirmLabel: 'Got It'
              });
            }
          },
          prefill: {
            name: 'Client Account',
            email: 'client@skilllaunch.com'
          },
          theme: {
            color: '#4f46e5'
          }
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', async function (response) {
          await cancelPendingHiring();
          await refreshPageState();
          showModal({
            type: 'error',
            title: 'Payment Failed',
            message: (response?.error?.description || 'The payment was not completed.') + ' No freelancer was hired, and the project remains available.',
            confirmLabel: 'Close'
          });
        });

        rzp.open();
      } else {
         // Fallback if no checkout required (e.g., zero amount or testing)
         await refreshPageState();
         showModal({
           type: 'success',
           title: 'Hiring Completed',
           message: res.data?.message || 'The freelancer has been hired successfully.',
           confirmLabel: 'Done'
         });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      showModal({
        type: 'error',
        title: 'Hiring Failed',
        message: err?.response?.data?.error || 'Failed to initialize escrow funding. No freelancer has been hired.',
        confirmLabel: 'Close'
      });
      try {
        await refreshPageState();
      } catch (refreshErr) {
        console.error('Failed to refresh hiring state:', refreshErr);
      }
    }
  };

  const pendingPaymentOrder = orders.find(
    order => order.jobId === projectId && order.status === 'PENDING_PAYMENT'
  );

  const hasPendingPayment = Boolean(pendingPaymentOrder);

  const hasVerifiedHire = Boolean(
    job &&
    ['IN_PROGRESS', 'COMPLETED'].includes(String(job.status || '').toUpperCase())
  ) || orders.some(
    order =>
      order.jobId === projectId &&
      ['FUNDED_IN_ESCROW', 'REQUIREMENTS_SUBMITTED', 'IN_PROGRESS', 'DELIVERED', 'REVISION_REQUESTED', 'IN_REVIEW', 'DISPUTED', 'COMPLETED'].includes(order.status)
  );

  const hasActiveHiringLock = hasPendingPayment || hasVerifiedHire;

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
    <>
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
                disabled={hasActiveHiringLock}
                onClick={() => updateProposalStatus(bid.id, 'shortlist-bid')}
                className={`px-4 py-2 rounded-xl text-white text-sm font-bold ${hasActiveHiringLock ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60' : 'bg-amber-600 hover:bg-amber-500'}`}
              >
                Shortlist
              </button>

              <button
                disabled={hasActiveHiringLock}
                onClick={() => updateProposalStatus(bid.id, 'reject-bid')}
                className={`px-4 py-2 rounded-xl text-white text-sm font-bold ${hasActiveHiringLock ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60' : 'bg-red-600 hover:bg-red-500'}`}
              >
                Reject
              </button>

              {hasVerifiedHire ? (
                <span className="px-4 py-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 rounded-xl text-sm font-bold">
                  {bid.status === 'HIRED' ? '✓ Hired for This Project' : 'Project Already Hired'}
                </span>
              ) : hasPendingPayment ? (
                <span className="px-4 py-2 bg-amber-500/15 border border-amber-400/30 text-amber-300 rounded-xl text-sm font-bold">
                  Payment Pending
                </span>
              ) : (
                <button
                  onClick={() => hireStudent(bid.id, bid.proposedAmount)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-sm font-bold"
                >
                  Hire Student
                </button>
              )}

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

      {uiModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="p-6">
              <div className={`text-xs font-black uppercase tracking-[0.18em] mb-2 ${
                uiModal.type === 'error'
                  ? 'text-red-400'
                  : uiModal.type === 'success'
                    ? 'text-emerald-400'
                    : uiModal.type === 'warning'
                      ? 'text-amber-400'
                      : 'text-indigo-400'
              }`}>
                SkillLaunch Notice
              </div>

              <h2 className="text-2xl font-black text-white">
                {uiModal.title}
              </h2>

              <p className="text-sm leading-6 text-slate-300 mt-3 whitespace-pre-line">
                {uiModal.message}
              </p>

              <div className="flex justify-end gap-3 mt-6">
                {uiModal.onConfirm && (
                  <button
                    type="button"
                    onClick={() => {
                      const confirmAction = uiModal.onConfirm;
                      closeModal();
                      confirmAction();
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black"
                  >
                    {uiModal.confirmLabel}
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-black"
                >
                  {uiModal.onConfirm ? uiModal.cancelLabel : uiModal.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
