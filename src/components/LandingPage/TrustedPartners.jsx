import React from 'react';

export default function TrustedPartners() {
  // Updated logos array with designations
  const logos = [
    {
      alt: 'Peyush Bansal',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Peyush-Bansal.jpg',
      width: 158,
      height: 48,
      designation: 'CEO, Lenskart',
    },
    {
      alt: 'Aman Gupta',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Aman-Gupta.jpg',
      width: 158,
      height: 48,
      designation: 'Co-founder, boAt',
    },
    {
      alt: 'Deepinder Goyal',
      src: 'https://starsunfolded.com/wp-content/uploads/2023/08/Deepinder-Goyals-image.jpg',
      width: 158,
      height: 48,
      designation: 'CEO, Zomato',
    },
    {
      alt: 'Anupam Mittal',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Anupam-Mittal.jpg',
      width: 158,
      height: 48,
      designation: 'Founder, Shaadi.com',
    },
    {
      alt: 'Vineeta Singh',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Vineeta-Singhs-picture.jpg',
      width: 158,
      height: 48,
      designation: 'CEO, SUGAR Cosmetics',
    },
    {
      alt: 'Namita Thapar',
      src: 'https://starsunfolded.com/wp-content/uploads/2022/01/Namita-Thapar.jpg',
      width: 158,
      height: 48,
      designation: 'Executive Director, Emcure Pharmaceuticals',
    },
    {
      alt: 'Nikhil Kamath',
      src: 'https://starsunfolded.com/wp-content/uploads/2021/04/Nikhil-Kamath.jpg',
      width: 158,
      height: 48,
      designation: 'Co-founder, Zerodha',
    },
    {
      alt: 'Nithin Kamath',
      src: 'https://starsunfolded.com/wp-content/uploads/2021/05/Nithin-Kamaths-picture.jpg',
      width: 158,
      height: 48,
      designation: 'Co-founder, Zerodha',
    },
  ];

  // PartnerCard component for individual cards
  function PartnerCard({ src, alt, designation }) {
    return (
      <div className="relative w-[300px] h-[400px] rounded-lg shadow-md overflow-hidden">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white text-lg font-bold">{alt}</h3>
          <p className="text-gray-300 text-sm">{designation}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg/8 font-semibold text-gray-900">
          Trusted by the India's Biggest Investors
        </h2>

        {/* Carousel (Marquee) for medium and larger screens */}
        <div className="mt-10 relative overflow-hidden hidden md:block">
          <div className="flex animate-marquee whitespace-nowrap">
            {logos.concat(logos).map((logo, index) => (
              <div key={index} className="mx-4 w-[300px]">
                <PartnerCard src={logo.src} alt={logo.alt} designation={logo.designation} />
              </div>
            ))}
          </div>
        </div>

        {/* Static Grid for small screens */}
        <div className="mt-10 block md:hidden">
          <div className="flex flex-col justify-center items-center sm:grid sm:grid-cols-2 gap-4 lg:grid-cols-3">
            {logos.map((logo, index) => (
              <PartnerCard key={index} src={logo.src} alt={logo.alt} designation={logo.designation} />
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for marquee animation */}
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}
      </style>
    </div>
  );
}