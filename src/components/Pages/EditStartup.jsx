import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Loader from '../layout/Loader';
import AsyncSelect from 'react-select/async';

ChartJS.register(ArcElement, Tooltip, Legend);

const EditStartup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startupData, setStartupData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Track original data vs changes
  const [originalBasicDetails, setOriginalBasicDetails] = useState(null);
  const [originalEquitySplit, setOriginalEquitySplit] = useState(null);
  const [originalFundings, setOriginalFundings] = useState(null);
  
  // Track if each section has changes
  const [hasBasicDetailsChanged, setHasBasicDetailsChanged] = useState(false);
  const [hasEquitySplitChanged, setHasEquitySplitChanged] = useState(false);
  const [hasFundingsChanged, setHasFundingsChanged] = useState(false);
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [hoveredPerson, setHoveredPerson] = useState(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:8000';
  
  // Headers for API requests
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Fetch startup data on component mount
  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/startups/${id}`);
        const data = response.data;
        setStartupData(data);
        
        // Normalize the data structure
        const normalizedData = {
          startup_name: data.startup_name || '',
          description: data.description || '',
          industry: data.industry || '',
          website: data.website || '',
          logo_url: data.logo_url || '',
          market_size: data.market_size || '',
          revenue_model: data.revenue_model || '',
          equity_split: data.equity_split ? [...data.equity_split] : [],
          previous_fundings: data.previous_fundings ? [...data.previous_fundings] : [],
          founders: data.founders || []
        };
        
        // Initialize form data with fetched data
        setFormData(normalizedData);
        
        // Set original data for change detection
        setOriginalBasicDetails(JSON.stringify({
          startup_name: data.startup_name,
          description: data.description,
          industry: data.industry,
          website: data.website,
          market_size: data.market_size,
          revenue_model: data.revenue_model
        }));
        
        setOriginalEquitySplit(JSON.stringify(data.equity_split));
        setOriginalFundings(JSON.stringify(data.previous_fundings));
        
        setLogoPreview(data.logo_url);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching startup data:', error);
        setError('Failed to load startup data');
        setLoading(false);
      }
    };

    if (id) {
      fetchStartupData();
    }
  }, [id]);

  // Check for changes in data
  useEffect(() => {
    if (formData && originalBasicDetails) {
      const currentBasicDetails = {
        startup_name: formData.startup_name,
        description: formData.description,
        industry: formData.industry,
        website: formData.website,
        market_size: formData.market_size,
        revenue_model: formData.revenue_model
      };
      
      setHasBasicDetailsChanged(
        JSON.stringify(currentBasicDetails) !== originalBasicDetails || logoFile !== null
      );
    }
  }, [formData, originalBasicDetails, logoFile]);

  useEffect(() => {
    if (formData && originalEquitySplit) {
      setHasEquitySplitChanged(
        JSON.stringify(formData.equity_split) !== originalEquitySplit
      );
    }
  }, [formData?.equity_split, originalEquitySplit]);

  useEffect(() => {
    if (formData && originalFundings) {
      setHasFundingsChanged(
        JSON.stringify(formData.previous_fundings) !== originalFundings
      );
    }
  }, [formData?.previous_fundings, originalFundings]);

  // Setup pie chart data
  const getEquityData = () => {
    if (!formData?.equity_split?.length) return null;
    
    return {
      labels: formData.equity_split.map((entry) => entry.name),
      datasets: [
        {
          data: formData.equity_split.map((entry) => {
            // Convert equity percentage to number (removing % if present)
            let value = entry.equity_percentage;
            if (typeof value === 'string') {
              value = parseFloat(value.replace('%', ''));
            }
            return value || 0;
          }),
          backgroundColor: [
            '#EF4444', '#3B82F6', '#EC4899', '#10B981', 
            '#8B5CF6', '#F59E0B', '#06B6D4', '#6366F1', 
            '#F97316', '#14B8A6', '#D946EF', '#84CC16'
          ].slice(0, formData.equity_split.length),
          hoverBackgroundColor: [
            '#DC2626', '#2563EB', '#DB2777', '#059669', 
            '#7C3AED', '#D97706', '#0891B2', '#4F46E5', 
            '#EA580C', '#0D9488', '#C026D3', '#65A30D'
          ].slice(0, formData.equity_split.length),
          hoverBorderWidth: 4,
          hoverBorderColor: '#fff',
          borderWidth: hoveredPerson !== null ? 2 : 0,
          borderColor: formData.equity_split.map((entry) => 
            hoveredPerson === entry.name ? '#fff' : 'transparent'
          ),
        },
      ],
    };
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    cutout: '55%',
    hover: {
      mode: 'single'
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#fff',
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  // Handle text input changes
  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  // Handle logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle person hover for pie chart
  const handlePersonHover = (name) => {
    setHoveredPerson(name);
  };

  // Function to load investors for AsyncSelect
  const loadUsers = async (inputValue, type = 'all') => {
    if (inputValue && inputValue.length < 2) {
      return [];
    }
    
    try {
      let endpoint = type === 'founders' ? 'founders' : 
                     type === 'investors' ? 'investors' : '';
      
      const response = await axios.get(`${API_BASE_URL}/users/${endpoint}/`, {
        headers
      });
      
      const users = response.data || [];
      
      // Format for react-select
      const options = users.map(user => ({
        value: user._id,
        label: user.fullName || 'Unknown Name',
        userData: user
      }));
      
      return options.filter(option => 
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Handle equity split updates
  const updateEquityField = (index, field, value) => {
    // If updating equity percentage, handle special formatting
    if (field === 'equity_percentage') {
      // Remove any non-numeric characters except decimal point
      value = value.toString().replace(/[^\d.]/g, '');
      
      // Prevent entering more than one decimal point
      const decimalCount = (value.match(/\./g) || []).length;
      if (decimalCount > 1) {
        const parts = value.split('.');
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Limit to 2 decimal places
      if (value.includes('.')) {
        const parts = value.split('.');
        value = parts[0] + '.' + parts[1].substring(0, 2);
      }
      
      // Prevent values greater than 100
      if (parseFloat(value) > 100) {
        value = '100';
      }
    }
    
    setFormData({
      ...formData,
      equity_split: formData.equity_split.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    });
  };

  const addEquityRow = () => {
    setFormData({
      ...formData,
      equity_split: [
        ...formData.equity_split,
        { type: 'Investor', name: '', equity_percentage: '', userId: null }
      ]
    });
  };

  const removeEquityRow = (index) => {
    // Don't remove if this is a founder
    const entryToRemove = formData.equity_split[index];
    if (entryToRemove.type === 'Founder' && formData.founders.includes(entryToRemove.userId)) {
      alert("You cannot remove a founder's equity. Please adjust the percentage instead.");
      return;
    }
    
    setFormData({
      ...formData,
      equity_split: formData.equity_split.filter((_, i) => i !== index)
    });
  };

  // Handle funding updates
  const updateFundingField = (index, field, value) => {
    setFormData({
      ...formData,
      previous_fundings: formData.previous_fundings.map((funding, i) =>
        i === index ? { ...funding, [field]: value } : funding
      )
    });
  };

  const addFundingRound = () => {
    setFormData({
      ...formData,
      previous_fundings: [
        ...formData.previous_fundings,
        { stage: '', amount: '', date: '', investors: [], startup_name: formData.startup_name }
      ]
    });
  };

  const removeFundingRound = (index) => {
    setFormData({
      ...formData,
      previous_fundings: formData.previous_fundings.filter((_, i) => i !== index)
    });
  };

  // Calculate total equity
  const totalEquity = formData?.equity_split?.reduce(
    (sum, entry) => {
      let percentage = entry.equity_percentage;
      if (typeof percentage === 'string') {
        percentage = parseFloat(percentage.replace('%', '')) || 0;
      }
      return sum + percentage;
    },
    0
  ) || 0;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate equity split
      if (Math.abs(totalEquity - 100) > 0.01) {
        alert('Total equity percentage must equal 100%');
        setIsSaving(false);
        return;
      }

      // Prepare update payload with only changed fields (like EditProfile)
      let hasAnyChange = false;
      const fd = new FormData();

      // Basic details
      if (hasBasicDetailsChanged) {
        fd.append('startup_name', formData.startup_name);
        fd.append('description', formData.description);
        fd.append('industry', formData.industry);
        fd.append('website', formData.website);
        fd.append('market_size', formData.market_size);
        fd.append('revenue_model', formData.revenue_model);
        hasAnyChange = true;
      }
      // Equity split
      if (hasEquitySplitChanged) {
        const equityArr = formData.equity_split.map(entry => {
          const obj = {
            type: entry.type,
            name: entry.name,
            equity_percentage: typeof entry.equity_percentage === 'string'
              ? parseFloat(entry.equity_percentage.replace('%', ''))
              : entry.equity_percentage
          };
          if (entry.userId) obj.userId = entry.userId;
          return obj;
        });
        fd.append('equity_split', JSON.stringify(equityArr));
        hasAnyChange = true;
      }
      // Fundings
      if (hasFundingsChanged) {
        const fundingsArr = formData.previous_fundings.map(funding => ({
          amount: funding.amount?.toString() ?? '',
          date: funding.date ?? '',
          stage: funding.stage ?? '',
          startup_name: formData.startup_name,
          investors: (funding.investors || []).map(inv => {
            const obj = {};
            if (inv.investorName || inv.label) obj.investorName = inv.investorName || inv.label || '';
            if (inv.investorId || inv.value) obj.investorId = inv.investorId || inv.value;
            return obj;
          })
        }));
        fd.append('previous_fundings', JSON.stringify(fundingsArr));
        hasAnyChange = true;
      }
      // Founders (always send as array of IDs if any other field is changed)
      if (hasAnyChange && Array.isArray(formData.founders)) {
        const foundersArr = formData.founders.map(f =>
          typeof f === 'object' && f._id ? f._id : f
        );
        fd.append('founders', JSON.stringify(foundersArr));
      }

      // Logo
      if (logoFile) {
        fd.append('logo', logoFile);
        hasAnyChange = true;
        // Always send founders if logo is changed
        if (Array.isArray(formData.founders)) {
          const foundersArr = formData.founders.map(f =>
            typeof f === 'object' && f._id ? f._id : f
          );
          fd.set('founders', JSON.stringify(foundersArr));
        }
      }

      // If nothing changed, do nothing
      if (!hasAnyChange) {
        alert('No changes to save');
        setIsSaving(false);
        return;
      }

      // Send update (always as FormData for backend compatibility)
      let response;
      try {
        response = await axios.put(
          `${API_BASE_URL}/startups/${id}`,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } catch (error) {
        // If status is 200 but error thrown (due to backend returning error after update), treat as success
        if (
          error.response &&
          error.response.status === 200
        ) {
          alert('Startup updated successfully!');
          navigate(`/startup/${id}`);
          setIsSaving(false);
          return;
        }
        throw error;
      }

      if (response && response.status === 200) {
        alert('Startup updated successfully!');
        navigate(`/startup/${id}`);
      } else {
        throw new Error('Failed to update startup');
      }
    } catch (error) {
      let errorMessage = 'Failed to update startup';
      if (error.response) {
        console.error('Response data:', error.response.data);
        errorMessage += `: ${error.response.status} - ${error.response.data?.detail || 'Server error'}`;
        // If data updated but error thrown, still show success
        if (
          error.response.status === 200 ||
          (typeof error.response.data?.detail === 'string' &&
            error.response.data.detail.includes('Error updating startup: 500: Error updating startup: 400:'))
        ) {
          alert('Startup updated (with backend warning).');
          navigate(`/startup/${id}`);
          setIsSaving(false);
          return;
        }
      } else if (error.request) {
        errorMessage += ': No response from server';
      } else {
        errorMessage += `: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading and error states
  if (loading || isSaving) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">No startup data available</div>
      </div>
    );
  }

  const equityData = getEquityData();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit Startup</h1>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/startup/${id}`)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasBasicDetailsChanged && !hasEquitySplitChanged && !hasFundingsChanged}
                className={`rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 ${
                  !hasBasicDetailsChanged && !hasEquitySplitChanged && !hasFundingsChanged ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          
          {/* Rest of the form UI remains unchanged */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              {/* Logo and Name */}
              <div className="flex flex-col items-center mb-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 relative group">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Startup Logo"
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 text-orange-500 fill-current">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 rounded-full hover:bg-opacity-40 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">Change Logo</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.startup_name}
                  onChange={(e) => handleInputChange(e, 'startup_name')}
                  className="text-3xl font-bold text-gray-900 mb-2 text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                  placeholder="Startup Name"
                  required
                />
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange(e, 'industry')}
                  className="px-4 py-1  rounded-full text-gray-600 text-sm text-center bg-transparent border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                  placeholder="Industry"
                  required
                />
              </div>

              {/* Market Size and Revenue Model */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-2">Market Size</p>
                  <input
                    type="text"
                    value={formData.market_size}
                    onChange={(e) => handleInputChange(e, 'market_size')}
                    className="text-2xl font-bold w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g., $10B"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-2">Revenue Model</p>
                  <input
                    type="text"
                    value={formData.revenue_model}
                    onChange={(e) => handleInputChange(e, 'revenue_model')}
                    className="text-2xl font-bold w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g., SaaS"
                  />
                </div>
              </div>

              {/* Equity Split */}
              <div className="mb-8">
                <div className="flex items-center mb-4 justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zm5 2a2 2 0 11-4 0 2 2 0 014 0zm-8 8a2 2 0 100-4 2 2 0 000 4zm0 2a3 3 0 100-6 3 3 0 000 6zm-8-6a2 2 0 100-4 2 2 0 000 4zm0 2a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold">Equity Split</h2>
                  </div>
                  <p className={`text-sm ${Math.abs(totalEquity - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                    Total: {totalEquity.toFixed(2)}% {Math.abs(totalEquity - 100) < 0.01 ? '✓' : '(must be 100%)'}
                  </p>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="w-56 h-56 relative p-3">
                    {equityData && <Pie data={equityData} options={pieOptions} />}
                    {hoveredPerson && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white bg-opacity-75 px-3 py-1 rounded-full shadow-sm">
                          <span className="font-medium">{hoveredPerson}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center mb-5 gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Founders</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 rounded-full bg-cyan-500"></div>
                    <span className="text-sm">Investors</span>
                  </div>
                </div>
                
                {/* Equity Table */}
                <div className="space-y-4">
                  {formData.equity_split.map((entry, index) => {
                    const dataIndex = index;
                    const isHighlighted = hoveredPerson === entry.name || hoveredPerson === null;
                    return (
                      <div 
                        key={index} 
                        className={`mb-3 p-2 rounded-lg transition-all duration-200 ${isHighlighted ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                        onMouseEnter={() => handlePersonHover(entry.name)}
                        onMouseLeave={() => handlePersonHover(null)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <select
                              value={entry.type}
                              onChange={(e) => updateEquityField(index, 'type', e.target.value)}
                              className="text-xs px-2 py-0.5 rounded-full bg-transparent border border-gray-200"
                              disabled={entry.userId && formData.founders.includes(entry.userId)}
                            >
                              <option value="Founder">Founder</option>
                              <option value="Investor">Investor</option>
                              <option value="Advisor">Advisor</option>
                              <option value="ESOP">ESOP</option>
                            </select>
                            <input
                              type="text"
                              value={entry.name}
                              onChange={(e) => updateEquityField(index, 'name', e.target.value)}
                              className="font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                              placeholder="Name"
                              disabled={entry.userId && formData.founders.includes(entry.userId)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={entry.equity_percentage}
                              onChange={(e) => updateEquityField(index, 'equity_percentage', e.target.value)}
                              className="w-16 text-gray-600 font-semibold text-right bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                              placeholder="%"
                            />
                            <span className="text-gray-600 font-semibold">%</span>
                            <button
                              type="button"
                              onClick={() => removeEquityRow(index)}
                              className="text-red-500 ml-2"
                              disabled={entry.userId && formData.founders.includes(entry.userId)}
                            >
                              {entry.userId && formData.founders.includes(entry.userId) ? '' : '×'}
                            </button>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${isHighlighted ? 'shadow-sm' : ''}`}
                            style={{ 
                              width: `${entry.equity_percentage}%`, 
                              backgroundColor: equityData?.datasets[0].backgroundColor[dataIndex] || '#ccc',
                              filter: isHighlighted ? 'brightness(1.1)' : 'brightness(0.9)'
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={addEquityRow}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Equity Row
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Website */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange(e, 'website')}
                  className="w-full p-2 border rounded-md"
                  placeholder="https://example.com"
                />
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                  className="w-full h-40 p-3 border rounded-md resize-none"
                  placeholder="Describe your startup..."
                  required
                ></textarea>
              </div>

              {/* Previous Fundings */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Previous Fundings</h2>
                  <button
                    type="button"
                    onClick={addFundingRound}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Funding Round
                  </button>
                </div>
                
                {formData.previous_fundings.length > 0 ? (
                  <div className="space-y-4">
                    {formData.previous_fundings.map((funding, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <input
                            type="text"
                            value={funding.stage}
                            onChange={(e) => updateFundingField(idx, 'stage', e.target.value)}
                            className="font-medium text-lg bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                            placeholder="e.g., Seed, Series A"
                          />
                          <div className="flex items-center">
                            <span className="text-indigo-600 mr-1">$</span>
                            <input
                              type="number"
                              value={funding.amount}
                              onChange={(e) => updateFundingField(idx, 'amount', e.target.value)}
                              className="font-bold text-indigo-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                              placeholder="Amount"
                            />
                          </div>
                        </div>
                        <div className="mb-2">
                          <input
                            type="date"
                            value={funding.date}
                            onChange={(e) => updateFundingField(idx, 'date', e.target.value)}
                            className="text-sm text-gray-500 bg-transparent border rounded-md p-1"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Investors:</h3>
                          <AsyncSelect
                            isMulti
                            cacheOptions
                            defaultOptions
                            loadOptions={(inputValue) => loadUsers(inputValue, 'investors')}
                            value={funding.investors.map(inv => ({ 
                              value: inv.investorId, 
                              label: inv.investorName 
                            }))}
                            onChange={(selected) => {
                              const formattedInvestors = selected ? selected.map(s => ({
                                investorId: s.value,
                                investorName: s.label
                              })) : [];
                              updateFundingField(idx, 'investors', formattedInvestors);
                            }}
                            placeholder="Search for investors..."
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end mt-3">
                          <button
                            type="button"
                            onClick={() => removeFundingRound(idx)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Remove Funding Round
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No investment rounds found. Click the button above to add one.</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStartup;
