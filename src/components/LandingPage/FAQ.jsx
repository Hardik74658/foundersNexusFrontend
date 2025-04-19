import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const faqs = [
    {
      question: 'How much money can I make with Communities?',
      answer: 'Theres no limit to how much you can earn with FoundersNexus. Top creators are making six and seven figures annually by monetizing their expertise and audiences through memberships, digital products, and events. Your income potential depends on your audience size, engagement, and the value of your offerings.'
    },
    {
      question: 'Do I need to have an existing community?',
      answer: 'No, you dont need an existing community to start. FoundersNexus provides tools to help you build your audience from scratch. You can start with just an idea and use our platform to create valuable content, engage potential members, and grow organically over time.'
    },
    {
      question: 'How much does it cost to use FoundersNexus?',
      answer: 'FoundersNexus offers flexible pricing plans starting with a free tier that allows you to test the platform. Premium plans start at $29/month with additional features. We only charge a small transaction fee on sales, so you keep most of what you earn, unlike other platforms that take up to 30% of your revenue.'
    },
    {
      question: 'Who owns the data?',
      answer: 'You maintain complete ownership of your content and community data. FoundersNexus believes creators should control their audience relationships. You can export your member list and content at any time, and we never sell your data to third parties.'
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="h-1 w-16 bg-yellow-400 mx-auto"></div>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-medium text-lg text-gray-900">{faq.question}</span>
                <ChevronDownIcon 
                  className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${activeIndex === index ? 'transform rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a 
            href="#" 
            className="inline-block px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Contact our support team
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
