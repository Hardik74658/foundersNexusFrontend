import React, { useState } from 'react';

export default function FounderDetails({ register, errors, setValue, watch }) {
  const education = watch('education') || [];
  const skills = watch('skills') || [];
  const workExperience = watch('workExperience') || [];
  const certifications = watch('certifications') || [];
  const portfolioLinks = watch('portfolioLinks') || [];

  const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newWorkExperience, setNewWorkExperience] = useState({ company: '', role: '', duration: '', description: '' });
  const [newCertification, setNewCertification] = useState('');
  const [newPortfolioLink, setNewPortfolioLink] = useState('');

  const handleAddEducation = () => {
    const updatedEducation = [...education, newEducation];
    setValue('education', updatedEducation); // Update form state
    setNewEducation({ degree: '', institution: '', year: '' });
  };

  const handleAddSkill = () => {
    const updatedSkills = [...skills, newSkill];
    setValue('skills', updatedSkills); // Update form state
    setNewSkill('');
  };

  const handleAddWorkExperience = () => {
    const updatedWorkExperience = [...workExperience, newWorkExperience];
    setValue('workExperience', updatedWorkExperience); // Update form state
    setNewWorkExperience({ company: '', role: '', duration: '', description: '' });
  };

  const handleAddCertification = () => {
    const updatedCertifications = [...certifications, newCertification];
    setValue('certifications', updatedCertifications); // Update form state
    setNewCertification('');
  };

  const handleAddPortfolioLink = () => {
    const updatedPortfolioLinks = [...portfolioLinks, newPortfolioLink];
    setValue('portfolioLinks', updatedPortfolioLinks); // Update form state
    setNewPortfolioLink('');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Founder Details</h3>

      {/* Education Background */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900">Education Background</h4>
        {education.map((edu, index) => (
          <div key={index} className="mt-2 text-sm text-gray-700">
            {edu.degree} at {edu.institution} ({edu.year})
          </div>
        ))}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Degree/Course"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <input
            type="text"
            placeholder="Institution"
            value={newEducation.institution}
            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <input
            type="text"
            placeholder="Year"
            value={newEducation.year}
            onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Add Education
        </button>
      </div>

      {/* Skills */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900">Skills</h4>
        {skills.map((skill, index) => (
          <div key={index} className="mt-2 text-sm text-gray-700">
            {skill}
          </div>
        ))}
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Add Skill
          </button>
        </div>
      </div>

      {/* Work Experience */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900">Work Experience</h4>
        {workExperience.map((work, index) => (
          <div key={index} className="mt-2 text-sm text-gray-700">
            {work.role} at {work.company} ({work.duration}) - {work.description}
          </div>
        ))}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <input
            type="text"
            placeholder="Company Name"
            value={newWorkExperience.company}
            onChange={(e) => setNewWorkExperience({ ...newWorkExperience, company: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <input
            type="text"
            placeholder="Role"
            value={newWorkExperience.role}
            onChange={(e) => setNewWorkExperience({ ...newWorkExperience, role: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <input
            type="text"
            placeholder="Duration"
            value={newWorkExperience.duration}
            onChange={(e) => setNewWorkExperience({ ...newWorkExperience, duration: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <input
            type="text"
            placeholder="Description"
            value={newWorkExperience.description}
            onChange={(e) => setNewWorkExperience({ ...newWorkExperience, description: e.target.value })}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
        </div>
        <button
          type="button"
          onClick={handleAddWorkExperience}
          className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Add Work Experience
        </button>
      </div>

      {/* Certifications */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900">Certifications</h4>
        {certifications.map((cert, index) => (
          <div key={index} className="mt-2 text-sm text-gray-700">
            {cert}
          </div>
        ))}
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="Certification"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <button
            type="button"
            onClick={handleAddCertification}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Add Certification
          </button>
        </div>
      </div>

      {/* Portfolio Links */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900">Portfolio Links</h4>
        {portfolioLinks.map((link, index) => (
          <div key={index} className="mt-2 text-sm text-gray-700">
            {link}
          </div>
        ))}
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="Portfolio Link"
            value={newPortfolioLink}
            onChange={(e) => setNewPortfolioLink(e.target.value)}
            className="rounded-md border-gray-300 px-3 py-1.5"
          />
          <button
            type="button"
            onClick={handleAddPortfolioLink}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Add Portfolio Link
          </button>
        </div>
      </div>
    </div>
  );
}
