import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Share2, BookOpen } from 'lucide-react';
import { engagementAPI } from '../services/api';
import { getArticleById } from './engagementData';
import { useAuth } from '../context/AuthContext';

const ArticleReader = () => {
  const { articleId } = useParams();
  const article = useMemo(() => getArticleById(articleId), [articleId]);
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!article) return;
    engagementAPI.recordRead(article.id, article).catch(() => {});
    if (isAuthenticated) engagementAPI.getBookmarkStatus(article.id).then((res) => setBookmarked(!!res.data?.bookmarked)).catch(() => {});
  }, [article, isAuthenticated]);

  if (!article) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="font-serif text-3xl font-bold">Article not found</h1><Link to="/browse" className="inline-flex mt-5 text-sm font-semibold text-[#1A382B]">Back to Browse</Link></div>;
  }

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      setStatus('Please sign in to bookmark articles.');
      return;
    }
    try {
      if (bookmarked) {
        await engagementAPI.removeBookmark(article.id);
        setBookmarked(false);
        setStatus('Removed from saved articles.');
      } else {
        await engagementAPI.addBookmark(article.id, article);
        setBookmarked(true);
        setStatus('Article saved to your bookmarks.');
      }
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to update bookmark.');
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: article.title, text: article.excerpt, url });
      else {
        await navigator.clipboard.writeText(url);
        setStatus('Article link copied.');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setStatus('Unable to share this article.');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/browse" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900"><ArrowLeft className="w-4 h-4" /> Back to Browse</Link>
      <div className="mt-8 bg-white border border-[#EDE8DF] rounded-3xl p-7 sm:p-10 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">{article.category}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight mt-5">{article.title}</h1>
        <p className="text-base text-stone-600 leading-relaxed mt-4">{article.excerpt}</p>
        <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-[#F0ECE5]">
          <span className="text-xs text-stone-500">By <strong className="text-stone-800">{article.authorName}</strong></span>
          <div className="flex items-center gap-2">
            <button onClick={toggleBookmark} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border ${bookmarked ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-[#EDE8DF] text-stone-700 hover:bg-[#FAF7F2]'}`}>
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}{bookmarked ? 'Saved' : 'Save'}
            </button>
            <button onClick={share} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border border-[#EDE8DF] text-stone-700 hover:bg-[#FAF7F2]"><Share2 className="w-4 h-4" /> Share</button>
          </div>
        </div>
        {status && <div className="mt-4 p-3 rounded-xl bg-[#FAF7F2] text-xs text-stone-700">{status}</div>}
        <div className="mt-8 space-y-5 text-sm sm:text-base text-stone-700 leading-8">
          <p>{article.content}</p>
          <p>As the field develops, responsible design matters as much as technical progress. Researchers, authors, and readers all benefit when new ideas are explained clearly and evaluated with evidence.</p>
        </div>
        <div className="mt-8 pt-5 border-t border-[#F0ECE5] flex items-center gap-2 text-xs text-stone-500"><BookOpen className="w-4 h-4" /> Your reading activity has been recorded.</div>
      </div>
    </article>
  );
};

export default ArticleReader;
