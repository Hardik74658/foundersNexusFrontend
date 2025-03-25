import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

export const PersonalDetails = ({ register, errors }) => {
  return (
    <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
        <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
  
        <div className="sm:col-span-4">
            <label htmlFor="age" className="block text-sm/6 font-medium text-gray-900">
            Age
            </label>
            <div className="mt-2">
            <input
                {...register('age')}
                id="age"
                type="number"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
            </div>
        </div>

        <div className="sm:col-span-3">
            <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
            Country
            </label>
            <div className="mt-2 grid grid-cols-1">
            <select
                {...register('country')}
                id="country"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
            </select>
            <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
            </div>
        </div>

        <div className="sm:col-span-2 sm:col-start-1">
            <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
            City
            </label>
            <div className="mt-2">
            <input
                {...register('city')}
                id="city"
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>
        </div>

        <div className="sm:col-span-2">
            <label htmlFor="state" className="block text-sm/6 font-medium text-gray-900">
            State / Province
            </label>
            <div className="mt-2">
            <input
                {...register('state')}
                id="state"
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
            </div>
        </div>

        <div className="sm:col-span-2">
            <label htmlFor="postalCode" className="block text-sm/6 font-medium text-gray-900">
            ZIP / Postal code
            </label>
            <div className="mt-2">
            <input
                {...register('postalCode')}
                id="postalCode"
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
            </div>
        </div>

        <div className="sm:col-span-full">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-900">
                About
            </label>
            <div className="mt-2">
                <textarea
                    {...register('bio')} // Register the bio field
                    id="bio"
                    rows="3"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                ></textarea>
                {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                )} {/* Display validation error */}
            </div>
            <p className="mt-3 text-sm text-gray-600">
                Write a few sentences about yourself.
            </p>
        </div>
        </div>
  </div>
)
}
