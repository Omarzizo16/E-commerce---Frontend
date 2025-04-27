import React, { useState } from 'react'
import word from '../../assets/animations/Animation - loading.json';
import Lottie from 'lottie-react';

export default function Loading() {

  const override= {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  return <>
     <div className="sweet-loading py-10">
     <Lottie className="w-1/2 mx-auto" animationData={word}/>
    </div>
  </>
}
