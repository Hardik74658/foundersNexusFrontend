import React, { useState } from 'react';

export default function InvestorDetails({ register, errors, setValue, watch }) {
  const investmentInterests = watch('investmentInterests') || [];
  const previousInvestments = watch('previousInvestments') || [];

  const [newInterest, setNewInterest] = useState('');
  const [newInvestment, setNewInvestment] = useState({
    startupName: '',
    amount: '',
    date: '',
  });

  const handleAddInterest = () => {
    const updatedInterests = [...investmentInterests, newInterest];
    setValue('investmentInterests', updatedInterests); // Update form state
    setNewInterest('');
  };

  const handleAddInvestment = () => {
    const updatedInvestments = [...previousInvestments, newInvestment];
    setValue('previousInvestments', updatedInvestments); // Update form state
    setNewInvestment({ startupName: '', amount: '', date: '' });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Investor Details</h3>

      {/* Investor Type */}
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="investor-type" className="block text-sm font-medium text-gray-900">
            Investor Type
          </label>
          <select
            {...register('investorType')} // Register investor type
            id="investor-type"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
          >
            <option>Angel</option>
            <option>VC</option>
            <option>Corporate</option>
            <option>Government</option>
          </select>
          {errors.investorType && (
            <p className="text-red-500 text-sm mt-1">{errors.investorType.message}</p>
          )}
        </div>
        <div className="sm:col-span-4">
          <label htmlFor="funds" className="block text-sm font-medium text-gray-900">
            Funds Available
          </label>
          <input
            {...register('funds')} // Register funds
            id="funds"
            type="number"
            placeholder="e.g., 500000"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
          />
          {errors.funds && (
            <p className="text-red-500 text-sm mt-1">{errors.funds.message}</p>
          )}
        </div>
      </div>

      {/* Investment Interests */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900">Investment Interests</h4>
        {investmentInterests.map((interest, index) => (
          <div key={index} className="mt-2 text-sm text-gray-700">
            {interest}
          </div>
        ))}
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="Interest (e.g., Technology, Healthcare)"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Add Interest
          </button>
        </div>
      </div>

      {/* Previous Investments */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900">Previous Investments</h4>
        {previousInvestments.map((investment, index) => (
          <div key={index} className="mt-2 text-sm text-gray-700">
            {investment.startupName} - ${investment.amount} on {investment.date}
          </div>
        ))}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Startup Name"
            value={newInvestment.startupName}
            onChange={(e) => setNewInvestment({ ...newInvestment, startupName: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newInvestment.amount}
            onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <input
            type="date"
            placeholder="Date"
            value={newInvestment.date}
            onChange={(e) => setNewInvestment({ ...newInvestment, date: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
        </div>
        <button
          type="button"
          onClick={handleAddInvestment}
          className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Add Investment
        </button>
      </div>
    </div>
  );
}
