import React, { useEffect, useState } from 'react';
import { BookOpen, Clock3, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { engagementAPI } from '../services/api';

const ReadingHistory = () => {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const res = await engagementAPI.getHistory();
      setItems(res.data?.history || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load reading history.');
    }
  };

  useEffect(() => { load(); }, []);

  const clear = async () => {
    if (!window.confirm('Clear your reading history?')) return;
    try {
      await engagementAPI.clearHistory();
      setItems([]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to clear history.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
            <Clock3 className="w-3.5 h-3.5" /> Reading Activity
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-3">Reading History</h1>
          <p className="text-sm text-stone-500 mt-1">Pick up where you left off.</p>
        </div>
        {items.length > 0 && <button onClick={clear} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-rose-700 text-sm font-semibold hover:bg-rose-50"><Trash2 className="w-4 h-4" /> Clear history</button>}
      </div>

      {message && <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-sm">{message}</div>}
      {items.length === 0 ? (
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-10 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-stone-300" />
          <h2 className="font-serif text-xl font-bold mt-4">Your history is empty</h2>
          <p className="text-sm text-stone-500 mt-2">Articles you open will appear here.</p>
          <Link to="/browse" className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-[#1A382B] text-white rounded-xl text-sm font-semibold">Start reading <ArrowRight className="w-4 h-4" /></Link>
        </div>
      ) : (
        <div className="bg-white border border-[#EDE8DF] rounded-3xl overflow-hidden">
          {items.map((item) => (
            <div key={item.articleId} className="p-5 border-b last:border-b-0 border-[#F0ECE5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-800">{item.articleCategory || 'General'}</span>
                <h2 className="font-serif text-lg font-bold text-stone-900 mt-1">{item.articleTitle}</h2>
                <p className="text-xs text-stone-500 mt-1">Read {item.readCount} time{item.readCount === 1 ? '' : 's'} • {new Date(item.lastReadAt).toLocaleString()}</p>
              </div>
              <Link to={`/article/${item.articleId}`} className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#1A382B]">Continue reading <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingHistory;
