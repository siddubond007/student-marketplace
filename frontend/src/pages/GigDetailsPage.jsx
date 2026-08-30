import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Star
} from 'lucide-react';
import API from '../services/api';

export default function GigDetailsPage({ currentUser }) {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [error, setError] = useState('');
  const [purchaseError, setPurchaseError] = useState('');

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const purchaseGig = async () => {
    if (!currentUser || !selectedPackage?.id) return;

    setPurchaseError('');

    try {
      const res = await API.post('/orders/gig-purchase', {
        gigId,
        gigPackageId: selectedPackage.id
      });

      const order = res.data?.order;

      if (res.data?.checkoutRequired && order?.razorpayOrderId) {
        const isLoaded = await loadRazorpay();

        if (!isLoaded) {
          setPurchaseError('Payment gateway could not be loaded. Please try again.');
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
          amount: Math.round(Number(order.totalAmount || 0) * 100),
          currency: 'INR',
          name: 'SkillLaunch Escrow',
          description: `${gig.title} — ${selectedPackage.tierName}`,
          order_id: order.razorpayOrderId,
          handler: async (response) => {
            try {
              await API.post(`/orders/${order.id}/verify-payment`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              navigate(`/orders/${order.id}`);
            } catch (verifyErr) {
              console.error('Gig payment verification failed:', verifyErr);
              setPurchaseError(
                verifyErr?.response?.data?.error ||
                'Payment was received, but verification could not be completed.'
              );
            }
          },
          modal: {
            ondismiss: () => {
              // The backend keeps the pending order; a later retry can use it.
            }
          },
          prefill: {
            name: currentUser?.fullName || 'Client Account',
            email: currentUser?.email || 'client@skilllaunch.com'
          },
          theme: {
            color: '#4f46e5'
          }
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', (response) => {
          setPurchaseError(
            response?.error?.description ||
            'The payment was not completed.'
          );
        });

        rzp.open();
        return;
      }

      if (order?.id) {
        navigate(`/orders/${order.id}`);
      }
    } catch (err) {
      console.error('Gig purchase initialization failed:', err);
      setPurchaseError(
        err?.response?.data?.error ||
        'Unable to start the purchase. Please try again.'
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    API.get(`/gigs/${gigId}`)
      .then((res) => {
        if (cancelled) return;

        const nextGig = res.data;
        setGig(nextGig);

        const firstPackage = Array.isArray(nextGig?.packages)
          ? nextGig.packages[0]
          : null;

        setSelectedPackageId(firstPackage?.id || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.error || 'Unable to load this gig.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gigId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-indigo-400">
        <div className="text-sm font-black uppercase tracking-widest animate-pulse">
          Loading Gig
        </div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <section className="glass-panel rounded-3xl border border-slate-800 p-8 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-red-300">
          Gig Unavailable
        </p>
        <h1 className="text-2xl font-black text-white mt-2">
          {error || 'This gig could not be found.'}
        </h1>
        <Link
          to="/gigs"
          className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-black text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gigs
        </Link>
      </section>
    );
  }

  const packages = Array.isArray(gig.packages) ? gig.packages : [];
  const selectedPackage =
    packages.find((item) => item.id === selectedPackageId) || packages[0] || null;

  const seller = gig.seller;
  const profile = seller?.profile;
  const reviewCount = seller?.totalReviews || 0;
  const rating = Number(seller?.averageRating || 0);

  return (
    <div className="space-y-6 pb-16">
      <Link
        to="/gigs"
        className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Gigs
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="h-64 sm:h-80 bg-slate-900">
              <img
                src={gig.coverImage}
                alt={gig.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-black text-cyan-300">
                  {gig.category || 'Service'}
                </span>

                {gig.subcategory && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-black text-slate-400">
                    {gig.subcategory}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white mt-4">
                {gig.title}
              </h1>

              <p className="text-base leading-7 text-slate-300 mt-5 whitespace-pre-wrap">
                {gig.description}
              </p>
            </div>
          </div>

          <section className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-xl font-black text-white">
                  Freelancer
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Review the creator before selecting a package.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={seller?.fullName || 'Freelancer'}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl font-black text-indigo-300">
                  {(seller?.fullName || 'S').charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-white">
                    {seller?.fullName || 'Freelancer'}
                  </h3>

                  {seller?.verification?.status === 'APPROVED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-400 mt-1">
                  {profile?.tagline || 'Student Freelancer'}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                  <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-4 h-4 fill-amber-300" />
                    {reviewCount > 0 ? rating.toFixed(1) : 'New'}
                  </span>

                  <span className="text-slate-500">
                    {reviewCount} review{reviewCount === 1 ? '' : 's'}
                  </span>

                  <span className="text-slate-500">
                    {profile?.college || 'Student Creator'}
                  </span>
                </div>
              </div>

              <Link
                to={`/u/${seller?.username || seller?.id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-sm font-black text-white"
              >
                View Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="glass-panel rounded-3xl border border-slate-800 p-6 sticky top-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">
                  Choose Package
                </p>
                <h2 className="text-xl font-black text-white mt-1">
                  Service Options
                </h2>
              </div>

              <span className="text-xs font-black text-slate-500">
                {packages.length} option{packages.length === 1 ? '' : 's'}
              </span>
            </div>

            {packages.length === 0 ? (
              <div className="p-4 rounded-2xl border border-dashed border-slate-700 text-sm text-slate-500">
                No packages are currently available for this gig.
              </div>
            ) : (
              <div className="space-y-3">
                {packages.map((item) => {
                  const selected = item.id === selectedPackage?.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPackageId(item.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition ${
                        selected
                          ? 'border-indigo-500/50 bg-indigo-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-black text-white">
                            {item.tierName}
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            {item.description || 'Standard service package'}
                          </p>
                        </div>

                        <p className="text-xl font-black text-emerald-300 shrink-0">
                          ₹{Number(item.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4 text-sm">
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <Clock3 className="w-4 h-4" />
                          {item.deliveryDays} days
                        </span>

                        <span className="text-slate-400">
                          {item.revisions} revision{item.revisions === 1 ? '' : 's'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedPackage && (
              <div className="mt-5 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Selected</span>
                  <span className="text-sm font-black text-white">
                    {selectedPackage.tierName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 mt-2">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="text-2xl font-black text-emerald-300">
                    ₹{Number(selectedPackage.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {purchaseError && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm font-bold text-red-300">
                    {purchaseError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={!currentUser || !selectedPackage}
                  onClick={purchaseGig}
                  className="w-full mt-5 px-4 py-3 neon-airflow-btn text-white rounded-xl text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentUser ? 'Continue to Purchase' : 'Sign in to Purchase'}
                </button>

                {!currentUser && (
                  <Link
                    to="/login"
                    className="block text-center text-xs font-black text-indigo-400 hover:text-indigo-300 mt-3"
                  >
                    Sign in to continue
                  </Link>
                )}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
