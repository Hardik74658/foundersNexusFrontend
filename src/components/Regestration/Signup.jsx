import React, { useState } from 'react';
import ProgressBar from './ProgressBar'; // See note below about ProgressBar styling
import FounderDetails from './FounderDetails';
import InvestorDetails from './InvestorDetails';
import { UserDetails } from './UserDetails';
import { PersonalDetails } from './PersonalDetails';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Reg() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    bio: yup.string().required('Bio is required'),
  });

  const roleDetailsSchema = yup.object({
    role: yup.string().required('Role is required'),
  });

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
      // Build user details object
      const userDetails = {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        age: data.age || null,
        profilePictureFile: data.profilePic || null, // Include profile picture file
        coverImageFile: data.coverImage || null, // Include cover image file
        bio: data.bio,
        location: `${data.city}, ${data.state}`,
        roleId: data.role === "founder" ? "67c677834e8d102569b9813e" : "67c6779e4e8d102569b9813f",
      };

      console.log('User Details:', userDetails);
      let userResponse = null;
      let userId = null;
      try {
        const formData = new FormData();
        formData.append("fullName", userDetails.fullName);
        formData.append("email", userDetails.email);
        formData.append("password", userDetails.password);
        formData.append("age", userDetails.age || ""); // Send empty string if not provided
        formData.append("roleId", userDetails.roleId);
        formData.append("bio", userDetails.bio || "");
        formData.append("location", userDetails.location || "");

        // Append files individually as File objects
        if (userDetails.profilePictureFile && userDetails.profilePictureFile[0]) {
          formData.append("profilePicture", userDetails.profilePictureFile[0]);
        }
        if (userDetails.coverImageFile && userDetails.coverImageFile[0]) {
          formData.append("coverPicture", userDetails.coverImageFile[0]);
        }

        // Debugging: Log FormData content
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        userResponse = await axios.post(
          "htttp://http://13.232.209.194/users", // Ensure this endpoint is correct
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        userId = userResponse.data.user; // Ensure userId is extracted correctly
        console.log("User Id:", userId);
      } catch (err) {
        console.error("Error during user creation:", err.response?.data || err.message);
        setError("Failed to create user. Please check your input and try again.");
        return; // Exit early if user creation fails
      }

      let founderId = null;
      if (data.role === 'founder') {
        let founderDetails = {
          userId: userId, // Ensure userId is passed here
          educationalBackground: data.education || [],
          skills: data.skills || [],
          workExperience: data.workExperience || [],
          certifications: data.certifications || [],
          portfolioLinks: data.portfolioLinks || [],
        };
        console.log('Founder Details:', founderDetails);
        try {
          const founderResponse = await axios.post('htttp://http://13.232.209.194/users/entrepreneurs/', founderDetails);
          founderId = founderResponse.data.entrepreneurId;
        } catch (err) {
          console.log("Error during founder creation:", err);
        }
      }

      let investorId = null;
      if (data.role === 'investor') {
        let investorDetails = {
          userId: userId, // updated with created user id
          investor_type: data.investorType,
          funds_available: parseFloat(data.funds) || 0,
          investment_interests: data.investmentInterests || [],
          previous_investments: data.previousInvestments || [],
        };
        console.log('Investor Details:', investorDetails);
        try {
          const investorResponse = await axios.post('htttp://http://13.232.209.194/users/investors/', investorDetails);
          investorId = investorResponse.data.investorId;
        } catch (err) {
          console.log("Error during investor creation:", err);
        }
      }

      alert('User registered successfully!');
      if (userId && (founderId || investorId)) {
        navigate("/login");
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setError('Failed to register user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage based on current step
  const progressPercentage = (step - 1) * 33;

  return (
    <section className="py-24 relative bg-gray-50">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="flex flex-col items-start gap-12">
          {/* Header for progress */}
          <h2 className="w-full text-center text-gray-900 text-4xl font-bold font-manrope leading-normal">
            Account Information
          </h2>

          {/* Progress Bar & Steps */}
          <div className="flex flex-col items-center justify-center w-full  gap-8">
            <ol className="flex items-center justify-center gap-8 text-xs text-gray-900 font-medium sm:text-base relative">
              {/* Step 1 */}
              <li className="flex relative text-center text-indigo-600 text-base font-semibold leading-relaxed justify-center after:content-[''] sm:after:w-[172px] after:w-[150px] after:border-dashed after:border after:border-indigo-600 after:inline-block after:absolute after:top-5 sm:after:left-[110px] after:left-[100px]">
                <div className="sm:w-[176px] w-auto whitespace-nowrap text-center z-10">
                  <span className="w-10 h-10 bg-indigo-600 border border-dotted border-indigo-600 rounded-full flex justify-center items-center mx-auto mb-1 text-base text-white font-bold leading-relaxed lg:w-10 lg:h-10">
                    1
                  </span>
                  User Information 
                  <h6 className="text-center text-indigo-600 text-base font-normal leading-relaxed">
                    {step === 1 ? 'In Progress' : step > 1 ? 'Completed' : 'Pending'}
                  </h6>
                </div>
              </li>
              {/* Step 2 */}
              <li className="flex relative justify-center text-gray-500 text-base font-semibold leading-relaxed after:content-[''] sm:after:w-[172px] after:w-[150px] after:border-dashed after:border after:border-indigo-200 after:inline-block after:absolute after:top-5 sm:after:left-[106px] after:left-24">
                <div className="sm:w-[176px] w-auto whitespace-nowrap text-center flex flex-col z-10">
                  <span className={`w-10 h-10 ${step > 1 ? 'bg-indigo-600' : 'bg-indigo-50'} rounded-full flex justify-center items-center mx-auto mb-1 text-base font-bold leading-relaxed ${step > 1 ? 'text-white' : 'text-indigo-600'} lg:w-10 lg:h-10`}>
                    2
                  </span>
                  Company Information
                  <span className={`text-center ${step > 1? "text-indigo-600":"text-gray-500"}  text-base font-normal leading-relaxed`}>
                    {step === 2 ? 'In Progress' : step > 2 ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </li>
              {/* Step 3 */}
              <li className="flex relative justify-center text-gray-500 text-base font-semibold leading-relaxed">
                <div className="sm:w-[176px] w-auto whitespace-nowrap text-center flex flex-col z-10">
                  <span className={`w-10 h-10 text-center ${step > 2 ? 'bg-indigo-600' : 'bg-indigo-50'} text-base font-bold  rounded-full ${step > 2 ? 'text-white' : 'text-indigo-600'}  flex justify-center items-center mx-auto mb-1 lg:w-10 lg:h-10`}>
                    3
                  </span>
                  Team Members
                  <span className={`text-center ${step > 2? "text-indigo-600":"text-gray-500"} text-base font-normal leading-relaxed`}>
                  {step === 3 ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              </li>
            </ol>
          </div>

          {/* Signup Form */}
          <div className="w-full bg-white rounded-3xl shadow-[0px_15px_60px_-4px_rgba(16,24,40,0.08)] p-11">
            <form
              onSubmit={handleSubmit((data) => {
                console.log('Form submitted with data:', data);
                if (step === 3) {
                  console.log('Submitting final step');
                  handleFinalSubmit(data);
                } else {
                  console.log('Proceeding to next step');
                  handleNext(data);
                }
              })}
              className="space-y-12"
            >
              {step === 1 && (
                <UserDetails
                  register={register}
                  errors={errors}
                  userData={userData}
                  setUserData={setUserData}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  autocomplete={{
                    username: "username",
                    email: "email",
                    password: "new-password",
                  }}
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
                  <h2 className="text-base font-semibold text-gray-900">Select Role</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Please select whether you are a Founder or an Investor.
                  </p>
                  <div className="flex justify-start items-center gap-4">
                    <label
                      htmlFor="founder"
                      className={`block text-sm font-medium m-4 text-gray-900 border-2 rounded-xl py-8 px-12 w-fit ${watch('role') === 'founder' ? 'border-brand text-brand' : 'border-black'}`}
                    >
                      <div className="flex items-center gap-x-3">
                        <input
                          id="founder"
                          name="role"
                          type="radio"
                          value="founder"
                          {...register('role')}
                          className="h-4 w-4 border-gray-300 hidden text-indigo-600 focus:ring-indigo-600"
                        />
                        Founder
                      </div>
                    </label>
                    <label
                      htmlFor="investor"
                      className={`block text-sm font-medium text-gray-900 border-2 rounded-xl py-8 px-12 w-fit ${watch('role') === 'investor' ? 'border-brand text-brand' : 'border-black'}`}
                    >
                      <div className="flex items-center gap-x-3">
                        <input
                          id="investor"
                          name="role"
                          type="radio"
                          value="investor"
                          {...register('role')}
                          className="h-4 w-4 border-gray-300 hidden text-indigo-600 focus:ring-indigo-600"
                        />
                        Investor
                      </div>
                    </label>
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>
                  )}
                  <div className="mt-10">
                    {watch('role') === 'founder' && (
                      <FounderDetails register={register} errors={errors} setValue={setValue} watch={watch} />
                    )}
                    {watch('role') === 'investor' && (
                      <InvestorDetails register={register} errors={errors} setValue={setValue} watch={watch} />
                    )}
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              <div className="mt-6 flex items-center justify-end gap-x-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="text-sm font-semibold text-gray-900"
                  >
                    Previous
                  </button>
                )}
                {step < 3 && (
                  <button
                    type="submit"
                    className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Next
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
