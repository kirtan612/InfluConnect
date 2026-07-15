import { useState, useEffect } from 'react';
import { Wallet, Plus, Send, FileText, AlertTriangle, CheckCircle, XCircle, Clock, DollarSign, Lock } from 'lucide-react';
import escrowService from '../services/escrowService';
import { useAuth } from '../context/AuthContext';

const EscrowDashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showCreateTransaction, setShowCreateTransaction] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [walletData, transactionsData] = await Promise.all([
        escrowService.getWallet(),
        escrowService.getTransactions()
      ]);
      setWallet(walletData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAgreement = async (transactionId) => {
    try {
      await escrowService.acceptAgreement(transactionId);
      alert('Agreement accepted successfully!');
      loadData();
    } catch (error) {
      alert('Failed to accept agreement: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      held: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Held' },
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      dispute: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, label: 'Dispute' },
      admin_review: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle, label: 'Admin Review' },
      released: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Released' },
      refunded: { color: 'bg-purple-100 text-purple-800', icon: XCircle, label: 'Refunded' }
    };
    
    const badge = badges[status] || badges.held;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Escrow System</h2>
        <p className="text-gray-600 mt-1">Manage your wallet and transactions</p>
      </div>

      {/* Wallet Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <h3 className="text-xl font-bold">My Wallet</h3>
          </div>
          <button
            onClick={() => setShowAddFunds(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5" />
              <p className="text-sm opacity-90">Available</p>
            </div>
            <p className="text-3xl font-bold">₹{wallet?.wallet_balance?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5" />
              <p className="text-sm opacity-90">Locked</p>
            </div>
            <p className="text-3xl font-bold">₹{wallet?.locked_balance?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <p className="text-sm opacity-90">Total</p>
            </div>
            <p className="text-3xl font-bold">₹{wallet?.total_balance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateTransaction(true)}
          className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <Send className="w-5 h-5" />
          Create Transaction
        </button>
      </div>

      {/* Transactions List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">My Transactions</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const isBuyer = transaction.buyer_id === user.id;
              const isSeller = transaction.seller_id === user.id;
              const needsAgreement = transaction.agreement_status === 'pending' && 
                ((isBuyer && !transaction.buyer_accepted) || (isSeller && !transaction.seller_accepted));
              const canDispute = transaction.status === 'active' && (isBuyer || isSeller);

              return (
                <div key={transaction.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">
                          Transaction #{transaction.id}
                        </h4>
                        {getStatusBadge(transaction.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isBuyer ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isBuyer ? 'Buyer' : 'Seller'}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">₹{transaction.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Buyer ID</p>
                      <p className="font-semibold">{transaction.buyer_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Seller ID</p>
                      <p className="font-semibold">{transaction.seller_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Agreement</p>
                      <p className="font-semibold capitalize">{transaction.agreement_status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Disputes</p>
                      <p className="font-semibold">{transaction.dispute_count}/3</p>
                    </div>
                  </div>

                  {transaction.dispute_reason && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-semibold text-yellow-800 mb-1">Dispute Reason:</p>
                      <p className="text-sm text-yellow-700">{transaction.dispute_reason}</p>
                    </div>
                  )}

                  {transaction.admin_notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-semibold text-blue-800 mb-1">Admin Notes:</p>
                      <p className="text-sm text-blue-700">{transaction.admin_notes}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {needsAgreement && (
                      <button
                        onClick={() => handleAcceptAgreement(transaction.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept Agreement
                      </button>
                    )}

                    {canDispute && (
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDisputeModal(true);
                        }}
                        className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Raise Dispute
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Created: {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddFunds && (
        <AddFundsModal
          onClose={() => setShowAddFunds(false)}
          onSuccess={loadData}
        />
      )}

      {showCreateTransaction && (
        <CreateTransactionModal
          onClose={() => setShowCreateTransaction(false)}
          onSuccess={loadData}
        />
      )}

      {showDisputeModal && selectedTransaction && (
        <DisputeModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowDisputeModal(false);
            setSelectedTransaction(null);
          }}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

// Add Funds Modal
const AddFundsModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await escrowService.addFunds(parseFloat(amount));
      alert('Funds added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      alert('Failed to add funds: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Add Demo Funds</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (max ₹10,000)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="10000"
              step="0.01"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter amount"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Funds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Transaction Modal
const CreateTransactionModal = ({ onClose, onSuccess }) => {
  const [sellerId, setSellerId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await escrowService.createTransaction(parseInt(sellerId), parseFloat(amount));
      alert('Transaction created successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      alert('Failed to create transaction: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Transaction</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seller User ID
            </label>
            <input
              type="number"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter seller ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter amount"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dispute Modal
const DisputeModal = ({ transaction, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await escrowService.raiseDispute(transaction.id, reason);
      alert('Dispute raised successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      alert('Failed to raise dispute: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Raise Dispute</h3>
        <p className="text-sm text-gray-600 mb-4">
          Transaction #{transaction.id} - ₹{transaction.amount.toFixed(2)}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason (min 10 characters)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              minLength={10}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Explain the issue..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Raise Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EscrowDashboard;
