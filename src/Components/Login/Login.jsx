import React, { useContext, useState } from 'react';
import Lottie from 'lottie-react';
import word from '../../assets/animations/fast-shopping-delivery.json';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';


export default function Login() {

  let navigate = useNavigate();
  const [apierror, setApierror] = useState(null);//why dont use it
  const [loading, setLoading] = useState(false);
  let {setUserToken} = useContext(UserContext);

  async function login(values) {
    try {
      setLoading(true);
      let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values);
      localStorage.setItem('userToken',data.token);
      setUserToken(data.token); 
      document.dispatchEvent(new Event('login'));
      toast.success(data.message, {
        position: 'top-center',
      });
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate('/home');
      }
      
    } catch (error) {
      setApierror(error.response.data.message);
      toast.error(error.response.data.message, {
        position: 'top-center',
      });
      setLoading(false);
    }
  }





  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: login // Handle form submission
  });

  return <>
    <div className="h-svh  flex justify-center -my-24">
      {/* Animation Section */}

      {/* Form Section */}
      <div className="w-1/2 flex justify-center flex-col items-center">
        <Lottie className="w-1/2" animationData={word} />
        <p className="text-gray-500 text-sm pb-3">Shop Anything</p>
        <div className="flex flex-col gap-3 text-center max-w-lg w-full">
          <form onSubmit={formik.handleSubmit} className="space-y-2">


            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="email"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Email
              </label>
            </div>
            {formik.touched.email && formik.errors.email && (
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


            {/* Password Field */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="password"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Password
              </label>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="flex items-center py-4 px-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium"> {formik.errors.password} </span>
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
        <div className='flex justify-between mt-5 gap-10'>
        <span>
        Don’t have an account ? <Link className='underline hover:text-red-600 hover:underline' to={'/register'}>Sign Up</Link>
          </span>
        <span>
        <Link className='underline hover:text-red-600 hover:underline' to={'/forgetPassword'}>Forget Password ? </Link>
          </span>
        </div>
      </div>
    </div>
  </>
}