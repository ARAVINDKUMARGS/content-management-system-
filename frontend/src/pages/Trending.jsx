import React, { useEffect, useState } from 'react';
import { Flame, Bookmark, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { engagementAPI } from '../services/api';

const Trending = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    engagementAPI.getTrending(10)
      .then((res) => setArticles(res.data?.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold"><Flame className="w-3.5 h-3.5" /> Community trends</div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-3">Trending Articles</h1>
        <p className="text-sm text-stone-500 mt-1">Content gaining attention through recent reads and saves.</p>
      </div>

      {loading ? <p className="text-sm text-stone-500">Calculating trends...</p> : articles.length === 0 ? (
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-10 text-center">
          <Flame className="w-10 h-10 mx-auto text-stone-300" />
          <h2 className="font-serif text-xl font-bold mt-4">Trending data will appear here</h2>
          <p className="text-sm text-stone-500 mt-2">Read or bookmark articles to create engagement signals.</p>
          <Link to="/browse" className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-[#1A382B] text-white rounded-xl text-sm font-semibold">Browse articles <ArrowRight className="w-4 h-4" /></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles.map((article, index) => (
            <article key={article.articleId} className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-full">#{index + 1} Trending</span>
                <span className="text-xs text-stone-500">Score {article.engagementScore}</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-stone-900 mt-4">{article.title}</h2>
              <p className="text-sm text-stone-600 mt-2">{article.excerpt}</p>
              <div className="flex items-center gap-4 mt-5 text-xs text-stone-500">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {article.readCount} reads</span>
                <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5" /> {article.bookmarkCount} saves</span>
              </div>
              <Link to={`/article/${article.articleId}`} className="inline-flex items-center gap-1 mt-5 text-xs font-bold text-[#1A382B]">Read article <ArrowRight className="w-3.5 h-3.5" /></Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;
