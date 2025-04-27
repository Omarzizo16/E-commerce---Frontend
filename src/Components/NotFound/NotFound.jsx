import React from 'react';
import word from '../../assets/animations/notFoundPage.json';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center">
        {/* Left content */}
        <div className="w-full md:w-1/3 text-left md:pr-8">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">Oops!</h1>
          <p className="text-gray-900 text-lg mb-5">
            We can't seem to find the page you're looking for.
          </p>
        
          <Link 
            to="/home" 
            className="inline-flex items-center px-6 py-3 rounded-lg bg-green-400 text-white font-medium transition-all duration-300 hover:scale-125 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        {/* Right content - Animation */}
        <div className="w-full md:w-2/3 mt-8 md:mt-0">
          <Lottie animationData={word} className="w-full" />
        </div>
      </div>
    </div>
  );
}