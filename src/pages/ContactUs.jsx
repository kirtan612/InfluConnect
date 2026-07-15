import React from 'react'
import { useTheme } from '../context/ThemeContext'

const ContactUs = () => {
  const { isDark, colors } = useTheme()

  return (
    <div className={`min-h-screen ${colors.bg} pt-20`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold ${colors.text} mb-6`}>
            Contact Us
          </h1>
          <p className={`text-xl ${colors.textSecondary} max-w-2xl mx-auto`}>
            Get in touch with our team. We're here to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className={`text-2xl font-bold ${colors.text} mb-8`}>Get In Touch</h2>
            
            <div className="space-y-6">
              <div className={`${colors.bgSecondary} p-6 rounded-xl shadow-lg`}>
                <div className="flex items-center mb-3">
                  <div className={`w-12 h-12 ${isDark ? 'bg-purple-600' : 'bg-blue-600'} rounded-lg flex items-center justify-center mr-4`}>
                    <span className="text-xl text-white">📧</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>Email</h3>
                    <p className={`${colors.textSecondary}`}>hello@influconnect.com</p>
                  </div>
                </div>
              </div>

              <div className={`${colors.bgSecondary} p-6 rounded-xl shadow-lg`}>
                <div className="flex items-center mb-3">
                  <div className={`w-12 h-12 ${isDark ? 'bg-amber-600' : 'bg-emerald-600'} rounded-lg flex items-center justify-center mr-4`}>
                    <span className="text-xl text-white">💬</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>Support</h3>
                    <p className={`${colors.textSecondary}`}>support@influconnect.com</p>
                  </div>
                </div>
              </div>

              <div className={`${colors.bgSecondary} p-6 rounded-xl shadow-lg`}>
                <div className="flex items-center mb-3">
                  <div className={`w-12 h-12 ${isDark ? 'bg-purple-600' : 'bg-blue-600'} rounded-lg flex items-center justify-center mr-4`}>
                    <span className="text-xl text-white">📞</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>Phone</h3>
                    <p className={`${colors.textSecondary}`}>+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              <div className={`${colors.bgSecondary} p-6 rounded-xl shadow-lg`}>
                <div className="flex items-center mb-3">
                  <div className={`w-12 h-12 ${isDark ? 'bg-amber-600' : 'bg-emerald-600'} rounded-lg flex items-center justify-center mr-4`}>
                    <span className="text-xl text-white">📍</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>Address</h3>
                    <p className={`${colors.textSecondary}`}>San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${colors.bgSecondary} p-8 rounded-xl shadow-lg`}>
            <h2 className={`text-2xl font-bold ${colors.text} mb-6`}>Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>Name</label>
                <input 
                  type="text" 
                  className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>Email</label>
                <input 
                  type="email" 
                  className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>Subject</label>
                <input 
                  type="text" 
                  className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>Message</label>
                <textarea 
                  rows="4" 
                  className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className={`${colors.textSecondary}`}>
            We typically respond within 24 hours • Available Monday-Friday, 9AM-6PM PST
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactUs