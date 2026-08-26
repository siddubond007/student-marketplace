import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function PublicJobDetailsPage() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/jobs/public/${jobId}`)
      .then((res) => {
        setJob(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [jobId]);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading project...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">
          Project not found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800">
        <div className="flex justify-between items-start gap-6 flex-wrap">

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">
                {job.category || 'General'}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs">
                {job.experienceLevel || 'INTERMEDIATE'}
              </span>
              {job.timeline && (
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs">
                  {job.timeline}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white">
              {job.title}
            </h1>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Budget</div>
                <div className="mt-1 text-xl font-black text-emerald-400">₹{job.budget}</div>
              </div>

              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Client</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {job.client?.fullName || 'Client'}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Proposals</div>
                <div className="mt-1 text-xl font-black text-amber-400">
                  {job.bids?.length || 0}
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/jobs"
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold transition-colors"
          >
            Back to Marketplace
          </Link>

        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
        <p className="text-slate-300 leading-7 whitespace-pre-wrap">
          {job.description || 'No description provided'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">Deliverables</h2>

          {Array.isArray(job.deliverables) && job.deliverables.length > 0 ? (
            <div className="space-y-3">
              {job.deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400">No deliverables specified</div>
          )}
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>

          <div className="text-slate-300 leading-7 whitespace-pre-wrap">
            {job.requirements || 'No requirements provided'}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Skills</h2>

        {Array.isArray(job.skills) && job.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-slate-400">No skills specified</div>
        )}
      </div>

    </div>
  );
}
