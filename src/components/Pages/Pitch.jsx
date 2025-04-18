import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ArrowRightIcon,
  BoltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  ArrowsRightLeftIcon,
  TrashIcon,
  PresentationChartBarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export default function Pitch() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [activeId, setActiveId] = useState('tech-innovators'); // Default active pitch
  const fileInputRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Sample pitch decks data - Updated with the Canva link
  const [pitchDecks, setPitchDecks] = useState([
    {
      id: 'tech-innovators',
      title: 'Tech Innovators',
      description: 'A platform for next-gen AI solutions',
      raiseUntil: '31 Jul 2024',
      target: '$2,000,000',
      round: 'Seed Round',
      previewImage: 'https://i.imgur.com/JyXaErp.png', // Example image
      active: true,
      dateUploaded: '15 Mar 2024',
      slides: 16,
      externalLink: null
    },
    {
      id: 'green-energy',
      title: 'Green Energy Solutions',
      description: 'Sustainable energy for modern businesses',
      raiseUntil: '15 Sep 2024',
      target: '$1,500,000',
      round: 'Pre-Seed',
      previewImage: 'https://i.imgur.com/P8jEAZl.png', // Example image
      active: false,
      dateUploaded: '10 Apr 2024',
      slides: 22,
      externalLink: null
    },
    {
      id: 'sample-pitch',
      title: 'Sample Pitch Deck',
      description: 'Example of a well-structured pitch deck',
      raiseUntil: '31 Dec 2024',
      target: 'Example',
      round: 'Demo',
      previewImage: 'https://marketplace.canva.com/EAFLBMxBdK4/1/0/1600w/canva-blue-gradient-modern-business-pitch-deck-presentation-ou9ARW-LgFQ.jpg',
      active: false,
      dateUploaded: '18 Apr 2024',
      slides: 15,
      externalLink: 'https://www.canva.com/design/DAGXR4odW_Q/Oj6FAiDFBy93ZdLHY28LfA/view?utm_content=DAGXR4odW_Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha3d0f71668'
    }
  ]);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL for PDF or image files
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
      }
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || 
                         droppedFile.type === 'application/vnd.ms-powerpoint' ||
                         droppedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      setFile(droppedFile);
      
      if (droppedFile.type === 'application/pdf') {
        const objectUrl = URL.createObjectURL(droppedFile);
        setPreviewUrl(objectUrl);
      }
    }
  };

  // Handle upload button click
  const handleUpload = () => {
    if (file && title) {
      // Create a new pitch deck object
      const newPitchDeck = {
        id: `pitch-${Date.now()}`,
        title: title,
        description: description || 'No description provided',
        raiseUntil: '31 Dec 2024',
        target: 'TBD',
        round: 'Pre-Seed',
        previewImage: previewUrl || 'https://i.imgur.com/default.png',
        active: false,
        dateUploaded: new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        slides: Math.floor(Math.random() * 20) + 10 // Random slide count for demo
      };
      
      // Add the new pitch deck to the list
      setPitchDecks([newPitchDeck, ...pitchDecks]);
      
      // Reset form values
      setFile(null);
      setTitle('');
      setDescription('');
      setPreviewUrl('');
      
      // Show success notification (you can implement this)
      console.log('Uploading:', { title, description, file });
    }
  };

  // Toggle active state of a pitch deck
  const toggleActive = (id) => {
    setPitchDecks(
      pitchDecks.map(deck => ({
        ...deck,
        active: deck.id === id
      }))
    );
    setActiveId(id);
  };

  // Clean up any created object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">Founders Nexus</h1>
        </div>
        
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#" className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </a>
          <a href="#" className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
          </a>
          <a href="#" className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Startups
          </a>
          <a href="#" className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Pitch Decks
          </a>
        </nav>

        <div className="md:hidden">
          <button className="text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-8 max-w-7xl mx-auto">
        {/* Title and intro */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Pitch Decks</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload and manage your startup pitch decks. Set one as active to make it visible to investors and partners.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-4xl mb-16"
        >
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div>
                <div
                  className={`
                    relative flex flex-col items-center justify-center 
                    border-2 border-dashed rounded-2xl p-8 cursor-pointer 
                    transition-all duration-300 
                    ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <motion.div 
                    animate={{ 
                      y: [0, -5, 0],
                      scale: isHovering ? 1.05 : 1
                    }}
                    transition={{ 
                      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 0.3 }
                    }}
                    className="mb-4"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-700 mb-2">Drag and drop your pitch deck here</h3>
                  <p className="text-gray-500 text-center mb-4">or click to browse your files</p>
                  
                  <div className="text-xs text-gray-400 flex flex-wrap justify-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">PDF</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">PowerPoint</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">Max 50MB</span>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    id="upload"
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  {file && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-2xl p-4">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-800 mb-1">File selected!</h4>
                      <p className="text-sm text-gray-500 mb-4 text-center">{file.name}</p>
                      <button 
                        className="text-xs text-red-500 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setPreviewUrl('');
                        }}
                      >
                        Remove file
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Give your pitch deck a title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      id="description"
                      placeholder="Briefly describe your pitch deck"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Preview Area */}
              <div className="flex flex-col items-center justify-center">
                {previewUrl ? (
                  <>
                    <div className="w-full h-64 rounded-2xl border-2 border-gray-200 overflow-hidden mb-4">
                      {previewUrl.includes('pdf') ? (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-600 font-medium">PDF Preview</span>
                            <p className="text-xs text-gray-500 mt-1">Preview not available. File selected.</p>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={previewUrl} 
                          alt="Upload preview" 
                          className="w-full h-full object-contain" 
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">First slide will be used as preview</p>
                  </>
                ) : (
                  <div className="w-full h-64 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-500">Preview will appear here</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || !title}
                  className={`
                    w-full rounded-xl px-6 py-4 text-white shadow-lg
                    flex items-center justify-center gap-2
                    transform transition-all duration-300
                    ${file && title 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 hover:shadow-xl' 
                      : 'bg-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Pitch Deck
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pitch Decks Gallery */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Your Pitch Decks</h3>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full"> {/* Improved contrast */}
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div> {/* Improved contrast */}
                <span>Active deck is public</span>
              </div>
            </div>
          </div>

          {/* Pitch Decks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pitchDecks.map((deck) => (
              <motion.div 
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`
                  relative rounded-3xl overflow-hidden shadow-lg 
                  transition-all duration-300 hover:shadow-xl
                  ${deck.active ? 'ring-4 ring-green-400 ring-opacity-50' : ''}
                `}
              >
                {/* Preview Image */}
                <div className="h-56 bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden">
                  {deck.previewImage ? (
                    <img 
                      src={deck.previewImage} 
                      alt={`${deck.title} preview`}
                      className="w-full h-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PresentationChartBarIcon className="h-20 w-20 text-gray-500" />
                    </div>
                  )}

                  {/* Overlay gradient - Made darker for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

                  {/* Slides count badge */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs flex items-center">
                    <DocumentTextIcon className="h-3 w-3 mr-1" />
                    {deck.slides} slides
                  </div>

                  {/* Active indicator */}
                  {deck.active && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center animate-pulse"> {/* Improved contrast */}
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Active
                    </div>
                  )}

                  {/* External link indicator */}
                  {deck.externalLink && (
                    <div className="absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs flex items-center">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      External Sample
                    </div>
                  )}

                  {/* Date */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Uploaded: {deck.dateUploaded}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{deck.title}</h4>
                      <p className="text-sm text-gray-600">{deck.description}</p>
                    </div>
                  </div>

                  {/* Details - improved color contrast */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600 mb-1 flex items-center font-medium"> {/* Improved contrast */}
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Raise Until
                      </span>
                      <span className="text-sm font-medium">{deck.raiseUntil}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600 mb-1 flex items-center font-medium"> {/* Improved contrast */}
                        <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                        Target
                      </span>
                      <span className="text-sm font-medium">{deck.target}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600 mb-1 flex items-center font-medium"> {/* Improved contrast */}
                        <ChartPieIcon className="h-3 w-3 mr-1" />
                        Round
                      </span>
                      <span className="text-sm font-medium">{deck.round}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {deck.externalLink ? (
                      <a 
                        href={deck.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View Sample
                      </a>
                    ) : (
                      <button className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                        View
                      </button>
                    )}
                    <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Download
                    </button>
                    {!deck.externalLink && (
                      <button 
                        onClick={() => toggleActive(deck.id)}
                        className={`
                          flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors
                          ${deck.active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' /* Improved contrast */
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        <ArrowsRightLeftIcon className="h-4 w-4" />
                        {deck.active ? 'Active' : 'Activate'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add New Pitch Deck - Empty State */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-10 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-center text-gray-600 font-medium">Upload another pitch deck</p>
              <p className="text-center text-gray-400 text-sm mt-2">Drag & drop or click to upload</p>
            </motion.div>
          </div>
        </section>

        {/* Tips Section - Enhanced Design */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 rounded-3xl overflow-hidden shadow-xl"> 
            <div className="p-8 md:p-12 relative">
              {/* Abstract shapes for visual interest */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 rounded-full opacity-10 -ml-20 -mb-20"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="md:col-span-2">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-300 bg-opacity-20 backdrop-filter backdrop-blur-md text-blue-100 text-xs font-medium tracking-wider uppercase mb-4">Expert Guidance</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">Create a Winning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Pitch Deck</span></h3>
                  <p className="text-blue-100 mb-8 opacity-90 leading-relaxed">Great pitch decks tell a compelling story about your startup and capture investor interest in seconds. Follow these proven strategies to make yours stand out.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-10 hover:bg-opacity-15 transition-all duration-300 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mr-3 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-white text-lg">Problem & Solution</h4>
                      </div>
                      <p className="text-blue-800 leading-relaxed text-sm">Clearly articulate the problem your target audience faces and how your unique solution addresses it better than alternatives.</p>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-10 hover:bg-opacity-15 transition-all duration-300 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mr-3 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-white text-lg">Market & Traction</h4>
                      </div>
                      <p className="text-blue-800 leading-relaxed text-sm">Quantify your addressable market with credible data and showcase the momentum you've already gained with customers.</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-10 hover:bg-opacity-15 transition-all duration-300 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-white text-lg">Team Strength</h4>
                      </div>
                      <p className="text-blue-800 leading-relaxed text-sm">Emphasize your team's unique qualifications and why this specific group is positioned to execute your vision successfully.</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-10 hover:bg-opacity-15 transition-all duration-300 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-white text-lg">Smart Financials</h4>
                      </div>
                      <p className="text-blue-800 leading-relaxed text-sm">Present realistic financial projections with clear milestones for how you'll allocate capital to achieve growth targets.</p>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="relative h-full flex items-center justify-center">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 bg-opacity-20 rounded-full blur-2xl"></div>
                    <div className="relative z-10 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-xl shadow-2xl bg-gradient-to-tr from-indigo-300 to-purple-300 opacity-20 blur-sm transform rotate-3"></div>
                        <img 
                          src="https://marketplace.canva.com/EAFLBMxBdK4/1/0/1600w/canva-blue-gradient-modern-business-pitch-deck-presentation-ou9ARW-LgFQ.jpg" 
                          alt="Pitch deck example" 
                          className="relative z-20 max-h-52 object-cover rounded-xl shadow-xl transform transition-transform duration-500 hover:scale-105" 
                        />
                      </div>
                      <a 
                        href="https://www.canva.com/design/DAGXR4odW_Q/Oj6FAiDFBy93ZdLHY28LfA/view?utm_content=DAGXR4odW_Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha3d0f71668"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 bg-white bg-opacity-95 text-indigo-800 px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View Example Template
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Added section to highlight the sample deck */}
        <section className="mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <img 
                  src="https://marketplace.canva.com/EAFLBMxBdK4/1/0/1600w/canva-blue-gradient-modern-business-pitch-deck-presentation-ou9ARW-LgFQ.jpg" 
                  alt="Sample pitch deck" 
                  className="w-full h-auto rounded-xl shadow-md"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Need inspiration?</h3>
                <p className="text-gray-600 mb-6">
                  Check out our sample pitch deck template to get inspired. This professionally designed template follows best practices for presenting your startup to investors.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://www.canva.com/design/DAGXR4odW_Q/Oj6FAiDFBy93ZdLHY28LfA/view?utm_content=DAGXR4odW_Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha3d0f71668"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md"
                  >
                    <EyeIcon className="h-5 w-5" />
                    View Sample Pitch Deck
                  </a>
                  <button
                    className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <CloudArrowUpIcon className="h-5 w-5" />
                    Create Your Own
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© 2024 Founders Nexus. All rights reserved.</p>
      </footer>
    </div>
  );
}
