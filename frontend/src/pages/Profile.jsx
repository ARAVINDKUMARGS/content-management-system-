import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { articleAPI } from '../services/api';
import {
  User,
  Mail,
  Calendar,
  Edit3,
  X,
  PlusCircle,
  Eye,
  Trash2,
  AlertCircle,
  FileText,
} from 'lucide-react';

const Profile = () => {
  const { user, isAuthor, isAdmin, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');

  const [saving, setSaving] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);

  const [articles, setArticles] = useState([]);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // --------------------------------------------------
  // Fetch author's articles
  // --------------------------------------------------

  useEffect(() => {
    if (isAuthor) {
      fetchMyArticles();
    }
  }, [isAuthor]);

  const fetchMyArticles = async () => {
    setLoadingArticles(true);
    setErrorMsg('');

    try {
      const response = await articleAPI.getMyArticles();

      if (response.data.success) {
        setArticles(response.data.articles || []);
      } else {
        setErrorMsg(
          response.data.message || 'Failed to load your articles.'
        );
      }
    } catch (error) {
      console.error('[Profile Articles Error]:', error);

      setErrorMsg(
        error.response?.data?.message ||
          'Failed to load your articles. Please try again.'
      );
    } finally {
      setLoadingArticles(false);
    }
  };

  // --------------------------------------------------
  // Initials
  // --------------------------------------------------

  const getInitials = (name) => {
    if (!name) return 'U';

    const parts = name.trim().split(' ');

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  // --------------------------------------------------
  // Edit profile
  // --------------------------------------------------

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
      const res = await updateProfile({
        name: editName.trim(),
        bio: editBio.trim(),
      });

      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setErrorMsg(
          res.message || 'Failed to update profile.'
        );
      }
    } catch (err) {
      setErrorMsg(
        'Error updating profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Delete article
  // --------------------------------------------------

  const handleDeleteArticle = async (articleId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this article? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const response = await articleAPI.deleteArticle(articleId);

      if (response.data.success) {
        setArticles((prevArticles) =>
          prevArticles.filter(
            (article) => article._id !== articleId
          )
        );

        setSuccessMsg('Article deleted successfully.');
        setErrorMsg('');
      } else {
        setErrorMsg(
          response.data.message || 'Failed to delete article.'
        );
      }
    } catch (error) {
      console.error('[Delete Article Error]:', error);

      setErrorMsg(
        error.response?.data?.message ||
          'Failed to delete article. Please try again.'
      );
    }
  };

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const articleCount = articles.length;

  const publishedCount = articles.filter(
    (article) => article.status === 'published'
  ).length;

  const totalViews = articles.reduce(
    (total, article) => total + (article.views || 0),
    0
  );

  const totalLikes = articles.reduce(
    (total, article) => total + (article.likes || 0),
    0
  );

  // --------------------------------------------------
  // Date
  // --------------------------------------------------

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'August 2026';

  // --------------------------------------------------
  // Status styling
  // --------------------------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';

      case 'pending_review':
        return 'bg-amber-50 text-amber-800 border-amber-200';

      case 'changes_requested':
        return 'bg-orange-50 text-orange-800 border-orange-200';

      case 'rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200';

      case 'draft':
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending_review':
        return 'In Review';

      case 'changes_requested':
        return 'Changes Requested';

      case 'published':
        return 'Published';

      case 'rejected':
        return 'Rejected';

      case 'draft':
      default:
        return 'Draft';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between">
          <span>{successMsg}</span>

          <button
            onClick={() => setSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* Profile Card */}
      {/* ------------------------------------------------ */}

      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col sm:flex-row items-start gap-6 sm:gap-8 relative overflow-hidden">

        {/* Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1A382B] text-white font-serif text-2xl sm:text-3xl font-bold flex items-center justify-center flex-shrink-0 shadow-md ring-4 ring-[#FAF7F2]">
          {getInitials(user?.name)}
        </div>

        <div className="flex-1 space-y-4 w-full">

          {/* Name / Role */}
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

          {/* Bio / Edit */}
          {isEditing ? (
            <form
              onSubmit={handleSaveProfile}
              className="p-4 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl space-y-3"
            >

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white border border-[#EDE8DF] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1A382B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Bio / Tagline
                </label>

                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) =>
                    setEditBio(e.target.value)
                  }
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
                  className="px-4 py-1.5 bg-[#1A382B] text-white text-xs font-bold rounded-xl hover:bg-[#11261D] transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

              </div>
            </form>
          ) : (
            <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed">
              {user?.bio || 'No bio added yet.'}
            </p>
          )}

          {/* ------------------------------------------------ */}
          {/* Dynamic Author Statistics */}
          {/* ------------------------------------------------ */}

          {isAuthor && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-4 border-t border-[#F5F2EB]">

              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                  {loadingArticles ? '...' : articleCount}
                </span>

                <span className="text-xs text-stone-500 font-medium">
                  Articles
                </span>
              </div>

              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                  {loadingArticles ? '...' : publishedCount}
                </span>

                <span className="text-xs text-stone-500 font-medium">
                  Published
                </span>
              </div>

              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                  {loadingArticles ? '...' : totalViews}
                </span>

                <span className="text-xs text-stone-500 font-medium">
                  Total Views
                </span>
              </div>

              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                  {loadingArticles ? '...' : totalLikes}
                </span>

                <span className="text-xs text-stone-500 font-medium">
                  Total Likes
                </span>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* Author Articles */}
      {/* ------------------------------------------------ */}

      {isAuthor && (
        <section className="space-y-4">

          <div className="flex items-center justify-between">

            <h2 className="font-serif text-2xl font-bold text-stone-900">
              My Articles
            </h2>

            <Link
              to="/write"
              className="flex items-center gap-1.5 text-xs font-bold text-[#1A382B] hover:underline"
            >
              <PlusCircle className="w-4 h-4" />
              New Article
            </Link>

          </div>

          {/* Loading */}
          {loadingArticles && (
            <div className="bg-white border border-[#EDE8DF] rounded-2xl p-8 text-center">
              <p className="text-sm text-stone-500">
                Loading your articles...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loadingArticles && articles.length === 0 && (
            <div className="bg-white border border-[#EDE8DF] rounded-2xl p-10 text-center">

              <FileText className="w-10 h-10 mx-auto text-stone-300 mb-3" />

              <h3 className="font-serif text-lg font-bold text-stone-900">
                No articles yet
              </h3>

              <p className="text-sm text-stone-500 mt-1 mb-4">
                Start writing and share your knowledge with the Lumen community.
              </p>

              <Link
                to="/write"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A382B] text-white rounded-xl text-xs font-bold hover:bg-[#11261D]"
              >
                <PlusCircle className="w-4 h-4" />
                Write an Article
              </Link>

            </div>
          )}

          {/* Articles */}
          {!loadingArticles && articles.length > 0 && (
            <div className="space-y-3">

              {articles.map((article) => (

                <div
                  key={article._id}
                  className="bg-white border border-[#EDE8DF] rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4"
                >

                  <div className="space-y-1 min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <h3 className="font-serif font-bold text-stone-900 text-base">
                        {article.title}
                      </h3>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusStyle(
                          article.status
                        )}`}
                      >
                        {getStatusLabel(article.status)}
                      </span>

                    </div>

                    <p className="text-xs text-stone-500">
                      {article.category}
                      {' • '}
                      {article.readingTime || 1} min read
                      {' • '}
                      {article.views || 0} views
                      {' • '}
                      {article.likes || 0} likes
                    </p>

                    {article.status === 'pending_review' && (
                      <p className="text-[11px] text-amber-700">
                        Submitted for admin review
                      </p>
                    )}

                    {article.status === 'changes_requested' &&
                      article.reviewFeedback && (
                        <p className="text-[11px] text-orange-700">
                          Feedback: {article.reviewFeedback}
                        </p>
                      )}

                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">

                    {/* View published article */}
                    {article.status === 'published' && (
                      <button
                        onClick={() => navigate(`/browse/${article._id}`)}
                        className="p-2 text-stone-400 hover:text-stone-700"
                        title="View article"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* Edit - only draft, changes requested and rejected */}
                    {['draft', 'changes_requested', 'rejected'].includes(
                        article.status
                      ) && (
                        <button
                          onClick={() => navigate(`/write/${article._id}`)}
                          className="p-2 text-stone-400 hover:text-stone-700"
                          title="Edit article"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                    {/* Delete - only draft, changes requested and rejected */}
                    {['draft', 'changes_requested', 'rejected'].includes(
                        article.status
                      ) && (
                        <button
                          onClick={() => handleDeleteArticle(article._id)}
                          className="p-2 text-stone-400 hover:text-rose-600"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>
              </div>

              ))}

            </div>
          )}

        </section>
      )}

      {/* ------------------------------------------------ */}
      {/* Reader section */}
      {/* ------------------------------------------------ */}

      {!isAuthor && (
        <section className="space-y-4">

          <div className="flex items-center justify-between">

            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Quiz Activity & History
            </h2>

          </div>

          <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 shadow-xs">

            <p className="text-sm text-stone-500">
              Your quiz activity will appear here.
            </p>

          </div>

        </section>
      )}

    </div>
  );
};

export default Profile;