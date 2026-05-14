import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: null
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setFormData({
      ...formData,
      image: file
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("content", formData.content);
      data.append("image", formData.image);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blogs`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Blog published successfully!");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Blog publish failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-14">
      <div className="max-w-4xl mx-auto bg-white/10 border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-black mb-2">
          Publish Your Blog
        </h1>

        <p className="text-gray-400 mb-8">
          Write your blog and upload an image for CodeCraft.
        </p>

        {error && (
          <p className="bg-red-500/10 border border-red-400/30 text-red-300 p-3 rounded-xl mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="title"
            placeholder="Blog title"
            value={formData.title}
            onChange={handleChange}
            className="bg-white/10 border border-white/10 focus:border-cyan-400 outline-none p-4 rounded-2xl text-white placeholder:text-gray-400"
          />

          <input
            type="text"
            name="category"
            placeholder="Category e.g. Web Development"
            value={formData.category}
            onChange={handleChange}
            className="bg-white/10 border border-white/10 focus:border-fuchsia-400 outline-none p-4 rounded-2xl text-white placeholder:text-gray-400"
          />

          <textarea
            name="content"
            placeholder="Write your blog content..."
            value={formData.content}
            onChange={handleChange}
            rows="8"
            className="bg-white/10 border border-white/10 focus:border-cyan-400 outline-none p-4 rounded-2xl text-white placeholder:text-gray-400 resize-none"
          ></textarea>

          <div>
            <label className="block text-gray-300 mb-2">
              Upload Blog Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-gray-300"
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-72 object-cover rounded-2xl border border-white/10"
            />
          )}

          <button
            disabled={loading}
            className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 text-white p-4 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;