import { useState } from "react";
import axios from "axios";

const RatingWidget = ({ blog, setBlog, token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const submitRating = async (value) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blogs/${blog._id}/rating`,
        { value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data.blog);
      setRating(value);
      setTimeout(() => setIsOpen(false), 500);
    } catch (error) { console.error(error); }
  };

  if (!blog) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Rating Window */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[280px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 animate-fade-up">
            <h3 className="font-black text-sm mb-4 text-gray-400 uppercase tracking-widest text-center">Rate this blog</h3>
            <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => submitRating(star)}
                        className={`text-3xl transition-all ${star <= rating ? "text-yellow-400 scale-110" : "text-gray-600 hover:text-yellow-300"}`}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default RatingWidget;