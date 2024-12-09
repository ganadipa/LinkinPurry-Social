import React from 'react';
import { Link } from '@tanstack/react-router';

const ProfileNotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-transparent flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="relative w-48 sm:w-56 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" className="w-full h-full">
            <circle cx="150" cy="150" r="130" fill="#f3f4f6"/>
            
            <rect x="75" y="70" width="150" height="180" rx="8" fill="white" stroke="#d1d5db" strokeWidth="2"/>
            
            <circle cx="150" cy="120" r="30" fill="#e5e7eb"/>
            <circle cx="150" cy="110" r="12" fill="#d1d5db"/>
            <path d="M120,145 Q150,180 180,145" fill="#d1d5db"/>
            
            <rect x="95" y="170" width="110" height="8" rx="4" fill="#e5e7eb"/>
            <rect x="115" y="190" width="70" height="8" rx="4" fill="#e5e7eb"/>
            
            <text x="150" y="250" 
                  fontSize="60" 
                  fontWeight="bold" 
                  fill="#6b7280" 
                  textAnchor="middle">?</text>
            
            <circle cx="210" cy="90" r="15" fill="none" stroke="#6b7280" strokeWidth="2"/>
            <line x1="221" y1="101" x2="230" y2="110" stroke="#6b7280" strokeWidth="2"/>
          </svg>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Profile not found
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            The profile you're looking for doesn't exist or may have been removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex px-6 py-2 bg-[#0a66c2] text-white rounded-full font-medium hover:bg-[#004182] transition-colors duration-200 justify-center"
          >
            Return to feed
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex px-6 py-2 border border-[#0a66c2] text-[#0a66c2] rounded-full font-medium hover:bg-blue-50 transition-colors duration-200 justify-center"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotFound;