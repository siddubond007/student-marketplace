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

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex justify-between items-start gap-4 flex-wrap">

          <div>
            <h1 className="text-3xl font-black text-white">
              {job.title}
            </h1>

            <div className="mt-2 text-slate-400">
              {job.category}
            </div>

            <div className="mt-2 text-slate-300">
              Budget: ₹{job.budget}
            </div>

            <div className="mt-2 text-slate-300">
              Client: {job.client?.fullName || 'Client'}
            </div>

            <div className="mt-2 text-slate-300">
              Proposals: {job.bids?.length || 0}
            </div>
          </div>

          <Link
            to="/jobs"
            className="px-4 py-2 bg-indigo-600 rounded-xl text-white text-sm font-bold"
          >
            Back to Marketplace
          </Link>

        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">
          Overview
        </h2>

        <p className="text-slate-300 whitespace-pre-wrap">
          {job.description || 'No description provided'}
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">
          Deliverables
        </h2>

        {Array.isArray(job.deliverables) && job.deliverables.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {job.deliverables.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <div className="text-slate-400">
            No deliverables specified
          </div>
        )}
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">
          Requirements
        </h2>

        <div className="text-slate-300 whitespace-pre-wrap">
          {job.requirements || 'No requirements provided'}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {(job.skills || []).map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
