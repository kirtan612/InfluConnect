import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Wallet, Lock, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const AdminEscrowDashboard = () => {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [refundBrandFee, setRefundBrandFee] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchEscrowOverview = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/api/admin/escrow-overview', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOverview(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch escrow overview:', err)
      setError(err.response?.data?.detail || 'Failed to load escrow data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEscrowOverview()
  }, [])

  const handleReleaseFunds = async () => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem('token')
      await axios.post(
        `http://localhost:8000/api/campaign/${selectedCampaign.campaign_id}/admin-release`,
        { admin_notes: adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowReleaseModal(false)
      setSelectedCampaign(null)
      setAdminNotes('')
      fetchEscrowOverview()
      alert('Funds released successfully!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to release funds')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRefund = async () => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem('token')
      await axios.post(
        `http://localhost:8000/api/campaign/${selectedCampaign.campaign_id}/admin-refund`,
        { 
          admin_notes: adminNotes,
          refund_brand_fee: refundBrandFee
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowRefundModal(false)
      setSelectedCampaign(null)
      setAdminNotes('')
      setRefundBrandFee(false)
      fetchEscrowOverview()
      alert('Funds refunded successfully!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to refund')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading escrow data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchEscrowOverview} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    )
  }

  const { total_locked_funds, total_campaigns_with_escrow, campaigns_by_escrow_status, platform_revenue, recent_transactions } = overview || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Escrow Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage platform escrow system</p>
        </div>
        <button onClick={fetchEscrowOverview} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Locked Funds */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Lock size={32} className="text-cyan-100" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Locked</span>
          </div>
          <p className="text-sm text-cyan-100 mb-1">Total Locked Funds</p>
          <h2 className="text-3xl font-bold">₹{total_locked_funds?.toLocaleString() || '0'}</h2>
        </div>

        {/* Total Campaigns */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet size={32} className="text-violet-100" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-sm text-violet-100 mb-1">Campaigns with Escrow</p>
          <h2 className="text-3xl font-bold">{total_campaigns_with_escrow || 0}</h2>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={32} className="text-emerald-100" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Earned</span>
          </div>
          <p className="text-sm text-emerald-100 mb-1">Total Platform Revenue</p>
          <h2 className="text-3xl font-bold">₹{platform_revenue?.total_revenue?.toLocaleString() || '0'}</h2>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} className="text-amber-100" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">5% Fee</span>
          </div>
          <p className="text-sm text-amber-100 mb-1">Fee Breakdown</p>
          <div className="space-y-1">
            <p className="text-sm">Brand: ₹{platform_revenue?.brand_fees_total?.toLocaleString() || '0'}</p>
            <p className="text-sm">Influencer: ₹{platform_revenue?.influencer_fees_total?.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>

      {/* Escrow Status Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Escrow Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(campaigns_by_escrow_status || {}).map(([status, count]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                {status === 'locked' && <Lock size={16} className="text-amber-500" />}
                {status === 'released' && <CheckCircle size={16} className="text-green-500" />}
                {status === 'refunded' && <XCircle size={16} className="text-red-500" />}
                {status === 'pending' && <AlertCircle size={16} className="text-gray-500" />}
                <span className="text-xs font-medium text-gray-600 uppercase">{status}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Campaign */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Campaign</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Campaign</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Brand Fee</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Influencer Fee</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Collected</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {platform_revenue?.revenue_by_campaign?.map((campaign) => (
                <tr key={campaign.campaign_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.campaign_name}</p>
                      <p className="text-xs text-gray-500">ID: {campaign.campaign_id}</p>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-sm text-gray-900">
                    ₹{campaign.brand_fee?.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-sm text-gray-900">
                    ₹{campaign.influencer_fee?.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-sm font-semibold text-emerald-600">
                    ₹{campaign.total_collected?.toLocaleString()}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.escrow_status === 'locked' ? 'bg-amber-100 text-amber-700' :
                      campaign.escrow_status === 'released' ? 'bg-green-100 text-green-700' :
                      campaign.escrow_status === 'refunded' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.escrow_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Escrow Transactions</h3>
        <div className="space-y-3">
          {recent_transactions?.map((transaction) => (
            <div key={transaction.campaign_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.escrow_status === 'locked' ? 'bg-amber-100' :
                    transaction.escrow_status === 'released' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}>
                    {transaction.escrow_status === 'locked' && <Lock size={18} className="text-amber-600" />}
                    {transaction.escrow_status === 'released' && <CheckCircle size={18} className="text-green-600" />}
                    {transaction.escrow_status === 'refunded' && <XCircle size={18} className="text-red-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.campaign_name}</p>
                    <p className="text-sm text-gray-600">{transaction.brand_name}</p>
                  </div>
                </div>
              </div>
              <div className="text-right mr-4">
                <p className="font-semibold text-gray-900">₹{transaction.budget_amount?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total: ₹{transaction.total_payment?.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  transaction.escrow_status === 'locked' ? 'bg-amber-100 text-amber-700' :
                  transaction.escrow_status === 'released' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {transaction.escrow_status}
                </span>
                {transaction.escrow_status === 'locked' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedCampaign(transaction)
                        setShowReleaseModal(true)
                      }}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Release
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCampaign(transaction)
                        setShowRefundModal(true)
                      }}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Refund
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Release Modal */}
      {showReleaseModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Release Funds to Influencer</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Campaign: <span className="font-semibold text-gray-900">{selectedCampaign.campaign_name}</span></p>
                <p className="text-sm text-gray-600 mb-2">Budget: <span className="font-semibold text-gray-900">₹{selectedCampaign.budget_amount?.toLocaleString()}</span></p>
                <p className="text-sm text-gray-600 mb-2">Influencer Fee (2.5%): <span className="font-semibold text-amber-600">₹{(selectedCampaign.budget_amount * 0.025).toLocaleString()}</span></p>
                <p className="text-sm text-gray-600">Influencer Receives: <span className="font-semibold text-green-600">₹{(selectedCampaign.budget_amount * 0.975).toLocaleString()}</span></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Reason for releasing funds..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowReleaseModal(false)
                    setSelectedCampaign(null)
                    setAdminNotes('')
                  }}
                  className="btn-secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReleaseFunds}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Releasing...' : 'Release Funds'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund to Brand</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Campaign: <span className="font-semibold text-gray-900">{selectedCampaign.campaign_name}</span></p>
                <p className="text-sm text-gray-600 mb-2">Budget: <span className="font-semibold text-gray-900">₹{selectedCampaign.budget_amount?.toLocaleString()}</span></p>
                <p className="text-sm text-gray-600 mb-2">Brand Fee (2.5%): <span className="font-semibold text-amber-600">₹{(selectedCampaign.budget_amount * 0.025).toLocaleString()}</span></p>
                <p className="text-sm text-gray-600">Refund Amount: <span className="font-semibold text-red-600">₹{(refundBrandFee ? selectedCampaign.total_payment : selectedCampaign.budget_amount)?.toLocaleString()}</span></p>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={refundBrandFee}
                    onChange={(e) => setRefundBrandFee(e.target.checked)}
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Also refund brand fee (₹{(selectedCampaign.budget_amount * 0.025).toLocaleString()})</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Reason for refund..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRefundModal(false)
                    setSelectedCampaign(null)
                    setAdminNotes('')
                    setRefundBrandFee(false)
                  }}
                  className="btn-secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefund}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Refunding...' : 'Refund'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminEscrowDashboard
