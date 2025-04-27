import React, { useRef, useState } from "react";
import axios from "axios";

const CreatePostModal = ({ isOpen, onClose, userId, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("https://images.unsplash.com/photo-1635627408444-3ba7fed5e9e6?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"); // Default image URL
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("imageFile", imageFile); // Match backend parameter name

      // Debugging: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await axios.post("https://foundersnexus.onrender.com/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        onPostCreated && onPostCreated();
        handleClose();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleClose = () => {
    onClose();
    setTitle("");
    setContent("");
    setImageFile(null);
    setImagePreview("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-lg">
        <div className="">
          {/* Image preview */}
          <div
            className="relative cursor-pointer mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-60 object-cover rounded-t-xl border border-gray-300"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
              <span className="text-white text-sm font-medium">Upload Image</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Title */}
          <div className="mb-4 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a catchy title..."
            />
          </div>

          {/* Content */}
          <div className="mb-4 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-indigo-500"
              value={content}
              rows={5}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
            ></textarea>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-5">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              onClick={handlePost}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
