import { useState } from 'react';
import { X, FileText, AlertCircle } from 'lucide-react';

const AgreementModal = ({ campaign, userRole, onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    if (!accepted) {
      setError('Please read and accept the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Just call the onAccept callback - let the parent component handle the logic
      // The parent knows whether to accept campaign terms or just accept the request
      await onAccept();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to accept terms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Campaign Agreement</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {campaign.name}
            </h3>
            <p className="text-gray-600">{campaign.description}</p>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h4 className="font-bold text-lg mb-4 text-gray-900">
              Terms and Conditions
            </h4>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h5 className="font-semibold mb-2">1. Campaign Commitment</h5>
                <p className="text-sm">
                  By accepting this agreement, you commit to delivering the agreed-upon content
                  within the specified timeline. Any delays must be communicated in advance.
                </p>
              </div>

              <div>
                <h5 className="font-semibold mb-2">2. Content Guidelines</h5>
                <p className="text-sm">
                  All content must align with the brand's guidelines and values. Content must be
                  original and not violate any copyright or intellectual property rights.
                </p>
              </div>

              <div>
                <h5 className="font-semibold mb-2">3. Payment Terms</h5>
                <p className="text-sm">
                  Payment will be processed according to the agreed schedule. Influencers will
                  receive payment after content approval. Brands must release payment within 7
                  business days of approval.
                </p>
              </div>

              <div>
                <h5 className="font-semibold mb-2">4. Dispute Resolution</h5>
                <p className="text-sm">
                  In case of disagreements, both parties agree to first attempt resolution through
                  direct communication. If unresolved, disputes will be escalated to platform
                  administrators for mediation.
                </p>
              </div>

              <div>
                <h5 className="font-semibold mb-2">5. Cancellation Policy</h5>
                <p className="text-sm">
                  Either party may cancel the campaign with 48 hours notice. Cancellations after
                  work has begun may result in partial payment obligations.
                </p>
              </div>

              <div>
                <h5 className="font-semibold mb-2">6. Platform Fees</h5>
                <p className="text-sm">
                  InfluConnect charges a service fee on all transactions. This fee covers platform
                  maintenance, payment processing, and dispute resolution services.
                </p>
              </div>
            </div>
          </div>

          {/* Acceptance Checkbox */}
          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              id="accept-terms"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                setError('');
              }}
              className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer">
              I have read and agree to the terms and conditions outlined above. I understand
              that this is a binding agreement and commit to fulfilling my obligations.
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={!accepted || loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Accept & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
