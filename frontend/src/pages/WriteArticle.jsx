import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleAPI } from '../services/api';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  X,
  AlertCircle,
  Video,
} from 'lucide-react';

const WriteArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const [articleStatus, setArticleStatus] = useState('draft');

  const [loadingArticle, setLoadingArticle] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --------------------------------------------------
  // Fetch article when editing
  // --------------------------------------------------

  useEffect(() => {
    if (isEditMode) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setLoadingArticle(true);
    setErrorMsg('');

    try {
      const response = await articleAPI.getMyArticleById(id);

      if (response.data.success) {
        const article = response.data.article;

        setTitle(article.title || '');
        setCategory(article.category || '');
        setContent(article.content || '');
        setVideoUrl(article.videoUrl || '');
        setTags(article.tags || []);
        setArticleStatus(article.status || 'draft');
      } else {
        setErrorMsg(
          response.data.message || 'Failed to load article.'
        );
      }
    } catch (error) {
      console.error('[Load Article Error]:', error);

      setErrorMsg(
        error.response?.data?.message ||
          'Failed to load article. Please try again.'
      );
    } finally {
      setLoadingArticle(false);
    }
  };

  // --------------------------------------------------
  // Add tag
  // --------------------------------------------------

  const handleAddTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (tags.includes(tag)) {
      setTagInput('');
      return;
    }

    setTags([...tags, tag]);
    setTagInput('');
  };

  // --------------------------------------------------
  // Remove tag
  // --------------------------------------------------

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // --------------------------------------------------
  // Enter to add tag
  // --------------------------------------------------

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // --------------------------------------------------
  // Check whether article is complete
  // --------------------------------------------------

  const isArticleComplete =
    title.trim() &&
    category.trim() &&
    tags.length > 0 &&
    content.trim();

  // --------------------------------------------------
  // Validate article
  // --------------------------------------------------

  const validateArticle = () => {
    if (!title.trim()) {
      setErrorMsg('Article title is required.');
      return false;
    }

    if (!category.trim()) {
      setErrorMsg('Please select a category.');
      return false;
    }

    if (tags.length === 0) {
      setErrorMsg('Please add at least one tag.');
      return false;
    }

    if (!content.trim()) {
      setErrorMsg('Article content is required.');
      return false;
    }

    return true;
  };

  // --------------------------------------------------
  // Article data
  // --------------------------------------------------

  const getArticleData = () => ({
    title: title.trim(),
    category: category.trim(),
    tags,
    content: content.trim(),
    videoUrl: videoUrl.trim(),
    quiz: {
      enabled: false,
    },
  });

  // --------------------------------------------------
  // Save article
  // --------------------------------------------------

  const handleSaveDraft = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateArticle()) return;

    setSaving(true);

    try {
      const articleData = getArticleData();

      let response;

      if (isEditMode) {
        response = await articleAPI.updateArticle(
          id,
          articleData
        );
      } else {
        response = await articleAPI.createArticle({
          ...articleData,
          status: 'draft',
        });
      }

      if (response.data.success) {
        navigate('/profile');
      } else {
        setErrorMsg(
          response.data.message ||
            'Failed to save article.'
        );
      }
    } catch (error) {
      console.error('[Save Article Error]:', error);

      setErrorMsg(
        error.response?.data?.message ||
          'Failed to save article. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Submit article
  // --------------------------------------------------

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateArticle()) return;

    setSubmitting(true);

    try {
      const articleData = getArticleData();

      let articleId = id;

      // Create first if this is a new article
      if (!isEditMode) {
        const createResponse =
          await articleAPI.createArticle({
            ...articleData,
            status: 'draft',
          });

        if (!createResponse.data.success) {
          setErrorMsg(
            createResponse.data.message ||
              'Failed to create article.'
          );
          return;
        }

        articleId =
          createResponse.data.article._id;
      } else {
        // Update existing article
        const updateResponse =
          await articleAPI.updateArticle(
            articleId,
            articleData
          );

        if (!updateResponse.data.success) {
          setErrorMsg(
            updateResponse.data.message ||
              'Failed to update article.'
          );
          return;
        }
      }

      // Submit for admin review
      const submitResponse =
        await articleAPI.submitArticle(articleId);

      if (submitResponse.data.success) {
        navigate('/article-confirmation');
      } else {
        setErrorMsg(
          submitResponse.data.message ||
            'Article was saved but could not be submitted.'
        );
      }
    } catch (error) {
      console.error('[Submit Article Error]:', error);

      setErrorMsg(
        error.response?.data?.message ||
          'Failed to submit article. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loadingArticle) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-10 text-center">
          <p className="text-sm text-stone-500">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Pending review
  // --------------------------------------------------

  const isPendingReview =
    isEditMode &&
    articleStatus === 'pending_review';

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          {isEditMode
            ? 'Edit Article'
            : 'Write an Article'}
        </h1>

        <p className="text-sm text-stone-500 mt-2">
          {isEditMode
            ? 'Update your article and save your changes.'
            : 'Share your knowledge and ideas with the Lumen community.'}
        </p>

      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Success */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm">
          {successMsg}
        </div>
      )}

      {/* Pending Review */}
      {isPendingReview && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm">
          This article is currently under admin review and cannot
          be edited until the review is completed.
        </div>
      )}

      {/* Article Form */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-stone-900 mb-2">
            Article Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your article title..."
            maxLength={200}
            disabled={isPendingReview}
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] disabled:opacity-60"
          />
        </div>

        {/* Category + Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              disabled={isPendingReview}
              className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] disabled:opacity-60"
            >
              <option value="">
                Select category
              </option>
              <option value="Technology">
                Technology
              </option>
              <option value="Science">
                Science
              </option>
              <option value="History">
                History
              </option>
              <option value="Culture">
                Culture
              </option>
              <option value="Education">
                Education
              </option>
              <option value="Environment">
                Environment
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Tags
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                value={tagInput}
                onChange={(e) =>
                  setTagInput(e.target.value)
                }
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag..."
                disabled={isPendingReview}
                className="flex-1 min-w-0 px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] disabled:opacity-60"
              />

              <button
                type="button"
                onClick={handleAddTag}
                disabled={isPendingReview}
                className="px-4 py-3 bg-[#EFECE6] border border-[#E2DDD3] rounded-xl text-stone-800 hover:bg-[#E7E2D9] disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>

            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">

                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F1EEE8] text-stone-700 rounded-full text-xs"
                  >
                    {tag}

                    {!isPendingReview && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTag(tag)
                        }
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}

              </div>
            )}
          </div>

        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-stone-900 mb-2">
            Article Content
          </label>

          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Write your article here..."
            rows={18}
            disabled={isPendingReview}
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 leading-relaxed focus:outline-none focus:border-[#1A382B] resize-y disabled:opacity-60"
          />

          <div className="flex justify-between mt-2 text-xs text-stone-400">
            <span>
              Average reading time is calculated automatically.
            </span>

            <span>
              {content.trim()
                ? content.trim().split(/\s+/).length
                : 0}{' '}
              words
            </span>
          </div>
        </div>

        {/* Optional Video */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-stone-500" />

            <label className="text-sm font-bold text-stone-900">
              Video <span className="font-normal text-stone-400">(Optional)</span>
            </label>
          </div>

          <input
            type="url"
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(e.target.value)
            }
            placeholder="Paste a YouTube or video URL..."
            disabled={isPendingReview}
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B] disabled:opacity-60"
          />

          <p className="text-xs text-stone-400 mt-2">
            Add a video only if you want to include one with your article.
          </p>
        </div>

      </div>

      {/* Action Buttons - OUTSIDE FORM CARD */}
      {!isPendingReview && (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-5">

          {/* Save */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={
              saving || submitting
            }
            className="inline-flex justify-center items-center gap-2 px-5 py-3 bg-[#EFECE6] hover:bg-[#E7E2D9] text-stone-800 border border-[#E2DDD3] rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />

            {saving
              ? 'Saving...'
              : isEditMode
              ? 'Save Changes'
              : 'Save Draft'}
          </button>

          {/* Publish / Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !isArticleComplete ||
              saving ||
              submitting
            }
            className={`inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition ${
              isArticleComplete
                ? 'bg-[#1A382B] hover:bg-[#11261D] text-white'
                : 'bg-[#DCE5DF] text-[#8B9B92] cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />

            {submitting
              ? 'Submitting...'
              : isEditMode &&
                ['changes_requested', 'rejected'].includes(
                  articleStatus
                )
              ? 'Resubmit Article'
              : 'Publish Article'}
          </button>

        </div>
      )}

    </div>
  );
};

export default WriteArticle;