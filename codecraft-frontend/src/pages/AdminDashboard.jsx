import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const getAllBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/blogs/admin/all-blogs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlogs(res.data.blogs || []);
    } catch (error) {
      console.log("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blogs/admin/delete-blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== id));
      alert("Blog deleted successfully");
    } catch (error) {
      alert("Delete failed");
    }
  };

  const deleteComment = async (blogId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blogs/admin/comment/${blogId}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getAllBlogs(); // Refresh list
      alert("Comment deleted");
    } catch (error) {
      alert("Failed to delete comment");
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-black mb-8 text-center">Admin Moderation Dashboard</h1>
      
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{blog.title}</h2>
                <button onClick={() => deleteBlog(blog._id)} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold">Delete Blog</button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-400">Comments:</h4>
                {blog.comments.length > 0 ? blog.comments.map(c => (
                  <div key={c._id} className="flex justify-between bg-white/5 p-3 rounded-lg text-sm">
                    <span>{c.text}</span>
                    <button onClick={() => deleteComment(blog._id, c._id)} className="text-red-400 hover:text-white">Delete</button>
                  </div>
                )) : <p className="text-xs text-gray-600">No comments</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;