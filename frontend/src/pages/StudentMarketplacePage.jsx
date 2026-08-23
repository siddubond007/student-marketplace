import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function StudentMarketplacePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/jobs')
      .then((res) => {
        setJobs(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load jobs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading marketplace jobs...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Student Job Marketplace
      </h1>

      {jobs.length === 0 ? (
        <div className="text-slate-400">
          No open jobs found.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-slate-700 rounded-xl p-5 bg-slate-900/40"
            >
              <h2 className="text-xl font-semibold text-white">
                {job.title}
              </h2>

              <p className="text-slate-300 mt-2">
                {job.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="text-emerald-400">
                  Budget: ₹{job.budget}
                </span>

                <span className="text-slate-400">
                  Category: {job.category}
                </span>

                <span className="text-slate-400">
                  Client: {job.client?.fullName}
                </span>

                <span className="text-slate-400">
                  Proposals: {job.bids?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
