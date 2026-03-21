import { useState } from 'react';
import { X, AlertTriangle, FileText } from 'lucide-react';
import { fileDispute } from '../services/agreementService';

const DisputeModal = ({ campaign, onClose, onDisputed }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const disputeReasons = [
    { value: 'payment_issue', label: 'Payment Issue' },
    { value: 'content_quality', label: 'Content Quality Issue' },
    { value: 'deadline_missed', label: 'Deadline Missed' },
    { value: 'guideline_violation', label: 'Guideline Violation' },
    { value: 'communication_breakdown', label: 'Communication Breakdown' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason) {
      setError('Please select a dispute reason');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a detailed description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await fileDispute(campaign.id, {
        reason,
        description: description.trim()
      });
      onDisputed();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to file dispute');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-2xl font-bold">File a Dispute</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {campaign.name}
            </h3>
            <p className="text-gray-600 text-sm">
              Please provide detailed information about the issue. Our admin team will review
              and mediate the dispute.
            </p>
          </div>

          {/* Dispute Reason */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dispute Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a reason...</option>
              {disputeReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError('');
              }}
              placeholder="Please provide a detailed explanation of the issue, including any relevant dates, communications, or evidence..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimum 50 characters. Be specific and factual.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important Notice</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Filing a dispute will pause the campaign until resolved</li>
                  <li>Both parties will be notified and can provide their perspective</li>
                  <li>Admin team will review all evidence and make a fair decision</li>
                  <li>False or frivolous disputes may affect your account standing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reason || description.length < 50}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Filing Dispute...' : 'File Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisputeModal;
