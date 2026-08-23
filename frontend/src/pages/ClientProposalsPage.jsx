import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function ClientProposalsPage() {
  const { projectId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const hireStudent = async (bidId) => {
    try {
      const res = await API.post(
        `/jobs/${projectId}/accept-bid/${bidId}`
      );

      alert(res.data?.message || 'Student hired successfully');

      const refreshed = await API.get(`/jobs/${projectId}`);
      setJob(refreshed.data);
    } catch (err) {
      alert(
        err?.response?.data?.error ||
        'Failed to hire student'
      );
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

            <div className="mt-5 flex gap-3">

              <button
                onClick={() => hireStudent(bid.id)}
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
