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
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="px-6 py-3 bg-[#1A382B] hover:bg-[#11261D] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <span>Go to My Profile ({user?.role})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3 bg-[#1A382B] hover:bg-[#11261D] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-[#EFECE6] hover:bg-[#E7E2D9] text-stone-800 text-xs sm:text-sm font-semibold rounded-xl transition"
              >
                Sign In
              </Link>
            </>
          )}
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
            <PenLine className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-stone-900">Interactive Knowledge</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Test and consolidate your understanding with article-aligned quizzes and concept checkpoints.
          </p>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-stone-900">Editorial Standards</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every submission undergoes rigorous peer review and editorial moderation before publication.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Browse View
 */
export const BrowsePage = () => {
  const categories = ['All Topics', 'Science', 'Technology', 'Environment', 'History', 'Medicine'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Browse Articles & Topics</h1>
          <p className="text-xs text-stone-500 mt-1">Explore essays, research notes, and curated knowledge</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search articles or topics..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              idx === 0
                ? 'bg-[#1A382B] text-white shadow-2xs'
                : 'bg-white border border-[#EDE8DF] text-stone-700 hover:bg-[#EFECE6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3 hover:border-stone-400 transition">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Science
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 7 min read
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            How CRISPR Is Rewriting the Story of Human Disease
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            A quiet revolution in molecular biology has produced a tool precise enough to correct a single letter in DNA.
          </p>
          <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-stone-500">
            <span>By Dr. Priya Mehta</span>
            <span className="flex items-center gap-1 text-stone-700 font-medium">
              <ThumbsUp className="w-3.5 h-3.5 text-stone-400" /> 284 likes
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs space-y-3 hover:border-stone-400 transition">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Technology
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 6 min read
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            The Night the Internet Was Born — and Almost Wasn't
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            On October 29, 1969, a student typed two letters into a terminal at UCLA. The system crashed. The internet arrived.
          </p>
          <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-stone-500">
            <span>By Thomas Okeke</span>
            <span className="flex items-center gap-1 text-stone-700 font-medium">
              <ThumbsUp className="w-3.5 h-3.5 text-stone-400" /> 198 likes
            </span>
          </div>
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
