"use client";

import { useState } from "react";

export default function OrderTrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<{ id: string; status: string; date: string } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsSearching(true);
    setTrackingResult(null);

    // Simulate an API call
    setTimeout(() => {
      setTrackingResult({
        id: trackingId,
        status: "In Transit",
        date: new Date().toLocaleDateString(),
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Track Your Order</h1>
        
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="trackingId" className="sr-only">Order Number or Tracking ID</label>
              <input
                id="trackingId"
                type="text"
                placeholder="Enter Order Number or Tracking ID"
                className="input-field w-full"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="btn-primary"
            >
              {isSearching ? "Searching..." : "Track Order"}
            </button>
          </form>
        </div>

        {trackingResult && (
          <div className="animate-fadeIn bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tracking Details</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-medium text-gray-900">{trackingResult.id}</p>
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  <p className="text-sm text-gray-500">Expected Delivery</p>
                  <p className="font-medium text-gray-900">Tomorrow by 8:00 PM</p>
                </div>
              </div>

              {/* Milestones timeline */}
              <div className="relative pt-4">
                <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                
                <ul className="space-y-6">
                  <li className="relative flex gap-4">
                    <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white bg-black"></div>
                    <div className="pl-10">
                      <p className="font-medium text-gray-900">Out for Delivery</p>
                      <p className="text-sm text-gray-500">The package is out for delivery.<br/>{new Date().toLocaleDateString()} 08:30 AM</p>
                    </div>
                  </li>
                  <li className="relative flex gap-4">
                    <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white bg-black"></div>
                    <div className="pl-10">
                      <p className="font-medium text-gray-900">In Transit</p>
                      <p className="text-sm text-gray-500">Arrived at local distribution center.<br/>{new Date(Date.now() - 86400000).toLocaleDateString()} 11:45 PM</p>
                    </div>
                  </li>
                  <li className="relative flex gap-4">
                    <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white bg-black"></div>
                    <div className="pl-10">
                      <p className="font-medium text-gray-900">Order Processed</p>
                      <p className="text-sm text-gray-500">Package has left the facility.<br/>{new Date(Date.now() - 86400000 * 2).toLocaleDateString()} 02:15 PM</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
