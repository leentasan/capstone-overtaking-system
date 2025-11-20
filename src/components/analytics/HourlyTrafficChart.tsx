import React from 'react';

// NOTE: Component ini TIDAK dipakai di Analytics page
// karena udah ada TrendChart yang lebih lengkap
// File ini cuma placeholder biar nggak error import

export default function HourlyTrafficChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Hourly Traffic</h3>
      <p className="text-gray-500">Component not used - see TrendChart instead</p>
    </div>
  );
}