import React from 'react';
import { CreditCard, AppleIcon, Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 shadow-inner">
      <div className="container mx-auto max-w-6xl">
        {/* Header with modern styling */}
        <div className="mb-8">
          <h4 className="text-xl font-bold mb-2 text-gray-800">Get The Fresh Cart App</h4>
          <p className="text-gray-600">
            We will send you a link, open it on your phone to download the app.
          </p>
        </div>

        {/* Email Input & Button with improved design */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow">
            <input
              type="email"
              placeholder="Enter Your Email Here"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 font-medium flex items-center justify-center">
            <span>Send App Link</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Quick Links, Contact, and Social Media Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-green-500 transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-green-500 transition-colors">Products</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-green-500 transition-colors">Categories</Link></li>
              <li><Link to="/brands" className="text-gray-600 hover:text-green-500 transition-colors">Brands</Link></li>
              <li><Link to="/wishlist" className="text-gray-600 hover:text-green-500 transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h5>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <Phone size={18} className="text-green-500" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail size={18} className="text-green-500" />
                <span>support@freshcart.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin size={18} className="text-green-500 mt-1" />
                <span>123 Shopping Street, New York, NY 10001</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-gray-800">Follow Us</h5>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-blue-500 text-white rounded-full hover:scale-125 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-sky-500 text-white rounded-full hover:scale-125 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-pink-500 text-white rounded-full hover:scale-125 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-blue-700 text-white rounded-full hover:scale-125 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
            <p className="mt-4 text-gray-600">
              Stay connected with us for the latest products, offers, and updates!
            </p>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent my-6"></div>

        {/* Payment Partners & App Stores with icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Partner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <p className="text-gray-700 font-medium">Payment Partners:</p>
            <div className="flex flex-wrap gap-3">
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100 flex items-center justify-center">
                <CreditCard size={24} className="text-blue-500" />
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M7 15h3v2H7z" fill="#fff" />
                  <path d="M16 15h1v2h-1z" fill="#fff" />
                  <path d="M13 15h2v2h-2z" fill="#fff" />
                </svg>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* App Stores */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <p className="text-gray-700 font-medium">Get Deliveries With Fresh Cart:</p>
            <div className="flex gap-3">
              <a href="#" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <AppleIcon size={20} />
                <div className="flex flex-col">
                  <span className="text-xs">Download on the</span>
                  <span className="text-sm font-medium">App Store</span>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-xs">GET IT ON</span>
                  <span className="text-sm font-medium">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright text */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>@ {new Date().getFullYear()} Fresh Cart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}