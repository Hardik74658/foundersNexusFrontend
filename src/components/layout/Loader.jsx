import React from 'react';

const Loader = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="grid gap-3">
                <div className="flex items-center justify-center">
                    <svg className="animate-spin border-indigo-300"
                        xmlns="http://www.w3.org/2000/svg" width="56" height="56"
                        viewBox="0 0 56 56" fill="none">
                        <circle cx="28" cy="28" r="26" stroke="#4F46E5"
                            strokeWidth="4" strokeDasharray="12 12" />
                    </svg>
                </div>
                <span className="text-black text-sm font-normal leading-snug">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
