import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import RatingWidget from "../components/RatingWidget";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const getBlog = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`);
      setBlog(res.data.blog);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch blog");
    }
  };

  useEffect(() => {
    getBlog();
  }, [id]);

  if (!blog) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-14">
      <div className="max-w-6xl mx-auto">
        <img src={blog.image} className="w-full h-96 object-cover rounded-3xl" alt={blog.title} />
        
        <div className="grid lg:grid-cols-3 gap-12 mt-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
                <h1 className="text-5xl font-black">{blog.title}</h1>
                <div className="prose prose-invert max-w-none mt-6 leading-8" dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
        </div>
        
        {/* Floating Widgets */}
        <ChatWidget blog={blog} setBlog={setBlog} token={token} user={user} />
        <RatingWidget blog={blog} setBlog={setBlog} token={token} />
      </div>
    </div>
  );
}

export default BlogDetails;