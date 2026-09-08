import React, { useEffect, useState } from 'react';
import { Bookmark, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { engagementAPI } from '../services/api';

const Bookmarks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const res = await engagementAPI.getBookmarks();
      setItems(res.data?.bookmarks || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load saved articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (articleId) => {
    try {
      await engagementAPI.removeBookmark(articleId);
      setItems((current) => current.filter((item) => item.articleId !== articleId));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to remove bookmark.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5" /> Creative Engagement
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-3">Saved Articles</h1>
        <p className="text-sm text-stone-500 mt-1">Your bookmarked reading list, saved for later.</p>
      </div>

      {message && <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-sm">{message}</div>}
      {loading ? <p className="text-sm text-stone-500">Loading saved articles...</p> : items.length === 0 ? (
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-10 text-center">
          <Bookmark className="w-10 h-10 mx-auto text-stone-300" />
          <h2 className="font-serif text-xl font-bold mt-4">No saved articles yet</h2>
          <p className="text-sm text-stone-500 mt-2">Bookmark an article from Browse to find it here.</p>
          <Link to="/browse" className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-[#1A382B] text-white rounded-xl text-sm font-semibold">
            Browse articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <article key={item.articleId} className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">{item.articleCategory || 'General'}</span>
                <button onClick={() => remove(item.articleId)} className="p-2 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-50" title="Remove bookmark">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h2 className="font-serif text-xl font-bold text-stone-900 mt-4">{item.articleTitle}</h2>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">{item.articleExcerpt || 'Saved article'}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-stone-500 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {item.authorName || 'Lumen author'}</span>
                <Link to={`/article/${item.articleId}`} className="text-xs font-bold text-[#1A382B] flex items-center gap-1">Read <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
