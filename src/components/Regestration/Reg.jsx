import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import FounderDetails from './FounderDetails';
import InvestorDetails from './InvestorDetails';
import { UserDetails } from './UserDetails';
import { PersonalDetails } from './PersonalDetails';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { ClosedCaptionDisabledSharp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Reg() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const navigate = useNavigate(); // Correctly initialize useNavigate here

  // Validation schemas for each step
  const userDetailsSchema = yup.object({
    username: yup.string().required('Username is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const personalDetailsSchema = yup.object({
    age: yup.number().positive('Age must be positive').integer('Age must be an integer').required('Age is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    postalCode: yup.string().required('Postal code is required'),
    bio: yup.string().required('Bio is required'), // Move bio to personal details
  });

  const roleDetailsSchema = yup.object({
    role: yup.string().required('Role is required'), // Role is always required
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(
      step === 1
        ? userDetailsSchema
        : step === 2
        ? personalDetailsSchema
        : roleDetailsSchema
    ),
  });

  // Handle next step
  const handleNext = (data) => {
    setUserData({ ...userData, ...data });
    setStep(step + 1);
    // reset(); // Reset form for the next step
  };

  // Handle previous step
  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle final submission
  const handleFinalSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // Extract user details
      const userDetails = {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        age: data.age || null,
        profilePicture: '', // Assuming profilePicture is not part of the form
        bio: data.bio,
        location: `${data.city}, ${data.state}`,
        roleId: (data.role==="founder")?"67c677834e8d102569b9813e":"67c6779e4e8d102569b9813f",
      };

      console.log('User Details:', userDetails);

      // Extract founder details if the role is 'founder'
      let founderDetails = null;
      if (data.role === 'founder') {
        founderDetails = {
          userId: 'generatedUserId', // Replace with actual user ID after user creation
          educationalBackground: data.education || [],
          skills: data.skills || [],
          workExperience: data.workExperience || [],
          certifications: data.certifications || [],
          portfolioLinks: data.portfolioLinks || [],
        };
        console.log('Founder Details:', founderDetails);
      }

      // Extract investor details if the role is 'investor'
      let investorDetails = null;
      if (data.role === 'investor') {
        investorDetails = {
          user_id: 'generatedUserId', // Replace with actual user ID after user creation
          investor_type: data.investorType,
          funds_available: parseFloat(data.funds) || 0,
          investment_interests: data.investmentInterests || [],
          previous_investments: data.previousInvestments || [],
        };
        console.log('Investor Details:', investorDetails);
      }

      // Example API calls (uncomment and replace with actual API endpoints)
      let userId=null;
      try{
        const userResponse = await axios.post('/api/users', userDetails);
        userId = userResponse.data.user;
        console.log("User Id : ",userId)
      }
      catch(err){
        console.log("Error Occured During User Creayion : ",err);
      }

      let founderId=null;
      if (founderDetails) {
        try{
          founderDetails.userId = userId;
          let founderResponse = await axios.post('/api/users/entrepreneurs/', founderDetails);
          founderId = founderResponse.data.entrepreneurId
        }
        catch(err){
          console.log("Error Occured During Founder Creation : ",err);
        }
      }

      let investorId = null
      if (investorDetails) {
        try{
          investorDetails.user_id = userId;
          let investorResponse = await axios.post('/api/users/investors/', investorDetails);
          investorId = investorResponse.data.investorId
        }
        catch(err){
          console.log("Error Occured During Investor Creation : ",err);
        }
      }

      alert('User registered successfully!');
      if(userId && (founderId || investorId)){
        navigate("/login")
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setError('Failed to register user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage based on the current step
  const progressPercentage = (step - 1) * 33; // 0% for step 1, 33% for step 2, 66% for step 3

  return (
    <div className="py-16">
      <h1 className="text-2xl text-brand flex justify-center items-center">
        Welcome To The World Of Your Dreams!!
      </h1>
      <ProgressBar
        progressPercentage={progressPercentage}
        steps={['User Details', 'Personal Details', 'Role Specific Details']}
      />
      <form
        onSubmit={handleSubmit(
          (data) => {
            console.log('Form submitted with data:', data); // Debugging log to confirm form submission
            if (step === 3) {
              console.log('Submitting final step'); // Debugging log to confirm step 3
              handleFinalSubmit(data); // Ensure handleFinalSubmit is called
            } else {
              console.log('Proceeding to next step'); // Debugging log to confirm next step
              handleNext(data); // Proceed to the next step
            }
          },
          (validationErrors) => {
            console.log('Validation errors:', validationErrors); // Debugging log to check validation errors
          }
        )}
        className="p-32"
      >
        <div className="space-y-12">
          {step === 1 && (
            <UserDetails
              register={register}
              errors={errors}
              userData={userData}
              setUserData={setUserData}
              showPassword={showPassword}
              setShowPassword={setShowPassword} // Pass setShowPassword to UserDetails
            />
          )}
          {step === 2 && (
            <PersonalDetails
              register={register}
              errors={errors}
              userData={userData}
              setUserData={setUserData}
            />
          )}
          {step === 3 && (
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Select Role</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Please select whether you are a Founder or an Investor.
              </p>
              <div className="flex justify-start items-center gap-4">
                <label
                  htmlFor="founder"
                  className={`block text-sm font-medium m-4 text-gray-900 border-2 rounded-xl py-8 px-12 w-fit ${
                    watch('role') === 'founder' ? 'border-brand text-brand' : 'border-black'
                  }`}
                >
                  <div className="flex items-center gap-x-3">
                    <input
                      id="founder"
                      name="role"
                      type="radio"
                      value="founder"
                      {...register('role')} // Register the role field
                      className="h-4 w-4 border-gray-300 hidden text-indigo-600 focus:ring-indigo-600"
                    />
                    Founder
                  </div>
                </label>
                <label
                  htmlFor="investor"
                  className={`block text-sm font-medium text-gray-900 border-2 rounded-xl py-8 px-12 w-fit ${
                    watch('role') === 'investor' ? 'border-brand text-brand' : 'border-black'
                  }`}
                >
                  <div className="flex items-center gap-x-3">
                    <input
                      id="investor"
                      name="role"
                      type="radio"
                      value="investor"
                      {...register('role')} // Register the role field
                      className="h-4 w-4 border-gray-300 hidden text-indigo-600 focus:ring-indigo-600"
                    />
                    Investor
                  </div>
                </label>
              </div>
              {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>} {/* Display validation error */}
              <div className="mt-10">
                {watch('role') === 'founder' && <FounderDetails register={register} errors={errors} setValue={setValue} watch={watch} />}
                {watch('role') === 'investor' && <InvestorDetails register={register} errors={errors} setValue={setValue} watch={watch} />}
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="text-sm/6 font-semibold text-gray-900"
            >
              Previous
            </button>
          )}
          {step < 3 && (
            <button
              type="submit"
              className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
