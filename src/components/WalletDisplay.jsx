import React, { useState, useEffect } from 'react'
import { Wallet, Plus, Lock, DollarSign } from 'lucide-react'
import axios from 'axios'

const WalletDisplay = ({ compact = false, onBalanceUpdate }) => {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(null)

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/api/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWallet(response.data)
      if (onBalanceUpdate) {
        onBalanceUpdate(response.data)
      }
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch wallet:', err)
      setError(err.response?.data?.detail || 'Failed to load wallet')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWallet()
  }, [])

  const handleAddFunds = async () => {
    try {
      const amountNum = parseFloat(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        setError('Please enter a valid amount')
        return
      }
      if (amountNum > 50000) {
        setError('Maximum ₹50,000 per transaction')
        return
      }

      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:8000/api/wallet/add-funds',
        { amount: amountNum },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAmount('')
      setShowAddFunds(false)
      setError(null)
      fetchWallet()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add funds')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-3 border border-teal-100">
        <Wallet className="text-teal-600" size={20} />
        <div className="flex-1">
          <p className="text-xs text-gray-600">Available Balance</p>
          <p className="text-lg font-bold text-gray-900">₹{wallet?.wallet_balance?.toLocaleString() || '0'}</p>
        </div>
        {wallet?.locked_balance > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <Lock size={12} />
            <span>₹{wallet.locked_balance.toLocaleString()} locked</span>
          </div>
        )}
        <button
          onClick={() => setShowAddFunds(true)}
          className="btn-primary text-sm py-1 px-3"
        >
          <Plus size={14} />
        </button>

        {showAddFunds && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Demo Funds</h3>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (Max ₹50,000)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAmount('5000')}
                    className="btn-secondary flex-1 text-sm"
                  >
                    ₹5,000
                  </button>
                  <button
                    onClick={() => setAmount('10000')}
                    className="btn-secondary flex-1 text-sm"
                  >
                    ₹10,000
                  </button>
                  <button
                    onClick={() => setAmount('25000')}
                    className="btn-secondary flex-1 text-sm"
                  >
                    ₹25,000
                  </button>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowAddFunds(false)
                      setAmount('')
                      setError(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button onClick={handleAddFunds} className="btn-primary">
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-teal-100 text-sm mb-1">Wallet Balance</p>
          <h2 className="text-4xl font-bold">₹{wallet?.wallet_balance?.toLocaleString() || '0'}</h2>
        </div>
        <Wallet size={32} className="text-teal-100" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-teal-100" />
            <p className="text-xs text-teal-100">Total Balance</p>
          </div>
          <p className="text-xl font-semibold">
            ₹{((wallet?.wallet_balance || 0) + (wallet?.locked_balance || 0)).toLocaleString()}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={16} className="text-amber-300" />
            <p className="text-xs text-teal-100">Locked (Escrow)</p>
          </div>
          <p className="text-xl font-semibold">₹{wallet?.locked_balance?.toLocaleString() || '0'}</p>
        </div>
      </div>

      <button
        onClick={() => setShowAddFunds(true)}
        className="w-full bg-white text-teal-600 font-semibold py-3 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Demo Funds
      </button>

      {showAddFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Demo Funds</h3>
            <p className="text-sm text-gray-600 mb-4">
              This is a simulated wallet for college project. Add demo funds to test the escrow system.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (Max ₹50,000 per transaction)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setAmount('5000')}
                  className="btn-secondary text-sm"
                >
                  ₹5,000
                </button>
                <button
                  onClick={() => setAmount('10000')}
                  className="btn-secondary text-sm"
                >
                  ₹10,000
                </button>
                <button
                  onClick={() => setAmount('25000')}
                  className="btn-secondary text-sm"
                >
                  ₹25,000
                </button>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddFunds(false)
                    setAmount('')
                    setError(null)
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleAddFunds} className="btn-primary">
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletDisplay
