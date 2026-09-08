import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit3,
  Check,
  X,
  PlusCircle,
  FileText,
  Eye,
  ThumbsUp,
  Sparkles,
  BookOpen,
  Award,
  AlertCircle,
} from 'lucide-react';

const Profile = () => {
  const { user, isAuthor, isAdmin, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Helper for 2-letter initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleEditOpen = () => {
    setEditName(user?.name || '');
    setEditBio(user?.bio || '');
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!editName.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile({ name: editName.trim(), bio: editBio.trim() });
      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setErrorMsg(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Format creation date
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'August 2026';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between animate-in fade-in">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Profile Card */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col sm:flex-row items-start gap-6 sm:gap-8 relative overflow-hidden">
        {/* Large Initials Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1A382B] text-white font-serif text-2xl sm:text-3xl font-bold flex items-center justify-center flex-shrink-0 shadow-md ring-4 ring-[#FAF7F2]">
          {getInitials(user?.name)}
        </div>

        {/* User Details & Stats */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {user?.name}
                </h1>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    user?.role === 'admin'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : user?.role === 'author'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {user?.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  Member since {joinedDate}
                </span>
              </p>
            </div>

            {/* Edit Profile Button */}
            {!isEditing && (
              <button
                onClick={handleEditOpen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EFECE6] hover:bg-[#E7E2D9] text-stone-800 border border-[#E2DDD3] rounded-xl text-xs font-semibold transition self-start shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            )}
          </div>

          {/* User Bio or Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="p-4 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl space-y-3 animate-in fade-in duration-150">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#EDE8DF] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1A382B]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Bio / Tagline</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share a short bio or editorial background..."
                  className="w-full px-3 py-2 bg-white border border-[#EDE8DF] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] resize-none"
                />
              </div>
              <div className="flex items-center gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-[#1A382B] text-white text-xs font-bold rounded-xl hover:bg-[#11261D] transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed">
              {user?.bio || 'Historian of technology. Former editor at Nature. Coffee enthusiast.'}
            </p>
          )}

          {/* Stats Counters Area */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-4 border-t border-[#F5F2EB]">
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                {isAuthor ? '3' : '12'}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {isAuthor ? 'Articles' : 'Quizzes Taken'}
              </span>
            </div>

            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                {isAuthor ? '1' : '10'}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {isAuthor ? 'Published' : 'Passed'}
              </span>
            </div>

            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                {isAuthor ? '3,104' : '92%'}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {isAuthor ? 'Total Views' : 'Avg. Score'}
              </span>
            </div>

            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                {isAuthor ? '198' : '240'}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {isAuthor ? 'Total Likes' : 'Total Points'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Publications / Articles Section */}
      {isAuthor ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              My Articles
            </h2>
            <Link
              to="/write"
              className="flex items-center gap-1.5 text-xs font-bold text-[#1A382B] hover:underline"
            >
              <PlusCircle className="w-4 h-4" /> New Article
            </Link>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-[#EDE8DF] rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    The Night the Internet Was Born — and Almost Wasn't
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Published
                  </span>
                </div>
                <p className="text-xs text-stone-500">Technology • 6 min read • 3,104 views • 198 likes</p>
              </div>
              <Link to="/browse" className="p-2 text-stone-400 hover:text-stone-700">
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white border border-[#EDE8DF] rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    The Forgotten History of the Mechanical Computer
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    In Review
                  </span>
                </div>
                <p className="text-xs text-stone-500">History • 7 min read • Submitted 2 days ago</p>
              </div>
              <Link to="/write" className="p-2 text-stone-400 hover:text-stone-700">
                <Edit3 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Quiz Activity & History
            </h2>
          </div>

          <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs divide-y divide-[#F5F2EB]">
            <div className="py-3 flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-stone-900 block text-sm">
                  CRISPR & Molecular Biology Assessment
                </span>
                <span className="text-stone-500">Completed on August 2026</span>
              </div>
              <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Score: 20 / 20 (100%)
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-stone-900 block text-sm">
                  ARPANET & Internet History Assessment
                </span>
                <span className="text-stone-500">Completed on August 2026</span>
              </div>
              <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Score: 10 / 10 (100%)
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Profile;
