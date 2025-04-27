import React from 'react'
import slide1 from '../../assets/images/slider-image-1.jpeg'
import slide2 from '../../assets/images/slider-image-2.jpeg'
import slide3 from '../../assets/images/slider-image-3.jpeg'
import Slider from 'react-slick'


export default function MainSlider() {
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  return <>
    <div className='container flex'>
    <div className=' w-full mx-auto'>
    <Slider {...settings}>
    <img src={slide1} className='h-[400px] w-full rounded-xl ' alt="" />
    <img src={slide2} className='h-[400px] w-full rounded-xl ' alt="" />
    <img src={slide3} className='h-[400px] w-full rounded-xl ' alt="" />
    </Slider>
    </div>
    </div>
  </>
}
