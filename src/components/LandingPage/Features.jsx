import React from 'react'
import { 
    UserGroupIcon, 
    RocketLaunchIcon, 
    MagnifyingGlassIcon, 
    ChartPieIcon, 
    LinkIcon,
    DocumentChartBarIcon
  } from '@heroicons/react/24/outline'
  
  const features = [
    {
      name: 'Empowered Profile Management',
      description:
        'Easily create, update, and manage your profile and startup details with an intuitive interface designed for both entrepreneurs and investors.',
      icon: UserGroupIcon,
    },
    {
      name: 'Innovative Startup Creation',
      description:
        'Launch your startup with comprehensive pitch details, dynamic funding rounds, and interactive equity visualization to bring your ideas to life.',
      icon: RocketLaunchIcon,
    },
    {
      name: 'Investment Matching & Discovery',
      description:
        'Discover high-potential startups and receive personalized investment recommendations through advanced search and matching algorithms.',
      icon: MagnifyingGlassIcon,
    },
    {
      name: 'Dynamic Equity Visualization',
      description:
        'Visualize your startup’s equity distribution and funding history with interactive pie charts that simplify complex financial data.',
      icon: ChartPieIcon,
    },
    {
      name: 'Connect with Investors',
      description:
        'Directly engage with top-tier investors, expand your network, and unlock funding opportunities to drive your startup forward.',
      icon: LinkIcon,
    },
    {
      name: 'Robust Analytics & Insights',
      description:
        'Access data-driven dashboards and real-time reporting to monitor engagement, pitch performance, and funding trends.',
      icon: DocumentChartBarIcon,
    },
  ]
  
  

export const Features = () => {
    return (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base/7 font-semibold text-brand">Achieve Your Dream</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
                Everything you need to start your first business
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum
                pulvinar et feugiat blandit at. In mi viverra elit nunc.
              </p>
            </div>
         
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base/7 font-semibold text-gray-900">
                      <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-brand">
                        <feature.icon aria-hidden="true" className="size-6 text-white" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base/7 text-gray-600">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )
    }

