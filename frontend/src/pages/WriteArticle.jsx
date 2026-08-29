import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleAPI } from '../services/api';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';

const WriteArticle = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  // Add tag
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

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Allow Enter to add tag
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Validate article
  const validateArticle = () => {
    if (!title.trim()) {
      setErrorMsg('Article title is required.');
      return false;
    }

    if (!category.trim()) {
      setErrorMsg('Please select a category.');
      return false;
    }

    if (!content.trim()) {
      setErrorMsg('Article content is required.');
      return false;
    }

    return true;
  };

  // Save draft
  const handleSaveDraft = async () => {
    setErrorMsg('');

    if (!validateArticle()) return;

    setSaving(true);

    try {
      const response = await articleAPI.createArticle({
        title: title.trim(),
        category: category.trim(),
        tags,
        content: content.trim(),
        quiz: {
          enabled: false,
        },
        status: 'draft',
      });

      if (response.data.success) {
        navigate('/profile');
      } else {
        setErrorMsg(
          response.data.message || 'Failed to save article draft.'
        );
      }
    } catch (error) {
      console.error('[Save Draft Error]:', error);

      setErrorMsg(
        error.response?.data?.message ||
          'Failed to save article draft. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Submit article
  const handleSubmit = async () => {
    setErrorMsg('');

    if (!validateArticle()) return;

    setSubmitting(true);

    try {
      /*
       * First create the article as a draft.
       */
      const createResponse = await articleAPI.createArticle({
        title: title.trim(),
        category: category.trim(),
        tags,
        content: content.trim(),
        quiz: {
          enabled: false,
        },
        status: 'draft',
      });

      if (!createResponse.data.success) {
        setErrorMsg(
          createResponse.data.message ||
            'Failed to create article.'
        );
        return;
      }

      const articleId = createResponse.data.article._id;

      /*
       * Then submit the newly created article
       * for admin review.
       */
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
          Write an Article
        </h1>

        <p className="text-sm text-stone-500 mt-2">
          Share your knowledge and ideas with the Lumen community.
        </p>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Form */}
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
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-stone-900 mb-2">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B]"
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Culture">Culture</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
            <option value="Other">Other</option>
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
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#1A382B]"
            />

            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-3 bg-[#EFECE6] border border-[#E2DDD3] rounded-xl text-stone-800 hover:bg-[#E7E2D9]"
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

                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-stone-900 mb-2">
            Article Content
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here..."
            rows={18}
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-sm text-stone-900 leading-relaxed focus:outline-none focus:border-[#1A382B] resize-y"
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

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[#F5F2EB]">

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || submitting}
            className="inline-flex justify-center items-center gap-2 px-5 py-3 bg-[#EFECE6] hover:bg-[#E7E2D9] text-stone-800 border border-[#E2DDD3] rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />

            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || submitting}
            className="inline-flex justify-center items-center gap-2 px-5 py-3 bg-[#1A382B] hover:bg-[#11261D] text-white rounded-xl text-sm font-bold disabled:opacity-50"
          >
            <Send className="w-4 h-4" />

            {submitting ? 'Submitting...' : 'Publish Article'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default WriteArticle;