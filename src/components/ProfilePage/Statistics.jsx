import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Required for react-chartjs-2
import React from 'react';

function StatCard({ title, value, percentage, icon }) {
  return (
    <div className="px-6 py-6 bg-gray-100 border border-gray-300 rounded-lg shadow-xl">
      <div className="flex items-center justify-between">
        <span className={`font-bold text-sm ${title === 'Total Revenue' ? 'text-indigo-600' : title === 'New Orders' ? 'text-green-600' : 'text-blue-600'}`}>
          {title}
        </span>
        <span className="text-xs bg-gray-200 hover:bg-gray-500 text-gray-500 hover:text-gray-200 px-2 py-1 rounded-lg transition duration-200 cursor-default">
          7 days
        </span>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div>{icon}</div>
        <div className="flex flex-col">
          <div className="flex items-end">
            <span className="text-2xl 2xl:text-3xl font-bold">{value}</span>
            <div className="flex items-center ml-2 mb-1">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-bold text-sm text-gray-500 ml-0.5">{percentage}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Statistics({ statistics }) {
  const { revenue, orders, connections, chartData } = statistics;

  return (
    <>
      <h4 className="text-xl text-gray-900 font-bold">Statistics</h4>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <StatCard
          title="Total Revenue"
          value={revenue.value}
          percentage={revenue.percentage}
          icon={
            <svg className="w-12 h-12 p-2.5 bg-indigo-400 bg-opacity-20 rounded-full text-indigo-600 border border-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="New Orders"
          value={orders.value}
          percentage={orders.percentage}
          icon={
            <svg className="w-12 h-12 p-2.5 bg-green-400 bg-opacity-20 rounded-full text-green-600 border border-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        <StatCard
          title="New Connections"
          value={connections.value}
          percentage={connections.percentage}
          icon={
            <svg className="w-12 h-12 p-2.5 bg-blue-400 bg-opacity-20 rounded-full text-blue-600 border border-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </div>
      <div className="mt-4">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Last 12 Months' },
            },
          }}
        />
      </div>
    </>
  );
}

export default Statistics;