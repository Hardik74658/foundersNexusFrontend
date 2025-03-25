import React, { useState } from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';

export const UserDetails = ({ register, errors, showPassword, setShowPassword }) => {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
      <p className="mt-1 text-sm/6 text-gray-600">
        This information will be displayed publicly so be careful what you share.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Username */}
        <div className="sm:col-span-4">
          <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
            Username
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">foundersnexus.com/</div>
              <input
                {...register('username')}
                type="text"
                id="username"
                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                placeholder="janesmith"
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
        </div>

        {/* First Name */}
        <div className="sm:col-span-3">
          <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
            First name
          </label>
          <div className="mt-2">
            <input
              {...register('firstName')}
              id="first-name"
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>
        </div>

        {/* Last Name */}
        <div className="sm:col-span-3">
          <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
            Last name
          </label>
          <div className="mt-2">
            <input
              {...register('lastName')}
              id="last-name"
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
            Email address
          </label>
          <div className="mt-2">
            <input
              {...register('email')}
              id="email"
              type="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Password */}
        <div className="sm:col-span-4">
          <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
            Password
          </label>
          <div className="mt-2 relative flex items-center">
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-sm text-gray-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Profile Picture */}
        <div className="col-span-full">
          <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
            Profile Picture
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <UserCircleIcon aria-hidden="true" className="size-12 text-gray-300" />
            <label
              htmlFor="profile-pic-upload"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 cursor-pointer"
            >
              Change
              <input
                {...register('profilePic')}
                id="profile-pic-upload"
                type="file"
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="col-span-full">
          <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
            Cover Photo
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
              <div className="mt-4 flex text-sm/6 text-gray-600">
                <label
                  htmlFor="cover-photo-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    {...register('coverImage')}
                    id="cover-photo-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};