import React from 'react';
import { motion } from 'framer-motion';
import heroSVG from '../../assets/heroSVG.svg';

export const Hero = () => {
  // Floating icon animations
  const floatingAnimation = {
    y: {
      yoyo: Infinity,
      duration: 2.5,
      ease: "easeInOut",
      repeatDelay: 0.5,
    }
  };
  
  const iconVariants = [
    { initial: { y: 0 }, animate: { y: -15 } },
    { initial: { y: 0 }, animate: { y: -10 } },
    { initial: { y: 0 }, animate: { y: -20 } },
    { initial: { y: 0 }, animate: { y: -12 } }
  ];

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Decorative elements - floating icons */}
      <motion.div 
        className="absolute top-20 left-[10%] w-16 h-16"
        initial={iconVariants[0].initial}
        animate={iconVariants[0].animate}
        transition={{ ...floatingAnimation.y, delay: 0 }}
      >
        <svg className="w-full h-full text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-40 left-[30%] w-14 h-14"
        initial={iconVariants[1].initial}
        animate={iconVariants[1].animate}
        transition={{ ...floatingAnimation.y, delay: 0.5 }}
      >
        <svg className="w-full h-full text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-24 right-[25%] w-16 h-16"
        initial={iconVariants[2].initial}
        animate={iconVariants[2].animate}
        transition={{ ...floatingAnimation.y, delay: 1 }}
      >
        <svg className="w-full h-full text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-16 right-[15%] w-12 h-12"
        initial={iconVariants[3].initial}
        animate={iconVariants[3].animate}
        transition={{ ...floatingAnimation.y, delay: 1.5 }}
      >
        <svg className="w-full h-full text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 2 00-2-2V7a2 2 2 00-2-2H5a2 2 2 00-2 2v12a2 2 2 00-2 2z"></path>
        </svg>
      </motion.div>

      {/* Background colorful blobs */}
      <div className="absolute top-[5%] right-[15%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[10%] right-[30%] w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text content */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left lg:pr-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Build an Internet Business
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 mt-1">
                in 1 Minute.
              </span>
            </h1>
            <p className="mt-6 sm:mt-8 text-xl sm:text-2xl text-gray-600 max-w-2xl lg:max-w-none">
              All the tools you need to make money online in one place
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <motion.a 
                href="#" 
                className="px-8 py-3 rounded-full bg-yellow-400 text-lg font-medium text-gray-900 shadow-lg hover:shadow-xl hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get started
              </motion.a>
              <motion.a 
                href="#" 
                className="px-8 py-3 rounded-full bg-white text-lg font-medium text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                See how it works
              </motion.a>
            </div>
          </motion.div>

          {/* Hero image/illustration */}
          <motion.div 
            className="lg:w-1/2 mt-12 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main illustration */}
              <img 
                src={heroSVG} 
                alt="Build your startup" 
                className="w-full h-auto max-w-lg mx-auto rounded-xl "
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500 bg-opacity-20 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave separator for next section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
          <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>

      {/* Add animations to stylesheet */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
