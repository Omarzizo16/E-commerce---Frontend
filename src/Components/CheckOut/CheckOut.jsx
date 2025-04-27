import React, { useContext, useState } from 'react';
import Lottie from 'lottie-react';
import ecommerceOutlook from '../../assets/animations/ecommerceOutlook.json';
import word from '../../assets/animations/fast-shopping-delivery.json';
import { useFormik } from 'formik';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';

// handle error pleeeeeeeeeeeeeease 
export default function CheckOut() {
  const [loading, setLoading] = useState(false);
  let {cart} = useContext(CartContext);
  

  async function handleCheckOut(shippingAddress) {
    try {
      setLoading(true);
      let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart.cartId}?url=http://localhost:5173`
      ,{shippingAddress},
    {
      headers: {
        token: localStorage.getItem('userToken')
                }
    });

    console.log(data);
      location.href = data.session.url;

    toast.success(data.status,{
      position: 'top-center',
  });
    } catch (error) {
      console.log(data);
      toast.error(data.status , {
        position: 'top-center',
    }); 
      setLoading(false);
  }
}

  // Formik setup
  const formik = useFormik({
    initialValues: {
      city: '',
      details: '',
      phone: '',
    },
    onSubmit: handleCheckOut // Handle form submission
  });

  return <>
    <div className="min-h-screen flex -my-24">
      {/* Animation Section */}
      <div className="w-1/2 bg-black flex justify-center items-center overflow-hidden">
        <Lottie className="scale-150" animationData={ecommerceOutlook} />
      </div>

      {/* Form Section */}
      <div className="w-1/2 flex justify-center flex-col items-center">
        <Lottie className="w-1/2" animationData={word} />
        <p className="text-gray-500 text-sm pb-3">Shop Anything</p>
        <div className="flex flex-col gap-3 text-center max-w-lg w-full">
          <form onSubmit={formik.handleSubmit} className="space-y-2">


            <div className="relative">
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="city"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="city"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                City
              </label>
            </div>


            <div className="relative">
              <input
                type="text"
                name="details"
                value={formik.values.details}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="details"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="details"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Details
              </label>
            </div>


            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="phone"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="phone"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Phone
              </label>
            </div>




            {/* Submit Button */}
            {loading ? <button
              type="button"
              className="w-full bg-black hover:bg-red-700 transition-all duration-500 text-white font-medium rounded-lg text-sm py-2.5 px-4 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            >
              <i class="fa-solid fa-spinner fa-spin-pulse"></i>
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