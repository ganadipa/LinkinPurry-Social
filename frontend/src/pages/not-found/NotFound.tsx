import React from 'react';
import { Link } from '@tanstack/react-router';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-transparent flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="relative w-[300px] sm:w-[400px] mx-auto">
            <img src="/images/404-not-found.svg" alt="404" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            This page doesn't exist
          </h1>
          <p className="text-gray-600 text-base">
            Please check your URL or return to LinkInPurry home.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex px-6 py-2 bg-[#0a66c2] text-white rounded-full font-medium hover:bg-[#004182] transition-colors duration-200"
          >
            Go to your feed
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;