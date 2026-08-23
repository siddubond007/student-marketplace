import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function ClientProjectDetailsPage() {
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
              Status: {job.status}
            </div>

            <div className="mt-2 text-slate-300">
              Deadline: {(job.timeline || 'Not specified').toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </div>

            <div className="mt-2 text-slate-500 text-sm">
              Created: {new Date(job.createdAt).toLocaleDateString()}
            </div>

            <div className="mt-1 text-slate-500 text-sm">
              Updated: {new Date(job.updatedAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">

            {job.status === 'DRAFT' ? (
              <Link
                to={`/post-job?draftId=${job.id}`}
                className="px-4 py-2 bg-amber-600 rounded-xl text-white text-sm font-bold"
              >
                Continue Editing
              </Link>
            ) : (
              <>
                <button
                  className="px-4 py-2 bg-indigo-600 rounded-xl text-white text-sm font-bold"
                >
                  View Proposals
                </button>

                <Link
                  to={`/post-job?draftId=${job.id}`}
                  className="px-4 py-2 bg-slate-700 rounded-xl text-white text-sm font-bold"
                >
                  Edit Job
                </Link>
              </>
            )}

          </div>

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

        <div className="text-slate-300">
          {Array.isArray(job.deliverables) && job.deliverables.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {job.deliverables.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            'No deliverables specified'
          )}
        </div>
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
          Skills & Experience
        </h2>

        <div className="mb-4 text-slate-300">
          Experience Level: {job.experienceLevel || 'Not specified'}
        </div>

        <div className="flex flex-wrap gap-2">
          {(job.skills || []).map(skill => (
            <span
              key={skill}
              className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">
          Budget & Timeline
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-slate-300">
          <div>
            <strong>Budget Type:</strong> {job.budgetType || 'Not specified'}
          </div>

          <div>
            <strong>Budget:</strong> ₹{job.budget || 0}
          </div>

          <div>
            <strong>Currency:</strong> INR
          </div>

          <div>
            <strong>Start Preference:</strong> {job.startPreference || 'Not specified'}
          </div>

          <div>
            <strong>Start Date:</strong> {job.startDate || 'Not specified'}
          </div>

          <div>
            <strong>Deadline:</strong> {(job.timeline || 'Not specified').toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">
          Attachments & Links
        </h2>

        {(job.externalLinks || []).length > 0 ? (
          <div className="space-y-2">
            {job.externalLinks.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="block text-indigo-400 hover:text-indigo-300 break-all"
              >
                {link}
              </a>
            ))}
          </div>
        ) : (
          <div className="text-slate-400">
            No external links provided
          </div>
        )}
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">
          Proposals
        </h2>

        <div className="text-slate-300">
          Current proposals: {job.bids?.length || 0}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">
          Activity
        </h2>

        <ul className="text-slate-300 space-y-2">
          <li>✓ Job created on {new Date(job.createdAt).toLocaleDateString()}</li>

          <li>✓ Last updated on {new Date(job.updatedAt).toLocaleDateString()}</li>

          {job.status !== 'DRAFT' && (
            <li>✓ Job published</li>
          )}
        </ul>
      </div>

    </div>
  );
}
