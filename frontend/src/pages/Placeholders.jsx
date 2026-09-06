import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/comments/CommentSection';
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
  MessageSquare,
  X,
  Share2,
  Bookmark,
} from 'lucide-react';

export const ALL_ARTICLES = [
  {
    id: 'crispr-future-medicine',
    title: 'How CRISPR Is Rewriting the Story of Human Disease',
    category: 'Science',
    categoryColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    readTime: '7 min read',
    author: 'Dr. Priya Mehta',
    authorRole: 'author',
    likes: 284,
    excerpt: 'A quiet revolution in molecular biology has produced a tool precise enough to correct a single letter in DNA.',
    fullContent: `Gene editing has evolved from theoretical biochemistry to active clinical therapeutics in less than a decade. 

By utilizing targeted RNA guides coupled with Cas nucleases, researchers can now perform site-directed genomic edits with single-nucleotide fidelity. Current Phase II trials are actively tackling sickle-cell anemia, beta-thalassemia, and hereditary retinal dystrophies.

However, the distinction between somatic cell edits (affecting solely the patient) and germline modifications (inherited across generations) remains the definitive ethical boundary for contemporary regulatory frameworks. Scientists worldwide are urging consensus on global biosafety governance before multi-target germline trials begin.`,
  },
  {
    id: 'ai-reasoning-frontiers',
    title: "The Night the Internet Was Born — and Almost Wasn't",
    category: 'Technology',
    categoryColor: 'bg-amber-50 text-amber-800 border-amber-200',
    readTime: '6 min read',
    author: 'Thomas Okeke',
    authorRole: 'author',
    likes: 198,
    excerpt: "On October 29, 1969, a student typed two letters into a terminal at UCLA. The system crashed. The internet arrived.",
    fullContent: `The ARPANET experiment began with the simplest possible ambition: transmit the command 'LOGIN' from a computer terminal at UCLA to a machine at Stanford Research Institute.

After typing the letters 'L' and 'O', the system crashed. Yet those two letters proved that packet-switching across disparate computer networks was physically possible. Within decades, this humble node connection restructured human commerce, science, and discourse.

Today, as distributed computing meets autonomous agent frameworks, we stand at an equivalent inflection point—where decentralized networks transition from transmitting static data packets to orchestrating autonomous intelligence.`,
  },
  {
    id: 'climate-resilience-2030',
    title: 'Rethinking Global Water Infrastructure for the Next Century',
    category: 'Environment',
    categoryColor: 'bg-teal-50 text-teal-800 border-teal-200',
    readTime: '8 min read',
    author: 'Thomas Okeke',
    authorRole: 'author',
    likes: 165,
    excerpt: 'How coastal megacities and arid regions are deploying biomimetic sponge architecture to survive hydrologic extremes.',
    fullContent: `Traditional concrete stormwater systems were designed for predictable seasonal rainfall patterns that no longer exist. 

Modern hydrologists are shifting toward 'sponge city' designs—integrating permeable pavements, subsurface bioswales, and urban wetlands that capture, filter, and recharge local aquifers rather than flushing runoff into open seas.

Early implementations in East Asia and Scandinavia have demonstrated that biological water reclamation not only mitigates 100-year flood events but substantially cools urban heat islands during peak summer heatwaves.`,
  },
  {
    id: 'ancient-manuscripts-decoded',
    title: 'Unlocking the Lost Scrolls of Herculaneum with Computer Vision',
    category: 'History',
    categoryColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    readTime: '9 min read',
    author: 'Thomas Okeke',
    authorRole: 'author',
    likes: 215,
    excerpt: 'High-energy X-ray phase contrast tomography is revealing philosophical texts preserved by volcanic ash for two millennia.',
    fullContent: `When Mount Vesuvius erupted in 79 AD, it carbonized hundreds of papyrus scrolls in the Villa of the Papyri at Herculaneum. For centuries, attempting to physically unroll these charred cylinders reduced them to dust.

By combining high-resolution particle accelerator scans with volumetric deep-learning models, researchers have successfully segmented 3D papyrus layers and detected ink traces imperceptible to the human eye. 

The initial decrypted passages reveal lost philosophical treatises on Epicurean ethics and music theory, opening a brand-new window into ancient Hellenistic thought.`,
  },
  {
    id: 'longevity-cellular-repair',
    title: 'The Molecular Hallmarks of Aging and Cellular Rejuvenation',
    category: 'Medicine',
    categoryColor: 'bg-rose-50 text-rose-800 border-rose-200',
    readTime: '7 min read',
    author: 'Dr. Priya Mehta',
    authorRole: 'author',
    likes: 310,
    excerpt: 'From senolytics to partial epigenetic reprogramming, how targeting cellular decay is transforming preventative healthcare.',
    fullContent: `Aging is no longer viewed as an inevitable thermodynamic erosion of biology, but as a coordinated set of biochemical pathways subject to medical intervention.

Key therapeutic frontiers include:
1. Senolytic clearance: Selectively eliminating senescent 'zombie' cells that secrete inflammatory factors.
2. Telomere stabilization: Protecting chromosome ends without oncogenic risks.
3. Mitochondrial rejuvenation: Restoring NAD+ pools and mitophagy efficiency.

Clinical trials are already examining whether clearance of senescent cells can reverse osteoarthritis symptoms and restore cardiovascular compliance in elderly cohorts.`,
  },
  {
    id: 'editorial-moderation-standards',
    title: 'Community Governance & Editorial Integrity in Modern CMS',
    category: 'Publishing',
    categoryColor: 'bg-purple-50 text-purple-800 border-purple-200',
    readTime: '5 min read',
    author: 'Eleanor Vance',
    authorRole: 'admin',
    likes: 142,
    excerpt: 'Establishing transparent reviewer rubrics, author attribution chains, and community moderation workflows.',
    fullContent: `In an era of rapid AI-assisted publishing, human editorial integrity is more critical than ever. 

Lumen enforces a tripartite governance structure:
- Readers: Engage with essays, pose questions, and flag moderation anomalies.
- Authors: Provide primary sources, defend thesis statements, and interact directly in comment threads.
- Editors/Admins: Verify academic citations, maintain ethical standards, and oversee community moderation.

By keeping discussions transparent and grounded in authorial expertise, we foster thoughtful discourse rather than algorithmic outrage.`,
  },
];

/**
 * Home Page View
 */
export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Banner */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-8 sm:p-14 shadow-xs text-center space-y-6 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-full text-xs font-semibold text-stone-700">
          <Sparkles className="w-3.5 h-3.5 text-[#D97736]" />
          Editorial Content & Knowledge Platform
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Where Thoughtful Writing Meets Interactive Knowledge
        </h1>

        <p className="text-xs sm:text-base text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Lumen is an editorial publishing platform designed for curious readers, subject matter authors, and editorial teams.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/browse"
            className="px-6 py-3 bg-[#1A382B] hover:bg-[#11261D] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <span>Browse All Articles & Discussions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/discussions"
            className="px-6 py-3 bg-[#EFECE6] hover:bg-[#E7E2D9] text-stone-800 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-stone-600" />
            <span>Community Forum</span>
          </Link>
        </div>
      </div>

      {/* Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1A382B] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-stone-900">In-Depth Articles</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Curated essays, technical deep-dives, and investigative science journalism written by domain experts.
          </p>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D97736] flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-stone-900">Threaded Discussions</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Engage with authors through multi-level comment replies, reactions, and community reflections.
          </p>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-stone-900">Editorial Governance</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Role-based moderation tools empowering Admins, Authors, and Readers with transparent standards.
          </p>
        </div>
      </div>

      {/* Featured Topics Section with Comments */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Featured Topics & Discussions</h2>
            <p className="text-xs text-stone-500">Click any topic to read the essay and participate in discussion</p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-bold text-[#1A382B] hover:underline flex items-center gap-1"
          >
            View all ({ALL_ARTICLES.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALL_ARTICLES.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-4 hover:border-stone-400 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${article.categoryColor}`}>
                  {article.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-stone-500">
                <span>By {article.author}</span>
                <span className="text-[#1A382B] font-bold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Discuss
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal with Comment Section */}
      {selectedArticle && (
        <ArticleReaderModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

/**
 * Browse View
 */
export const BrowsePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = ['All Topics', 'Science', 'Technology', 'Environment', 'History', 'Medicine', 'Publishing'];

  const filteredArticles = ALL_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All Topics' || article.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Browse Articles & Topics</h1>
          <p className="text-xs text-stone-500 mt-1">
            Every topic includes in-depth analysis and a dedicated community discussion thread
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search articles, authors, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-[#1A382B] text-white shadow-2xs'
                : 'bg-white border border-[#EDE8DF] text-stone-700 hover:bg-[#EFECE6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-4 hover:border-stone-400 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className={`font-semibold px-2.5 py-0.5 rounded-full border ${article.categoryColor}`}>
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {article.readTime}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                {article.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-stone-500">
              <span>By {article.author}</span>
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1 text-stone-700 font-medium">
                  <ThumbsUp className="w-3.5 h-3.5 text-stone-400" /> {article.likes}
                </span>
                <span className="text-[#1A382B] font-bold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Read & Discuss
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal with Comment Section */}
      {selectedArticle && (
        <ArticleReaderModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

/**
 * Reusable Article Reader Modal with Embedded Threaded Discussion
 */
const ArticleReaderModal = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl space-y-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDE8DF]">
          <div className="space-y-2">
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${article.categoryColor}`}
            >
              {article.category} • {article.readTime}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {article.title}
            </h2>
            <p className="text-xs text-stone-500">
              Written by <strong>{article.author}</strong> ({article.authorRole})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
            title="Close article reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Body */}
        <div className="text-xs sm:text-sm text-stone-800 leading-relaxed space-y-4 whitespace-pre-line font-serif">
          {article.fullContent}
        </div>

        {/* Embedded Threaded Discussion Component */}
        <div className="pt-6 border-t border-[#EDE8DF]">
          <CommentSection
            targetId={article.id}
            targetTitle={article.title}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Write View (Article Editor)
 */
export const WritePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Write New Article</h1>
          <p className="text-xs text-stone-500">Authoring as {user?.name}</p>
        </div>
        <button className="px-4 py-2 bg-[#1A382B] text-white text-xs font-bold rounded-xl hover:bg-[#11261D] transition">
          Submit for Review
        </button>
      </div>

      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">Article Title</label>
          <input
            type="text"
            placeholder="Enter an engaging headline..."
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl font-serif text-lg text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">Short Excerpt</label>
          <input
            type="text"
            placeholder="A brief summary for previews..."
            className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">Content (Markdown)</label>
          <textarea
            rows={10}
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
        <h1 className="font-serif text-3xl font-bold text-stone-900">Admin Verification Center</h1>
        <p className="text-xs text-stone-500">Review pending submissions and editorial workflows</p>
      </div>

      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-stone-900">Pending Review Queue</h2>
        <div className="divide-y divide-[#F5F2EB] text-xs">
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-stone-900 block">The Future of Brain-Computer Interfaces</span>
              <span className="text-stone-500">Submitted by Priya Mehta • 5 min read</span>
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
