import { useState } from 'react';
import { X, Flag, AlertCircle } from 'lucide-react';
import { createReport } from '../services/reportService';

const ReportModal = ({ entityType, entityId, entityName, onClose, onReported }) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reportCategories = [
    { value: 'spam', label: 'Spam or Misleading' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'harassment', label: 'Harassment or Bullying' },
    { value: 'fraud', label: 'Fraud or Scam' },
    { value: 'copyright', label: 'Copyright Violation' },
    { value: 'fake_account', label: 'Fake Account' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category) {
      setError('Please select a report category');
      return;
    }

    if (!description.trim() || description.length < 20) {
      setError('Please provide a detailed description (minimum 20 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createReport({
        reported_entity_type: entityType,
        reported_entity_id: entityId,
        reason: `${category}: ${description.trim().substring(0, 100)}`,
        description: description.trim()
      });
      
      if (onReported) onReported();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flag className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Report {entityType}</h2>
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
            <p className="text-gray-700">
              You are reporting: <span className="font-semibold">{entityName}</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Please provide accurate information. False reports may result in account penalties.
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Category *
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a category...</option>
              {reportCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
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
              placeholder="Please provide specific details about why you're reporting this. Include any relevant information that will help our moderation team..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              {description.length}/500 characters (minimum 20)
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Our moderation team will review your report within 24-48 hours</li>
                  <li>You'll receive updates on the status of your report</li>
                  <li>Appropriate action will be taken if the report is validated</li>
                  <li>Your report is confidential and anonymous to the reported party</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
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
              disabled={loading || !category || description.length < 20}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
