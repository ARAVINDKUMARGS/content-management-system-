import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  LayoutGrid,
  Search,
  PenLine,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Filter,
  Eye,
  Clock,
  ThumbsUp,
} from 'lucide-react';

/**
 * Home Page View
 */
export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredArticle, setFeaturedArticle] = React.useState(null);
  const [recentArticles, setRecentArticles] = React.useState([]);

  React.useEffect(() => {
    const fetchHomeArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/articles?limit=6');
        const data = await response.json();
        if (data.success && data.articles && data.articles.length > 0) {
          setFeaturedArticle(data.articles[0]);
          setRecentArticles(data.articles.slice(1));
        } else {
          // Fallback initial seeded articles if backend DB is empty
          const fallbackFeatured = {
            _id: 'featured-1',
            title: 'The Quantum Biology Revolution: How Nature Harnesses Coherence',
            description: 'Exploration into how migratory birds and photosynthetic complexes exploit quantum superposition for near-perfect efficiency.',
            category: 'Science',
            readingTime: 6,
            views: 1420,
            likes: 184,
            createdAt: new Date().toISOString(),
            author: { name: 'Priya Mehta', role: 'Author' },
            heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          };
          const fallbackRecent = [
            {
              _id: 'recent-1',
              title: 'CRISPR and the Ethics of Genetic Editing',
              description: 'Examining the medical promises and societal implications of human germline modifications.',
              category: 'Science',
              readingTime: 8,
              views: 950,
              likes: 112,
              author: { name: 'Priya Mehta' },
            },
            {
              _id: 'recent-2',
              title: 'Decarbonizing Heavy Industry: Breakthroughs in Green Hydrogen',
              description: 'How high-temperature electrolysis could make zero-carbon steel and cement commercially viable.',
              category: 'Environment',
              readingTime: 5,
              views: 640,
              likes: 78,
              author: { name: 'Thomas Okeke' },
            },
            {
              _id: 'recent-3',
              title: 'The Forgotten History of Silicon Valley\'s First Women Programmers',
              description: 'Uncovering the pioneering women who wrote assembly code for the earliest electronic computers.',
              category: 'History',
              readingTime: 7,
              views: 810,
              likes: 95,
              author: { name: 'Thomas Okeke' },
            },
          ];
          setFeaturedArticle(fallbackFeatured);
          setRecentArticles(fallbackRecent);
        }
      } catch (err) {
        console.warn('Home fetch error:', err);
      }
    };

    fetchHomeArticles();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Featured Article */}
      {featuredArticle && (
        <div className="bg-white border border-[#EDE8DF] rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0 group">
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-[#1A382B] border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  FEATURED • {featuredArticle.category || 'Science'}
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {featuredArticle.readingTime || 6} min read
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                  {featuredArticle.views || 1420} views
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight group-hover:text-[#1A382B] transition">
                <Link to={`/browse/${featuredArticle._id}`}>{featuredArticle.title}</Link>
              </h1>

              <p className="text-sm text-stone-600 font-serif leading-relaxed line-clamp-3">
                {featuredArticle.description || featuredArticle.content?.slice(0, 180)}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F5F2EB]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1A382B] text-white font-serif text-xs font-bold flex items-center justify-center">
                  {featuredArticle.author?.name ? featuredArticle.author.name[0] : 'P'}
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">{featuredArticle.author?.name || 'Priya Mehta'}</p>
                  <p className="text-[10px] text-stone-500">Senior Science Writer</p>
                </div>
              </div>

              <Link
                to={`/browse/${featuredArticle._id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A382B] hover:bg-[#11261D] text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-stone-100 relative min-h-[260px] lg:min-h-full overflow-hidden">
            <img
              src={featuredArticle.heroImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      )}

      {/* Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1A382B] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>

          <h2 className="font-serif text-lg font-bold text-stone-900">
            In-Depth Articles
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed">
            Curated essays, technical deep-dives, and investigative journalism written by domain experts.
          </p>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D97736] flex items-center justify-center font-bold">
            <PenLine className="w-5 h-5" />
          </div>

          <h2 className="font-serif text-lg font-bold text-stone-900">
            Interactive Knowledge
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed">
            Test and consolidate your understanding with article-aligned quizzes and concept checkpoints.
          </p>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <h2 className="font-serif text-lg font-bold text-stone-900">
            Editorial Standards
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed">
            Every submission undergoes peer review and editorial moderation before publication.
          </p>
        </div>
      </div>

      {/* Recent Articles Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-stone-900">Recent Articles</h2>
          <Link to="/browse" className="text-xs font-bold text-[#1A382B] hover:underline flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentArticles.map((art) => (
            <div
              key={art._id}
              className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-400 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="px-2.5 py-0.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-full font-bold text-[10px] text-stone-700 uppercase tracking-wider">
                    {art.category || 'General'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {art.readingTime || 5} min
                  </span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug line-clamp-2 hover:text-[#1A382B]">
                  <Link to={`/browse/${art._id}`}>{art.title}</Link>
                </h3>

                <p className="text-xs text-stone-600 font-serif leading-relaxed line-clamp-3">
                  {art.description || art.content?.slice(0, 120)}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium text-stone-700">{art.author?.name || 'Editorial Team'}</span>
                <Link to={`/browse/${art._id}`} className="text-[#1A382B] font-bold hover:underline">
                  Read →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Browse View
 */
export const BrowsePage = () => {
  const categories = [
    'All Topics',
    'Science',
    'Technology',
    'Environment',
    'History',
    'Health',
    'Business',
    'Education',
    'Other',
  ];

  const [articles, setArticles] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Topics');
  const [sortBy, setSortBy] = React.useState('latest');
  const [quizOnly, setQuizOnly] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  /*
   * Get articles from backend
   */
  React.useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('lumen_token');
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery.trim());
        if (selectedCategory && selectedCategory !== 'All Topics') queryParams.append('category', selectedCategory);
        if (sortBy) queryParams.append('sortBy', sortBy);

        const response = await fetch(
          `http://localhost:5000/api/articles?${queryParams.toString()}`,
          {
            method: 'GET',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

  const displayedArticles = quizOnly
    ? articles.filter(a => a._id === '66c9f2b00000000000000001' || a._id === '66c9f2b00000000000000002' || a.title?.includes('CRISPR') || a.title?.includes('Internet'))
    : articles;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Browse Articles & Topics
          </h1>

          <p className="text-xs text-stone-500 mt-1">
            Explore essays, research notes, and curated knowledge
          </p>
        </div>

        {/* Search & Sort Row */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <input
              type="text"
              placeholder="Search articles or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B]"
            />

            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-[#EDE8DF] rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#1A382B]"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Has Quiz Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setQuizOnly(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat && !quizOnly
                ? 'bg-[#1A382B] text-white shadow-2xs'
                : 'bg-white border border-[#EDE8DF] text-stone-700 hover:bg-[#EFECE6]'
            }`}
          >
            {cat}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setQuizOnly(!quizOnly)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            quizOnly
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Has Quiz
        </button>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-12 text-stone-500 text-xs font-medium">
          Loading published content...
        </div>
      ) : displayedArticles.length === 0 ? (
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-12 text-center text-stone-500 space-y-2">
          <p className="font-serif text-lg font-bold text-stone-800">No articles found</p>
          <p className="text-xs">Try adjusting your search keywords or topic filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedArticles.map((article) => (
            <Link
              key={article._id}
              to={`/browse/${article._id}`}
              className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3 hover:border-stone-400 hover:shadow-md transition block group"
            >
              {/* Category + Views */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {article.category}
                </span>

                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views || 0}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-[#1A382B] transition line-clamp-2">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {article.description || article.content?.slice(0, 140)}...
              </p>

              {/* Author + Likes */}
              <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-stone-500">
                <span>
                  By {article.author?.name || 'Unknown Author'}
                </span>

                <span className="flex items-center gap-1 text-stone-700 font-medium">
                  <ThumbsUp className="w-3.5 h-3.5 text-stone-400" />
                  {article.likes || 0} likes
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Write View (Article Editor)
 */
export const WritePage = () => {
  const { user } = useAuth();

  // Article form state
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('Technology');

  // Loading and message state
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');

  /**
   * Submit article
   */
  const handleSubmit = async () => {
    // Validate title
    if (!title.trim()) {
      setMessageType('error');
      setMessage('Please enter an article title.');
      return;
    }

    // Validate content
    if (!content.trim()) {
      setMessageType('error');
      setMessage('Please enter article content.');
      return;
    }

    // Check logged-in user
    if (!user) {
      setMessageType('error');
      setMessage('Please login before submitting an article.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setMessageType('');

      /*
       * Your AuthContext stores the JWT using:
       *
       * localStorage.setItem('lumen_token', newToken)
       */
      const token = localStorage.getItem('lumen_token');

      if (!token) {
        setMessageType('error');
        setMessage('Authentication token not found. Please login again.');
        return;
      }

      /*
       * STEP 1:
       * Create the article.
       */
      const createResponse = await fetch(
        'http://localhost:5000/api/articles',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            content: content.trim(),
            category,
            tags: [],
          }),
        }
      );

      const createData = await createResponse.json();

      console.log('Create article response:', createData);

      if (!createResponse.ok) {
        throw new Error(
          createData.message || 'Failed to create article.'
        );
      }

      /*
       * Get article ID.
       */
      const articleId = createData.article?._id;

      if (!articleId) {
        throw new Error(
          'Article was created but no article ID was returned.'
        );
      }

      /*
       * STEP 2:
       * Submit the newly created article for review.
       */
      const submitResponse = await fetch(
        `http://localhost:5000/api/articles/${articleId}/submit`,
        {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const submitData = await submitResponse.json();

      console.log('Submit article response:', submitData);

      if (!submitResponse.ok) {
        throw new Error(
          submitData.message ||
            'Failed to submit article for review.'
        );
      }

      /*
       * SUCCESS
       */
      setMessageType('success');
      setMessage(
        'Article submitted successfully for review!'
      );

      // Clear the form
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('Technology');

    } catch (error) {
      console.error('Submit article error:', error);

      setMessageType('error');
      setMessage(
        error.message ||
          'Something went wrong while submitting the article.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Write New Article
          </h1>

          <p className="text-xs text-stone-500">
            Authoring as {user?.name}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-[#1A382B] text-white text-xs font-bold rounded-xl hover:bg-[#11261D] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>

      {/* Success / Error Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm border ${
            messageType === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Article Form */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">

        {/* Article Title */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Article Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging headline..."
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl font-serif text-lg text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white"
          />
        </div>

        {/* Short Excerpt */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Short Excerpt
          </label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief summary for previews..."
            className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white"
          >
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="Environment">Environment</option>
            <option value="Health">Health</option>
            <option value="History">History</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Article Content */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Content (Markdown)
          </label>

          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article in Markdown..."
            className="w-full p-4 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white resize-y"
          />
        </div>

      </div>
    </div>
  );
};

/**
 * Admin View (Verification Center)
 */
export const AdminPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Admin Verification Center
        </h1>

        <p className="text-xs text-stone-500">
          Review pending submissions and editorial workflows
        </p>
      </div>

      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-stone-900">
          Pending Review Queue
        </h2>

        <div className="divide-y divide-[#F5F2EB] text-xs">
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-stone-900 block">
                The Future of Brain-Computer Interfaces
              </span>

              <span className="text-stone-500">
                Submitted by Priya Mehta • 5 min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-semibold hover:bg-emerald-100 transition">
                Approve
              </button>

              <button className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl font-semibold hover:bg-rose-100 transition">
                Request Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};