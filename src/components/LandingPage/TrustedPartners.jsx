import React from 'react';
import { motion } from 'framer-motion';

export default function TrustedPartners() {
  // Updated partners array with designations, members count and gradient colors
  const partners = [
    {
      name: 'Peyush Bansal',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Peyush-Bansal.jpg',
      designation: 'Fitness Coach',
      members: 385,
      category: 'Fitness',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Aman Gupta',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Aman-Gupta.jpg',
      designation: 'Financial Advisor',
      members: 1425,
      category: 'Finance',
      gradient: 'from-orange-500 to-orange-700'
    },
    {
      name: 'Deepinder Goyal',
      src: 'https://starsunfolded.com/wp-content/uploads/2023/08/Deepinder-Goyals-image.jpg',
      designation: 'Yoga Instructor',
      members: 5880,
      category: 'Wellness',
      gradient: 'from-pink-500 to-pink-700'
    },
    {
      name: 'Anupam Mittal',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Anupam-Mittal.jpg',
      designation: 'Photography Expert',
      members: 2067,
      category: 'Photography',
      gradient: 'from-yellow-500 to-yellow-700'
    },
    {
      name: 'Vineeta Singh',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Vineeta-Singhs-picture.jpg',
      designation: 'Cooking Classes',
      members: 1569,
      category: 'Cooking',
      gradient: 'from-blue-500 to-blue-700'
    },
  ];

  const variantContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const variantItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Live from what you love.
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From fitness gurus to photographers, thousands are making a living with FoundersNexus
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href="#"
              className="mt-8 inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
            >
              Start your business today
            </a>
          </motion.div>
        </div>

        {/* Partner cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={variantContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              variants={variantItem}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${partner.gradient} p-6 rounded-2xl text-white relative overflow-hidden shadow-lg transition-all duration-300 h-64 flex flex-col justify-between`}
            >
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white opacity-10"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-white opacity-10"></div>
              
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-white bg-opacity-20 text-sm font-medium tracking-wide mb-2">
                  {partner.category}
                </div>
                <p className="text-3xl font-bold">{partner.members.toLocaleString()}+</p>
                <p className="text-sm uppercase tracking-wide opacity-80">Members</p>
              </div>
              
              <div className="flex items-center mt-4">
                <img
                  src={partner.src}
                  alt={partner.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
                <div className="ml-3">
                  <p className="font-medium">{partner.name}</p>
                  <p className="text-sm opacity-80">{partner.designation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile view carousel - for small screens */}
        <div className="mt-12 md:hidden overflow-hidden">
          <div className="flex animate-marquee space-x-4 pb-4">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`mobile-${index}`}
                className={`flex-shrink-0 w-64 bg-gradient-to-br ${partner.gradient} p-6 rounded-2xl text-white relative overflow-hidden`}
              >
                <p className="text-2xl font-bold">{partner.members}+</p>
                <p className="text-sm uppercase tracking-wide opacity-80">Members</p>
                <p className="mt-4 font-medium">{partner.name}</p>
                <p className="text-sm opacity-80">{partner.designation}</p>
                <img
                  src={partner.src}
                  alt={partner.name}
                  className="absolute bottom-2 right-2 w-16 h-16 rounded-full object-cover border-2 border-white border-opacity-30"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}