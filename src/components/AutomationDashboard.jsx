import { useState, useEffect } from 'react'
import { 
  BarChart2, 
  TrendingDown, 
  Flag, 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Activity,
  Eye,
  Calendar,
  Zap
} from 'lucide-react'
import adminService from '../services/adminService'

const AutomationDashboard = () => {
  const [activeTasks, setActiveTasks] = useState([])
  const [taskResults, setTaskResults] = useState({})
  const [loading, setLoading] = useState({})
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const automationTasks = [
    {
      id: 'trust-score',
      name: 'Recalculate Trust Scores',
      description: 'Recalculate trust scores for all influencers based on current metrics',
      icon: BarChart2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      gradient: 'from-indigo-500 to-purple-600',
      schedule: 'Daily at 2:00 AM',
      estimatedTime: '2-5 minutes',
      method: 'triggerTrustScoreRecalculation'
    },
    {
      id: 'suspicious-scan',
      name: 'Flag Suspicious Accounts',
      description: 'Automatically flag profiles with suspicious activity patterns',
      icon: Flag,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      gradient: 'from-amber-500 to-orange-600',
      schedule: 'Daily at 3:00 AM',
      estimatedTime: '1-3 minutes',
      method: 'triggerSuspiciousScan'
    },
    {
      id: 'inactive-check',
      name: 'Downgrade Inactive Users',
      description: 'Reduce trust scores for influencers who have been inactive',
      icon: TrendingDown,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      gradient: 'from-rose-500 to-red-600',
      schedule: 'Weekly (Sunday 4:00 AM)',
      estimatedTime: '1-2 minutes',
      method: 'triggerInactiveCheck'
    },
    {
      id: 'update-completion',
      name: 'Update Profile Completion',
      description: 'Recalculate profile completion percentages for all influencers',
      icon: ClipboardCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      gradient: 'from-emerald-500 to-teal-600',
      schedule: 'Daily at 1:00 AM',
      estimatedTime: '1-2 minutes',
      method: 'triggerProfileCompletionUpdate'
    }
  ]

  const fetchActiveTasks = async () => {
    try {
      const data = await adminService.getActiveTasks()
      setActiveTasks(data.active_tasks || [])
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Failed to fetch active tasks:', err)
    }
  }

  const fetchTaskStatus = async (taskId) => {
    try {
      const status = await adminService.getTaskStatus(taskId)
      setTaskResults(prev => ({
        ...prev,
        [taskId]: status
      }))
    } catch (err) {
      console.error('Failed to fetch task status:', err)
    }
  }

  useEffect(() => {
    fetchActiveTasks()
    const interval = setInterval(fetchActiveTasks, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleTriggerTask = async (task) => {
    setLoading(prev => ({ ...prev, [task.id]: true }))
    setError(null)
    
    try {
      const result = await adminService[task.method]()
      
      setTaskResults(prev => ({
        ...prev,
        [result.task_id]: {
          task_id: result.task_id,
          status: 'PENDING',
          message: result.message
        }
      }))

      // Start polling for task status
      const pollStatus = async () => {
        try {
          await fetchTaskStatus(result.task_id)
        } catch (err) {
          console.error('Error polling task status:', err)
        }
      }

      // Poll immediately and then every 2 seconds
      pollStatus()
      const pollInterval = setInterval(pollStatus, 2000)
      
      // Stop polling after 2 minutes
      setTimeout(() => clearInterval(pollInterval), 120000)
      
      await fetchActiveTasks()
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(prev => ({ ...prev, [task.id]: false }))
    }
  }

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="text-amber-500" size={16} />
      case 'SUCCESS':
        return <CheckCircle className="text-emerald-500" size={16} />
      case 'FAILURE':
        return <AlertCircle className="text-red-500" size={16} />
      default:
        return <Activity className="text-slate-400" size={16} />
    }
  }

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'FAILURE':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Automation Dashboard
              </h1>
              <p className="text-slate-600">
                Manage background tasks and system automation
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <Activity className="text-slate-500" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  {activeTasks.length} Active
                </span>
              </div>
              <button
                onClick={fetchActiveTasks}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg border border-indigo-200 transition-colors"
              >
                <RefreshCw size={16} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Active Tasks Overview */}
      {activeTasks.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-indigo-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Currently Running Tasks</h2>
          </div>
          <div className="space-y-3">
            {activeTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-medium text-slate-900">{task.name}</p>
                  <p className="text-sm text-slate-600">Task ID: {task.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-indigo-600">Running</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automation Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {automationTasks.map((task) => {
          const IconComponent = task.icon
          const isLoading = loading[task.id]
          const taskResult = Object.values(taskResults).find(result => 
            result.message && result.message.toLowerCase().includes(task.name.toLowerCase().split(' ')[0])
          )

          return (
            <div
              key={task.id}
              className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${task.bg} opacity-30 rounded-full blur-2xl`}></div>
              
              <div className="relative z-10">
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${task.bg} ${task.border} border rounded-xl flex items-center justify-center`}>
                      <IconComponent className={task.color} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{task.name}</h3>
                      <p className="text-sm text-slate-600">{task.description}</p>
                    </div>
                  </div>
                  
                  {taskResult && (
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-xs font-medium ${getTaskStatusColor(taskResult.status)}`}>
                      {getTaskStatusIcon(taskResult.status)}
                      <span>{taskResult.status}</span>
                    </div>
                  )}
                </div>

                {/* Task Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-slate-400" size={16} />
                      <span className="text-slate-600">Schedule:</span>
                    </div>
                    <span className="font-medium text-slate-700">{task.schedule}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="text-slate-400" size={16} />
                      <span className="text-slate-600">Est. Time:</span>
                    </div>
                    <span className="font-medium text-slate-700">{task.estimatedTime}</span>
                  </div>
                </div>

                {/* Task Result */}
                {taskResult && taskResult.result && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-1">Last Result:</p>
                    <p className="text-sm text-slate-600">{taskResult.result.message}</p>
                    {taskResult.result.total_processed && (
                      <div className="flex space-x-4 mt-2 text-xs text-slate-500">
                        <span>Processed: {taskResult.result.total_processed}</span>
                        {taskResult.result.updated_count && (
                          <span>Updated: {taskResult.result.updated_count}</span>
                        )}
                        {taskResult.result.flagged_count && (
                          <span>Flagged: {taskResult.result.flagged_count}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleTriggerTask(task)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${task.gradient} hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      <span>Run Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Results History */}
      {Object.keys(taskResults).length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="text-slate-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Recent Task Results</h2>
          </div>
          
          <div className="space-y-3">
            {Object.entries(taskResults).map(([taskId, result]) => (
              <div key={taskId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="flex items-center space-x-2">
                    {getTaskStatusIcon(result.status)}
                    <span className="font-medium text-slate-900">Task {taskId.slice(0, 8)}...</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{result.message}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg border text-xs font-medium ${getTaskStatusColor(result.status)}`}>
                  {result.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Last refreshed: {lastRefresh.toLocaleTimeString()}</span>
          <span>Auto-refresh every 10 seconds</span>
        </div>
      </div>
    </div>
  )
}

export default AutomationDashboard