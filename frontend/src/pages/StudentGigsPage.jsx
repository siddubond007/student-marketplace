import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, PlusCircle, PackageCheck } from 'lucide-react';
import API from '../services/api';

export default function StudentGigsPage({ currentUser }) {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/gigs')
      .then((res) => {
        setGigs(res.data || []);
      })
      .catch(() => {
        setGigs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const myGigs = useMemo(
    () =>
      gigs.filter(
        (gig) =>
          gig.seller?.id === currentUser?.id ||
          gig.sellerId === currentUser?.id
      ),
    [gigs, currentUser?.id]
  );

  return (
    <div className="space-y-6 pb-16">
      <section className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <Link
                to="/student/portal"
                className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Workspace
              </Link>

              <div className="flex items-center gap-3 mt-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-cyan-400" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                    Student Workspace
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    My Gigs
                  </h1>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3">
                Manage the services you have published for clients.
              </p>
            </div>

            <Link
              to="/student/gigs/create"
              className="px-4 py-2.5 neon-airflow-btn text-white rounded-xl text-xs font-black flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Publish New Gig
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="glass-panel rounded-3xl border border-slate-800 p-10 text-center">
          <p className="text-xs text-slate-500">Loading your gigs...</p>
        </section>
      ) : myGigs.length === 0 ? (
        <section className="glass-panel rounded-3xl border border-slate-800 p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-cyan-400" />
          </div>

          <h2 className="text-lg font-black text-white mt-4">
            You have not published a gig yet
          </h2>

          <p className="max-w-md mx-auto text-xs leading-6 text-slate-500 mt-2">
            Create your first service and start showing clients what you can do.
          </p>

          <Link
            to="/student/gigs/create"
            className="inline-flex mt-6 px-4 py-2.5 neon-airflow-btn text-white rounded-xl text-xs font-black items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Publish Your First Gig
          </Link>
        </section>
      ) : (
        <section className="glass-panel rounded-3xl border border-slate-800 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                Published Services
              </p>
              <h2 className="text-lg font-black text-white mt-1">
                {myGigs.length} gig{myGigs.length === 1 ? '' : 's'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {myGigs.map((gig) => {
              const firstPackage = gig.packages?.[0];

              const packageCount = gig.packages?.length || 0;
              const orderCount = gig.orders?.length || 0;

              return (
                <article
                  key={gig.id}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-cyan-500/30 transition"
                >
                  <div className="h-40 bg-slate-900 overflow-hidden">
                    <img
                      src={gig.coverImage}
                      alt={gig.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                        {gig.category || 'Service'}
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-300">
                        Published
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white mt-2 line-clamp-2">
                      {gig.title}
                    </h3>

                    <p className="text-sm leading-6 text-slate-400 mt-2 line-clamp-3">
                      {gig.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                          Starting price
                        </p>
                        <p className="text-xl font-black text-emerald-400 mt-1">
                          ₹{Number(firstPackage?.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                          Delivery
                        </p>
                        <p className="text-base font-black text-white mt-1">
                          {firstPackage?.deliveryDays ?? '-'} days
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="rounded-xl bg-slate-900/80 px-3 py-2.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                          Packages
                        </p>
                        <p className="text-sm font-black text-white mt-1">
                          {packageCount || 1}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-900/80 px-3 py-2.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                          Orders
                        </p>
                        <p className="text-sm font-black text-white mt-1">
                          {orderCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <PackageCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs text-slate-500 truncate">
                          Published {new Date(gig.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-cyan-300">
                        {gig.subcategory || gig.category || 'Service'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
