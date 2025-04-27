import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';

export default function CategorySlider() {

  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 6,
    swipeToSlide: true,
    infinite: true,
    draggable: true,
    pauseOnHover: true,
  };

  const [categories, setCategories] = useState([]);
  async function getCategories() {
    let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories`);
    setCategories(data.data);
  }

  useEffect(() => {
    getCategories();
  }, []);



  return <>
    <Slider {...settings}>
      {categories.map((category, index) => <div className='my-3' key={index}>
        <img src={category.image} alt={category.name} className='w-full h-[200px] object-fill' />
      </div>)}
    </Slider>
  </>
}
