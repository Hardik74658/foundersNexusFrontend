import React from 'react'
import { Hero } from './LandingPage/Hero'
import { Features } from './LandingPage/Features'
import Team from './LandingPage/Team'
import TrustedPartners from './LandingPage/TrustedPartners'
import Header from './layout/Header'
import Footer from './layout/Footer'

const LandingPage = () => {
  return (
    <>
        <Header/>
        <Hero/>
        <Features/>
        <TrustedPartners/>
        <Footer/>
        {/* <Team/> */}
        
    </>
  )
}

export default LandingPage;
