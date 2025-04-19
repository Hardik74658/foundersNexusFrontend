import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  ChartPieIcon,
  LinkIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon, 
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

export const Features = () => {
  const mainFeatures = [
    {
      name: 'Manage memberships',
      description:
        'Create tiered membership levels with exclusive benefits and automated billing.',
      icon: UserGroupIcon,
      bgColor: 'from-orange-100 to-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      name: 'Run paid challenges',
      description:
        'Launch time-limited challenges that motivate your audience and generate revenue.',
      icon: RocketLaunchIcon,
      bgColor: 'from-blue-100 to-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      name: 'Host paid events',
      description:
        'Organize and sell tickets to virtual or in-person events with integrated calendars.',
      icon: ChartPieIcon,
      bgColor: 'from-purple-100 to-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      name: 'Sell exclusive content',
      description:
        'Create and monetize premium digital content including guides, videos, and templates.',
      icon: DocumentChartBarIcon,
      bgColor: 'from-pink-100 to-pink-50',
      iconColor: 'text-pink-500',
    },
    {
      name: 'Offer a private feed',
      description:
        'Share exclusive updates and interact with your community in a private environment.',
      icon: LinkIcon,
      bgColor: 'from-green-100 to-green-50',
      iconColor: 'text-green-500',
    },
  ];

  const toolFeatures = [
    {
      title: 'Mobile App',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    },
    {
      title: 'Chat integrations',
      icon: <ChatBubbleLeftRightIcon className="w-7 h-7" />
    },
    {
      title: 'Email marketing',
      icon: <EnvelopeIcon className="w-7 h-7" />
    },
    {
      title: 'Analytics',
      icon: <ChartBarIcon className="w-7 h-7" />
    },
    {
      title: 'Global payments',
      icon: <GlobeAltIcon className="w-7 h-7" />
    }
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
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* What can I use section */}
        <div className="text-center mb-20">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What can I use FoundersNexus for?
          </motion.h2>
          <motion.div 
            className="h-1 w-16 bg-yellow-400 mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          ></motion.div>
        </div>

        {/* Main features grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={variantContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={feature.name}
              variants={variantItem}
              className={`bg-gradient-to-br ${feature.bgColor} p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100`}
            >
              <div className={`${feature.iconColor} bg-white p-3 rounded-xl shadow-sm w-14 h-14 flex items-center justify-center mb-6`}>
                <feature.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Digital Business Margin Section */}
        <div className="mt-24 pt-16 border-t border-gray-100">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Digital businesses have a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                100% profit margin on FoundersNexus
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Physical product card */}
            <motion.div 
              className="bg-gray-100 p-8 rounded-2xl relative overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-gray-200 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <ShoppingBagIcon className="w-8 h-8 text-gray-500 mr-3" />
                  <h3 className="text-xl font-medium text-gray-700">Physical products</h3>
                </div>
                <div className="mt-6 flex items-end">
                  <span className="text-6xl font-bold text-gray-700">30</span>
                  <span className="text-3xl font-semibold text-gray-500 ml-1 mb-1">%</span>
                </div>
                <p className="mt-2 text-gray-600">Average profit margin</p>
              </div>
            </motion.div>

            {/* Digital product card */}
            <motion.div 
              className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl text-white relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-500 to-transparent opacity-40"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <DocumentChartBarIcon className="w-8 h-8 text-white mr-3" />
                  <h3 className="text-xl font-medium text-white">Digital products</h3>
                </div>
                <div className="mt-6 flex items-end">
                  <span className="text-6xl font-bold">100</span>
                  <span className="text-3xl font-semibold ml-1 mb-1">%</span>
                </div>
                <p className="mt-2 text-white text-opacity-90">Average profit margin</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* More tools section */}
        <div className="mt-24">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              More tools to scale your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                digital business
              </span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6"
            variants={variantContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {toolFeatures.map((tool, index) => (
              <motion.div
                key={tool.title}
                variants={variantItem}
                className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="text-blue-600 mb-3">
                  {tool.icon}
                </div>
                <h3 className="text-gray-900 font-medium">{tool.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

