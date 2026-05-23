import { useState } from "react";
import axios from "axios";

const ChatWidget = ({ blog, setBlog, token, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");

  const submitComment = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs/${blog._id}/comments`, { text: comment }, { headers: { Authorization: `Bearer ${token}` } });
      setBlog(res.data.blog);
      setComment("");
    } catch (error) { console.error(error); }
  };

  if (!blog) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408s4.263.138 6.337.408c1.74.223 2.913 1.809 2.913 3.571v8.572c0 1.762-1.174 3.348-2.913 3.571-2.075.27-4.19.408-6.337.408s-4.263-.138-6.337-.408C3.174 18.349 2 16.763 2 15V6.229c0-1.762 1.174-3.348 2.913-3.571zM8.25 10.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[550px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-up">
            <div className="bg-slate-900 p-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 flex items-center justify-center font-bold">C</div>
                <div>
                    <h3 className="font-bold text-sm">Community Chat</h3>
                    <p className="text-[10px] text-green-400">● Online</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {blog.comments.map(c => (
                    <div key={c._id} className="text-sm bg-white/5 p-3 rounded-2xl rounded-tl-none">
                        <p className="font-bold text-cyan-400 text-xs">{c.user?.name}</p>
                        <p className="text-white">{c.text}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={submitComment} className="p-4 bg-slate-800 flex gap-2">
                <input value={comment} onChange={(e) => setComment(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" placeholder="Type a message..." />
                <button className="text-fuchsia-400 font-bold text-sm">Send</button>
            </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;