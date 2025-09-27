"use client"

import { useEffect } from 'react'
import { mobileApp } from '@/lib/mobile-init'
import { MobileApiClient } from '@/lib/mobile-config'

export default function MobileApp() {
  useEffect(() => {
    // Initialize mobile app
    mobileApp.initialize()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Mobile App Header */}
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold text-center">CampTrade</h1>
          <p className="text-sm text-center text-blue-100">Campus Marketplace</p>
        </div>

        {/* Mobile App Content */}
        <div className="p-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to CampTrade
            </h2>
            <p className="text-gray-600">
              Buy, sell, and swap items on campus
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="bg-blue-600 text-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🛍️</div>
              <div className="font-medium">Browse</div>
            </button>
            <button className="bg-green-600 text-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-medium">Sell</div>
            </button>
          </div>

          {/* Featured Products */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Featured Products</h3>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <h4 className="font-medium">Introduction to Algorithms</h4>
                    <p className="text-sm text-gray-600">₹40</p>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <h4 className="font-medium">TI-84 Plus Calculator</h4>
                    <p className="text-sm text-gray-600">₹30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile App Info */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Mobile App Features</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Offline browsing</li>
              <li>• Push notifications</li>
              <li>• Camera integration</li>
              <li>• Secure payments</li>
            </ul>
          </div>
        </div>

        {/* Mobile App Footer */}
        <div className="bg-gray-800 text-white p-4 mt-auto">
          <div className="text-center text-sm">
            <p>Powered by CampTrade</p>
            <p className="text-gray-400">Backend: camp-trade.vercel.app</p>
          </div>
        </div>
      </div>
    </div>
  )
}
