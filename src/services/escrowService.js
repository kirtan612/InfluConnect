/**
 * Escrow service for transaction management
 */
import { apiFetch } from '../utils/api';

const escrowService = {
  // Wallet operations
  getWallet: async () => {
    const response = await apiFetch('/escrow/wallet');
    return response.json();
  },

  addFunds: async (amount) => {
    const response = await apiFetch('/escrow/wallet/add-funds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });
    return response.json();
  },

  // Transaction operations
  createTransaction: async (sellerId, amount) => {
    const response = await apiFetch('/escrow/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        seller_id: sellerId,
        amount
      })
    });
    return response.json();
  },

  getTransactions: async () => {
    const response = await apiFetch('/escrow/transactions');
    return response.json();
  },

  getTransaction: async (transactionId) => {
    const response = await apiFetch(`/escrow/transactions/${transactionId}`);
    return response.json();
  },

  // Agreement operations
  acceptAgreement: async (transactionId) => {
    const response = await apiFetch(`/escrow/transactions/${transactionId}/accept-agreement`, {
      method: 'POST'
    });
    return response.json();
  },

  // Dispute operations
  raiseDispute: async (transactionId, reason) => {
    const response = await apiFetch(`/escrow/transactions/${transactionId}/raise-dispute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });
    return response.json();
  },

  // Admin operations
  adminResolve: async (transactionId, action, adminNotes) => {
    const response = await apiFetch(`/escrow/transactions/${transactionId}/admin-resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        admin_notes: adminNotes
      })
    });
    return response.json();
  },

  getAdminStats: async () => {
    const response = await apiFetch('/escrow/admin/stats');
    return response.json();
  }
};

export default escrowService;
