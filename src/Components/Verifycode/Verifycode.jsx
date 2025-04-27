import React, {useState } from 'react';
import Lottie from 'lottie-react';
import word from '../../assets/animations/fast-shopping-delivery.json';
import { useFormik } from 'formik';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export default function Verifycode() {

  let navigate = useNavigate();
  const [apierror, setApierror] = useState(null);//why dont use it
  const [loading, setLoading] = useState(false);

  async function verifyCode(values) {
    try {
      setLoading(true);
      let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`, values);
      if (data.status === "Success") {
        navigate('/resetPassword');
      }
      toast.success(data.message, {
        position: 'top-center',
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
      });
      setLoading(false);
    }
  }

  // Formik setup
  const formik = useFormik({
    initialValues: {
      resetCode: '',
    },
    onSubmit: verifyCode // Handle form submission
  });

  return <>
    <div className="h-svh flex justify-center -my-24">
      {/* Form Section */}
      <div className="w-1/2 flex justify-center flex-col items-center">
        <Lottie className="w-1/2" animationData={word} />
        <p className="text-gray-500 text-sm pb-3">Shop Anything</p>
        <div className="flex flex-col gap-3 text-center max-w-lg w-full">
          <form onSubmit={formik.handleSubmit} className="space-y-2">


            {/* Email Field */}
            <div className="relative">
              <input
                type="text"
                name="resetCode"
                value={formik.values.resetCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="resetCode"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="resetCode"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Your Code
              </label>
            </div>
            {formik.touched.resetCode && formik.errors.resetCode && (
              <div className="flex items-center py-4 px-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium"> {formik.errors.email} </span>
                </div>
              </div>
            )}



            {/* Submit Button */}
            {loading ? <button
              type="button"
              className="w-full bg-black hover:bg-red-700 transition-all duration-500 text-white font-medium rounded-lg text-sm py-2.5 px-4 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            >
              <i className="fa-solid fa-spinner fa-spin-pulse"></i>
            </button> :
              <button
                type="submit"
                className="w-full bg-black hover:bg-red-700 transition-all duration-500 text-white font-medium rounded-lg text-sm py-2.5 px-4 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              >
                Submit
              </button>}
          </form>
        </div>
      </div>
    </div>
  </>
}