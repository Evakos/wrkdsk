"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  skills: string;
  experience: string;
  duration: string;
  status: string;
  clientId: string;
  createdAt: string;
  client: {
    id: string;
    name: string | null;
    image: string | null;
  };
  proposals: Array<{
    id: string;
    coverLetter: string;
    bidAmount: number;
    estimatedDays: number | null;
    status: string;
    createdAt: string;
    freelancer: {
      id: string;
      name: string | null;
      image: string | null;
      title: string | null;
      hourlyRate: number | null;
    };
  }>;
}

export default function JobDetailClient({
  job,
  userId,
  userRole,
}: {
  job: Job;
  userId: string | null;
  userRole: string | null;
}) {
  const router = useRouter();
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isOwner = userId === job.clientId;
  const isFreelancer = userRole === "freelancer";
  const isOpen = job.status === "open";

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      router.push("/login");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          coverLetter,
          bidAmount: parseFloat(bidAmount),
          estimatedDays: estimatedDays ? parseInt(estimatedDays) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }

      setSuccess("Proposal submitted successfully!");
      setShowProposalForm(false);
      setCoverLetter("");
      setBidAmount("");
      setEstimatedDays("");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setSubmitting(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
      console.error("Failed to accept proposal");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/jobs"
        className="text-sm text-indigo-600 hover:text-indigo-700 mb-6 inline-block"
      >
        &larr; Back to Jobs
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-200 p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{job.title}</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Posted by {job.client.name || "Client"} &middot;{" "}
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
              job.status === "open"
                ? "bg-green-100 text-green-700"
                : job.status === "in_progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {job.status.replace("_", " ")}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
            {job.category}
          </span>
          <span className="px-3 py-1.5 bg-zinc-50 text-zinc-700 rounded-lg text-sm font-medium">
            {job.budget}
          </span>
          <span className="px-3 py-1.5 bg-zinc-50 text-zinc-700 rounded-lg text-sm font-medium">
            {job.experience}
          </span>
          {job.duration && (
            <span className="px-3 py-1.5 bg-zinc-50 text-zinc-700 rounded-lg text-sm font-medium">
              {job.duration}
            </span>
          )}
        </div>

        {job.skills && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.split(",").map((skill: string) => (
              <span
                key={skill.trim()}
                className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-xs"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">
            Project Description
          </h2>
          <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Actions */}
        {isOpen && !isOwner && (
          <div className="mt-8 pt-8 border-t border-zinc-200">
            {isFreelancer ? (
              !showProposalForm ? (
                <button
                  onClick={() => {
                    if (!userId) {
                      router.push("/login");
                      return;
                    }
                    setShowProposalForm(true);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Proposal
                </button>
              ) : null
            ) : (
              <p className="text-sm text-zinc-500">
                <Link href="/login" className="text-indigo-600 font-medium">
                  Sign in
                </Link>{" "}
                as a freelancer to submit a proposal.
              </p>
            )}
          </div>
        )}

        {/* Proposal Form */}
        {showProposalForm && (
          <form onSubmit={handleSubmitProposal} className="mt-8 pt-8 border-t border-zinc-200 space-y-5">
            <h3 className="text-lg font-semibold text-zinc-900">
              Submit Your Proposal
            </h3>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Tell the client why you're the best fit for this project..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Bid Amount ($)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  min={1}
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Estimated Days
                </label>
                <input
                  type="number"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  min={1}
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="14"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Proposal"}
              </button>
              <button
                type="button"
                onClick={() => setShowProposalForm(false)}
                className="px-6 py-2.5 bg-white text-zinc-700 font-medium rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Proposals (for job owner) */}
        {isOwner && job.proposals.length > 0 && (
          <div className="mt-8 pt-8 border-t border-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Proposals ({job.proposals.length})
            </h2>
            <div className="space-y-4">
              {job.proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-5 bg-zinc-50 rounded-xl border border-zinc-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-zinc-900">
                        {proposal.freelancer.name || "Anonymous"}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {proposal.freelancer.title || "Freelancer"}
                        {proposal.freelancer.hourlyRate &&
                          ` · $${proposal.freelancer.hourlyRate}/hr`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-zinc-900">
                        ${proposal.bidAmount}
                      </p>
                      {proposal.estimatedDays && (
                        <p className="text-sm text-zinc-500">
                          {proposal.estimatedDays} days
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600">
                    {proposal.coverLetter}
                  </p>
                  {job.status === "open" && proposal.status === "pending" && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleAcceptProposal(proposal.id)}
                        className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept Proposal
                      </button>
                    </div>
                  )}
                  {proposal.status !== "pending" && (
                    <span
                      className={`mt-3 inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        proposal.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
