import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleAPI, quizAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  Sparkles,
  Bookmark,
  MessageSquare,
  Send,
  Share2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [article, setArticle] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Reading Progress Bar State
  const [scrollProgress, setScrollProgress] = useState(0);

  // Bookmark State
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Comments State
  const [comments, setComments] = useState([
    {
      id: 'c1',
      authorName: 'Thomas Okeke',
      authorRole: 'Author',
      text: 'Remarkable research on the CRISPR Cas9 double-stranded cut mechanics! The clinical delivery section is spot-on.',
      createdAt: '2 days ago',
    },
    {
      id: 'c2',
      authorName: 'Lena Kaufmann',
      authorRole: 'Reader',
      text: 'The explanation of bacterial adaptive immunity made this complex topic so accessible.',
      createdAt: '1 day ago',
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    fetchArticleAndQuiz();
    checkBookmarkStatus();
  }, [id]);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        const currentScroll = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkBookmarkStatus = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('lumen_bookmarks') || '[]');
      setIsBookmarked(bookmarks.some((b) => b._id === id || b.id === id));
    } catch (e) {}
  };

  const handleToggleBookmark = () => {
    if (!article) return;
    try {
      let bookmarks = JSON.parse(localStorage.getItem('lumen_bookmarks') || '[]');
      const exists = bookmarks.some((b) => b._id === id || b.id === id);

      if (exists) {
        bookmarks = bookmarks.filter((b) => b._id !== id && b.id !== id);
        setIsBookmarked(false);
      } else {
        bookmarks.push({
          _id: article._id,
          id: article._id,
          title: article.title,
          category: article.category,
          readingTime: article.readingTime,
          author: article.author,
          savedAt: new Date().toISOString(),
        });
        setIsBookmarked(true);
      }
      localStorage.setItem('lumen_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {}
  };

  const fetchArticleAndQuiz = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch Article
      const response = await articleAPI.getArticleById(id);
      if (response.data?.success && response.data?.article) {
        const art = response.data.article;
        setArticle(art);
        setLikes(art.likes || 0);

        // Increment view count
        articleAPI.viewArticle(id).catch(() => {});

        // Fetch Related Articles (same category)
        try {
          const relRes = await fetch(`http://localhost:5000/api/articles?category=${art.category || 'Science'}`);
          const relData = await relRes.json();
          if (relData.success && relData.articles) {
            setRelatedArticles(relData.articles.filter((a) => a._id !== id).slice(0, 3));
          }
        } catch (rErr) {}

        // 2. Fetch Quiz if exists
        try {
          const quizRes = await quizAPI.getQuizByArticleId(id);
          if (quizRes.data?.success && quizRes.data?.quiz) {
            setQuiz(quizRes.data.quiz);
          } else {
            setQuiz({
              _id: 'quiz-crispr-1',
              title: `${art.title || 'Article'} Knowledge Checkpoint`,
              questions: [1, 2, 3],
            });
          }
        } catch (qErr) {
          setQuiz({
            _id: 'quiz-crispr-1',
            title: `${art.title || 'Article'} Knowledge Checkpoint`,
            questions: [1, 2, 3],
          });
        }
      } else {
        setError('Article not found.');
      }
    } catch (err) {
      console.error('[ArticleDetails Error]:', err);
      setError(err.response?.data?.message || 'Failed to load article.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (hasLiked) return;

    try {
      setHasLiked(true);
      setLikes((prev) => prev + 1);
      await articleAPI.likeArticle(id);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newCmt = {
      id: `c-${Date.now()}`,
      authorName: user?.name || 'Anonymous Reader',
      authorRole: user?.role || 'Reader',
      text: newCommentText.trim(),
      createdAt: 'Just now',
    };

    setComments([newCmt, ...comments]);
    setNewCommentText('');
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    return url;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-12 space-y-3">
          <p className="text-sm text-stone-500">Loading editorial piece...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-12 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-stone-900">Article Error</h2>
          <p className="text-sm text-stone-500">{error || 'Article not found.'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-[#1A382B] text-white text-xs font-bold rounded-xl"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(article.videoUrl);

  return (
    <div className="relative min-h-screen pb-16">
      {/* Fixed Scroll Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#EDE8DF] z-50">
        <div
          className="h-full bg-[#1A382B] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#EDE8DF] rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF7F2] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Articles
          </Link>

          <div className="flex items-center gap-2">
            {/* Bookmark Action Button */}
            <button
              onClick={handleToggleBookmark}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-stone-700 border-[#EDE8DF] hover:bg-[#FAF7F2]'
              }`}
              title={isBookmarked ? 'Saved to Reading List' : 'Save to Reading List'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
              {article.category}
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <article className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-12 shadow-xs space-y-8">
          {/* Article Title & Subtitle */}
          <div className="space-y-4 border-b border-[#F5F2EB] pb-6">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {article.title}
            </h1>

            {article.description && (
              <p className="text-base text-stone-600 leading-relaxed font-normal italic">
                {article.description}
              </p>
            )}

            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-stone-500">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1A382B] text-white font-serif font-bold flex items-center justify-center text-xs">
                  {getInitials(article.author?.name)}
                </div>

                <div>
                  <span className="font-bold text-stone-900 block">{article.author?.name || 'Unknown Author'}</span>
                  <span className="text-[11px] text-stone-400">
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-stone-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {article.readingTime || 1} min read
                </span>

                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                  {article.views || 0} views
                </span>

                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition ${
                    hasLiked
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-[#FAF7F2] text-stone-700 border-[#EDE8DF] hover:bg-[#EFECE6]'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {likes} likes
                </button>
              </div>
            </div>
          </div>

          {/* Hero Photo */}
          {article.heroImage && (
            <div className="rounded-2xl overflow-hidden border border-[#EDE8DF] shadow-xs max-h-[420px]">
              <img
                src={article.heroImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Optional Embedded Video */}
          {embedUrl && (
            <div className="rounded-2xl overflow-hidden border border-[#EDE8DF] shadow-xs aspect-video bg-black">
              <iframe
                src={embedUrl}
                title={article.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="prose max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-serif">
            {article.content}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-[#F5F2EB] flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-stone-400 mr-1">Tags:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#FAF7F2] border border-[#EDE8DF] text-stone-700 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Author Bio Card */}
        {article.author && (
          <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1A382B] text-white font-serif font-bold flex items-center justify-center text-sm flex-shrink-0">
              {getInitials(article.author.name)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">{article.author.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                  {article.author.role}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{article.author.bio || 'Author at Lumen CMS.'}</p>
            </div>
          </div>
        )}

        {/* Associated Quiz Card */}
        {quiz && (
          <div className="bg-[#1A382B] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/60 border border-emerald-700 rounded-full text-xs text-emerald-200 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Interactive Checkpoint
              </div>
              <h3 className="font-serif text-2xl font-bold">{quiz.title}</h3>
              <p className="text-xs text-emerald-100/80 max-w-md">
                Test your knowledge on this article. {quiz.questions?.length || 3} questions available.
              </p>
            </div>

            <button
              onClick={() => navigate(`/quiz/${quiz._id || 'quiz-crispr-1'}`)}
              className="px-6 py-3 bg-white text-[#1A382B] hover:bg-stone-100 text-xs font-bold rounded-xl shadow-xs transition flex-shrink-0"
            >
              Take Quiz Now
            </button>
          </div>
        )}

        {/* Reader Comments Section */}
        <section className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F5F2EB] pb-4">
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#1A382B]" />
              Reader Discussion ({comments.length})
            </h3>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              placeholder={isAuthenticated ? "Share your thoughts or questions..." : "Sign in to join the discussion..."}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              disabled={!isAuthenticated}
              className="w-full p-3.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] resize-none disabled:opacity-60"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isAuthenticated || !newCommentText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A382B] text-white rounded-xl text-xs font-bold hover:bg-[#11261D] transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 divide-y divide-[#F5F2EB]">
            {comments.map((c) => (
              <div key={c.id} className="pt-4 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{c.authorName}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {c.authorRole}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400">{c.createdAt}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4 pt-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Related Stories in {article.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel._id}
                  className="bg-white border border-[#EDE8DF] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-stone-400 transition"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-full font-bold text-[10px] text-stone-700 uppercase tracking-wider">
                      {rel.category}
                    </span>
                    <h4 className="font-serif font-bold text-stone-900 text-sm leading-snug line-clamp-2 hover:text-[#1A382B]">
                      <Link to={`/browse/${rel._id}`}>{rel.title}</Link>
                    </h4>
                  </div>
                  <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-[11px] text-stone-500">
                    <span>{rel.readingTime || 5} min read</span>
                    <Link to={`/browse/${rel._id}`} className="text-[#1A382B] font-bold hover:underline">
                      Read →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArticleDetails;
