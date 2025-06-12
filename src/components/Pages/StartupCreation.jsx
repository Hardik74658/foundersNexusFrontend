import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../layout/Loader';
import Toast from '../layout/Toast';

const StartupCreation = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?.id || localStorage.getItem('userId');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues: {
      startup_name: '',
      description: '',
      industry: '',
      website: '',
      market_size: '',
      revenue_model: '',
      founders: [],
    },
    mode: 'onBlur',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [founders, setFounders] = useState([]);
  const [previousFundings, setPreviousFundings] = useState([]);
  const [equitySplit, setEquitySplit] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const [currentUserIncluded, setCurrentUserIncluded] = useState(false);

  const API_BASE_URL = '/api';

  const mockFounders = [
    { _id: '1', fullName: 'John Smith', role: 'Founder' },
    { _id: '2', fullName: 'Sarah Johnson', role: 'Founder' },
    { _id: '3', fullName: 'Michael Chen', role: 'Founder' },
  ];

  const mockInvestors = [
    { _id: '4', fullName: 'Alex Rodriguez', role: 'Investor' },
    { _id: '5', fullName: 'Emma Wilson', role: 'Investor' },
    { _id: '6', fullName: 'David Kumar', role: 'Investor' },
  ];

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true,
  });

  const loadFounders = async (inputValue) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/founders/`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      let foundersData = response.data || [];

      const options = foundersData.map((founder) => ({
        value: founder._id,
        label: founder.fullName || 'Unknown Name',
        userData: founder,
      }));

      return options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching founders:', error);
      return mockFounders
        .filter((founder) =>
          founder.fullName.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((founder) => ({
          value: founder._id,
          label: founder.fullName,
          userData: founder,
        }));
    }
  };

  const loadInvestors = async (inputValue) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/investors/`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      let investorsData = response.data || [];

      const options = investorsData.map((investor) => ({
        value: investor._id,
        label: investor.fullName || 'Unknown Name',
        userData: investor,
      }));

      return options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching investors:', error);
      return mockInvestors
        .filter((investor) =>
          investor.fullName.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((investor) => ({
          value: investor._id,
          label: investor.fullName,
          userData: investor,
        }));
    }
  };

  const loadUsers = async (inputValue, type = 'all') => {
    if (inputValue && inputValue.length < 2) {
      return [];
    }

    try {
      if (type === 'founders') {
        return await loadFounders(inputValue || '');
      } else if (type === 'investors') {
        return await loadInvestors(inputValue || '');
      } else {
        const founders = await loadFounders(inputValue || '');
        const investors = await loadInvestors(inputValue || '');
        return [...founders, ...investors];
      }
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  };

  const addFounder = (selected) => {
    if (selected && !founders.some((f) => f.id === selected.value)) {
      setFounders((prev) => [
        ...prev,
        { id: selected.value, name: selected.label, userData: selected.userData },
      ]);
      setEquitySplit((prev) => [
        ...prev,
        { type: 'Founder', userId: selected.value, name: selected.label, equity_percentage: '' },
      ]);
    }
  };

  const removeFounder = (index) => {
    if (founders[index].isCurrentUser) {
      setToast({ show: true, message: "You cannot remove yourself as a founder." });
      return;
    }

    const founderId = founders[index].id;
    setFounders((prev) => prev.filter((_, i) => i !== index));
    setEquitySplit((prev) =>
      prev.filter((entry) => entry.userId !== founderId || entry.type !== 'Founder')
    );
  };

  const addFundingRound = () => {
    setPreviousFundings((prev) => [
      ...prev,
      { stage: '', amount: '', date: '', investors: [] },
    ]);
  };

  const removeFundingRound = (index) => {
    setPreviousFundings((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFundingField = (index, field, value) => {
    setPreviousFundings((prev) =>
      prev.map((funding, i) =>
        i === index ? { ...funding, [field]: value } : funding
      )
    );
  };

  const addEquityRow = () => {
    setEquitySplit((prev) => [
      ...prev,
      { type: 'Investor', name: '', equity_percentage: '' },
    ]);
  };

  const removeEquityRow = (index) => {
    setEquitySplit((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEquityField = (index, field, value) => {
    setEquitySplit((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const totalEquity = equitySplit.reduce(
    (sum, entry) => sum + (parseFloat(entry.equity_percentage) || 0),
    0
  );

  const validateEquitySplit = () => {
    if (equitySplit.length > 0 && Math.abs(totalEquity - 100) > 0.01) {
      return 'Total equity percentage must equal 100% when equity split is provided';
    }
    return true;
  };

  const onSubmit = async (data) => {
    const equityValidation = validateEquitySplit();
    if (equityValidation !== true) {
      setToast({ show: true, message: equityValidation });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const formData = new FormData();
      formData.append('startup_name', data.startup_name);
      formData.append('description', data.description);
      formData.append('industry', data.industry);
      formData.append('website', data.website || '');
      formData.append('market_size', data.market_size);
      formData.append('revenue_model', data.revenue_model || '');
      formData.append('founders', JSON.stringify(founders.map((f) => f.id)));

      if (logoFile) {
        formData.append('logo_url', logoFile);
      }

      if (previousFundings.length > 0) {
        const formattedFundings = previousFundings.map((funding) => ({
          startup_name: data.startup_name,
          stage: funding.stage,
          amount: parseFloat(funding.amount) || 0,
          date: funding.date,
          investors: funding.investors.map((inv) => ({
            investorId: inv.value,
            investorName: inv.label,
          })),
        }));

        formData.append('previous_fundings', JSON.stringify(formattedFundings));
      } else {
        formData.append('previous_fundings', JSON.stringify([]));
      }

      if (equitySplit.length > 0) {
        const formattedEquity = equitySplit.map((entry) => ({
          type: entry.type,
          userId: entry.userId || null,
          name: entry.name,
          equity_percentage: parseFloat(entry.equity_percentage) || 0,
        }));

        formData.append('equity_split', JSON.stringify(formattedEquity));
      } else {
        formData.append('equity_split', JSON.stringify([]));
      }

      const response = await axios.post(`${API_BASE_URL}/startups/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        setToast({ show: true, message: 'Startup created successfully!' });
        setTimeout(() => {
          setToast({ show: false, message: '' });
          navigate(`/startup/${response.data.id}`);
        }, 2000);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK' && error.message === 'Network Error') {
        setToast({ show: true, message: 'Startup created successfully! Redirecting...' });
        setTimeout(() => {
          setToast({ show: false, message: '' });
          navigate('/startup');
        }, 2000);
      } else {
        setToast({
          show: true,
          message: error.response?.data?.detail || 'Failed to create startup. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const addCurrentUserAsFounder = async () => {
      if (!userId || currentUserIncluded || founders.some((f) => f.id === userId)) {
        return;
      }

      console.log('Adding current user as founder');

      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const userData = response.data;

        if (founders.some((f) => f.id === userData._id)) {
          setCurrentUserIncluded(true);
          return;
        }

        const currentFounder = {
          id: userData._id,
          name: userData.fullName || 'Current User',
          userData: userData,
          isCurrentUser: true,
        };

        setFounders((prev) => [...prev.filter((f) => f.id !== userData._id), currentFounder]);
        setEquitySplit((prev) => [
          ...prev.filter((e) => e.userId !== userData._id || e.type !== 'Founder'),
          {
            type: 'Founder',
            userId: userData._id,
            name: userData.fullName || 'Current User',
            equity_percentage: '',
            isCurrentUser: true,
          },
        ]);

        setCurrentUserIncluded(true);
      } catch (error) {
        console.error('Error fetching current user details:', error);
        if (!currentUserIncluded && !founders.some((f) => f.id === userId)) {
          const currentFounder = {
            id: userId,
            name: currentUser?.name || 'Current User',
            isCurrentUser: true,
          };

          setFounders((prev) => [...prev.filter((f) => f.id !== userId), currentFounder]);
          setEquitySplit((prev) => [
            ...prev.filter((e) => e.userId !== userId || e.type !== 'Founder'),
            {
              type: 'Founder',
              userId: userId,
              name: currentUser?.name || 'Current User',
              equity_percentage: '',
              isCurrentUser: true,
            },
          ]);

          setCurrentUserIncluded(true);
        }
      }
    };

    addCurrentUserAsFounder();
  }, [userId]);

  return (
    <>
      <div className="fixed top-5 right-5 z-50">
        <Toast
          show={toast.show}
          message={toast.message}
          onUndo={() => setToast({ ...toast, show: false })}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 p-6">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Startup Information</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="startup_name" className="block text-sm font-medium leading-6 text-gray-900">
                Startup Name
              </label>
              <div className="mt-2">
                <input
                  id="startup_name"
                  {...register('startup_name', { required: 'Startup name is required' })}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.startup_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.startup_name.message}</p>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  {...register('description', { required: 'Description is required' })}
                  rows="3"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="industry" className="block text-sm font-medium leading-6 text-gray-900">
                Industry
              </label>
              <div className="mt-2">
                <input
                  id="industry"
                  {...register('industry', { required: 'Industry is required' })}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.industry && (
                  <p className="mt-2 text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                Website
              </label>
              <div className="mt-2">
                <input
                  id="website"
                  {...register('website', {
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: 'Invalid URL',
                    },
                  })}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.website && (
                  <p className="mt-2 text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="logo_url" className="block text-sm font-medium leading-6 text-gray-900">
                Logo File
              </label>
              <div className="mt-2">
                <input
                  id="logo_url"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Market and Revenue</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="market_size" className="block text-sm font-medium leading-6 text-gray-900">
                Market Size
              </label>
              <div className="mt-2">
                <input
                  id="market_size"
                  {...register('market_size', { required: 'Market size is required' })}
                  placeholder="e.g., $10B"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.market_size && (
                  <p className="mt-2 text-sm text-red-600">{errors.market_size.message}</p>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="revenue_model" className="block text-sm font-medium leading-6 text-gray-900">
                Revenue Model
              </label>
              <div className="mt-2">
                <textarea
                  id="revenue_model"
                  {...register('revenue_model')}
                  rows="3"
                  placeholder="Describe how your startup will generate revenue..."
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.revenue_model && (
                  <p className="mt-2 text-sm text-red-600">{errors.revenue_model.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Founders</h2>
          <div className="mt-10">
            <Controller
              control={control}
              name="founders"
              rules={{ validate: () => founders.length > 0 || 'At least one founder is required' }}
              render={({ field }) => (
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={(inputValue) => loadUsers(inputValue, 'founders')}
                  onChange={(selected) => {
                    addFounder(selected);
                    field.onChange(founders.map((f) => f.id));
                  }}
                  placeholder="Type name to search for a founder..."
                  noOptionsMessage={({ inputValue }) =>
                    inputValue.length < 2
                      ? 'Type at least 2 characters to search'
                      : 'No founders found'
                  }
                  className="basic-single"
                />
              )}
            />
            {errors.founders && (
              <p className="mt-2 text-sm text-red-600">{errors.founders.message}</p>
            )}
            <div className="mt-4 space-y-2">
              {founders.map((founder, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">
                    {founder.name}
                    {founder.isCurrentUser && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        You
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFounder(index)}
                    className={`text-sm font-semibold text-red-600 hover:text-red-500 ${
                      founder.isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={founder.isCurrentUser}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Previous Fundings</h2>
          <div className="mt-10 space-y-8">
            {previousFundings.map((funding, index) => (
              <div key={index} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">Stage</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={funding.stage}
                      onChange={(e) => updateFundingField(index, 'stage', e.target.value)}
                      placeholder="e.g., Seed, Series A"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">Amount</label>
                  <div className="mt-2">
                    <input
                      type="number"
                      value={funding.amount}
                      onChange={(e) => updateFundingField(index, 'amount', e.target.value)}
                      placeholder="e.g., 500000"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">Date</label>
                  <div className="mt-2">
                    <input
                      type="date"
                      value={funding.date}
                      onChange={(e) => updateFundingField(index, 'date', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-900">Investors</label>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    loadOptions={(inputValue) => loadUsers(inputValue, 'investors')}
                    value={funding.investors}
                    onChange={(selected) =>
                      updateFundingField(index, 'investors', selected || [])
                    }
                    placeholder="Type name to search for investors..."
                    noOptionsMessage={({ inputValue }) =>
                      inputValue.length < 2
                        ? 'Type at least 2 characters to search'
                        : 'No investors found'
                    }
                    className="mt-2"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeFundingRound(index)}
                  className="text-sm font-semibold text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFundingRound}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Add Funding Round
            </button>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Equity Distribution</h2>
          <div className="mt-10 space-y-6">
            {equitySplit.map((entry, index) => (
              <div key={index} className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900">Type</label>
                  {entry.userId ? (
                    <input
                      value="Founder"
                      disabled
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  ) : (
                    <select
                      value={entry.type}
                      onChange={(e) => updateEquityField(index, 'type', e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="Investor">Investor</option>
                      <option value="Advisor">Advisor</option>
                      <option value="ESOP">ESOP</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900">Name</label>
                  {entry.userId ? (
                    <input
                      value={entry.name}
                      disabled
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  ) : (
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={(inputValue) => loadUsers(inputValue)}
                      value={entry.name ? { value: entry.name, label: entry.name } : null}
                      onChange={(selected) =>
                        updateEquityField(index, 'name', selected ? selected.label : '')
                      }
                      placeholder="Type name to search for users..."
                      noOptionsMessage={({ inputValue }) =>
                        inputValue.length < 2
                          ? 'Type at least 2 characters to search'
                          : 'No users found'
                      }
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="sm:col-span-2 flex items-end gap-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-900">Equity Percentage (%)</label>
                    <input
                      type="number"
                      value={entry.equity_percentage}
                      onChange={(e) =>
                        updateEquityField(index, 'equity_percentage', e.target.value)
                      }
                      min="0"
                      max="100"
                      step="0.01"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {!entry.userId && (
                    <button
                      type="button"
                      onClick={() => removeEquityRow(index)}
                      className="mt-2 text-sm font-semibold text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div>
              <p className={`text-sm ${totalEquity === 100 ? 'text-green-600' : 'text-red-600'}`}>
                Total Equity: {totalEquity.toFixed(2)}%
              </p>
              <button
                type="button"
                onClick={addEquityRow}
                className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Add Equity Row
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Save Startup'}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
      </form>
    </>
  );
};

export default StartupCreation;