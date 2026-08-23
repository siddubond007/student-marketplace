import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function StudentMarketplacePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [proposedAmount, setProposedAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');

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

  const submitProposal = async () => {
    try {
      const res = await API.post(`/jobs/${selectedJob.id}/bid`, {
        proposedAmount,
        deliveryDays,
        coverLetter
      });

      setMessage(
        res.data?.message || 'Proposal submitted successfully'
      );

      setSelectedJob(null);
      setProposedAmount('');
      setDeliveryDays('');
      setCoverLetter('');
    } catch (err) {
      setMessage(
        err?.response?.data?.error ||
        'Failed to submit proposal'
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading marketplace jobs...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-3">
            Student Marketplace
          </h1>
          <p className="text-slate-400 text-lg">
            Discover freelance opportunities, build your portfolio, and earn while you learn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-emerald-400">{jobs.length}</div>
              <div className="text-slate-400">Active Jobs</div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">₹</div>
              <div className="text-slate-400">Paid Projects</div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-slate-400">Marketplace Access</div>
            </div>
          </div>
        </div>
        {message && (
          <div className="mb-6 p-3 rounded bg-slate-800 text-white">
            {message}
          </div>
        )}

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

              <button
                onClick={() => setSelectedJob(job)}
                className="mt-4 px-4 py-2 rounded bg-emerald-600 text-white"
              >
                Submit Proposal
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Submit Proposal
                </h2>

                <p className="text-slate-400">
                  {selectedJob.title}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="text-white text-2xl"
              >
                ×
              </button>
            </div>

            <input
              type="number"
              placeholder="Proposed Amount"
              value={proposedAmount}
              onChange={(e) => setProposedAmount(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
            />

            <input
              type="number"
              placeholder="Delivery Days"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
            />

            <textarea
              placeholder="Cover Letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="6"
              className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded bg-slate-700 text-white"
              >
                Cancel
              </button>

              <button
                onClick={submitProposal}
                className="px-4 py-2 rounded bg-emerald-600 text-white"
              >
                Send Proposal
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
