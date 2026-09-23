import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  FileText,
  BookOpen,
  Search,
  Eye,
  Ban,
  Check,
  Clock3,
  Activity,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

const initialModerationItems = [
  {
    id: 1,
    title: 'Understanding Modern Web Development',
    type: 'Article',
    author: 'John Mathew',
    riskScore: 12,
    status: 'safe',
    reason: 'No issues detected',
    reported: false,
  },
  {
    id: 2,
    title: 'Advanced JavaScript Techniques',
    type: 'Article',
    author: 'David Wilson',
    riskScore: 67,
    status: 'review',
    reason: 'Content requires manual review',
    reported: true,
  },
  {
    id: 3,
    title: 'Introduction to Cyber Security',
    type: 'Article',
    author: 'Sarah Thomas',
    riskScore: 91,
    status: 'blocked',
    reason: 'Policy violation',
    reported: true,
  },
  {
    id: 4,
    title: 'Python Programming Basics',
    type: 'Quiz',
    author: 'Alex Kumar',
    riskScore: 24,
    status: 'safe',
    reason: 'No issues detected',
    reported: false,
  },
  {
    id: 5,
    title: 'Social Media and Digital Safety',
    type: 'Article',
    author: 'Priya Shah',
    riskScore: 58,
    status: 'review',
    reason: 'Reported by a user',
    reported: true,
  },
  {
    id: 6,
    title: 'Database Security Fundamentals',
    type: 'Quiz',
    author: 'Rahul Patil',
    riskScore: 76,
    status: 'review',
    reason: 'High-risk content detected',
    reported: false,
  },
  {
    id: 7,
    title: 'Data Structures and Algorithms',
    type: 'Article',
    author: 'Neha Joshi',
    riskScore: 8,
    status: 'safe',
    reason: 'No issues detected',
    reported: false,
  },
  {
    id: 8,
    title: 'Ethical Hacking Overview',
    type: 'Article',
    author: 'Amit Kumar',
    riskScore: 88,
    status: 'blocked',
    reason: 'Content policy violation',
    reported: true,
  },
];

const initialActivity = [
  {
    id: 1,
    text: 'Article approved',
    user: 'John Mathew',
    time: '2 min ago',
    type: 'approved',
  },
  {
    id: 2,
    text: 'Content flagged for review',
    user: 'David Wilson',
    time: '8 min ago',
    type: 'review',
  },
  {
    id: 3,
    text: 'Report submitted',
    user: 'Sarah Thomas',
    time: '15 min ago',
    type: 'report',
  },
  {
    id: 4,
    text: 'Content blocked',
    user: 'Amit Kumar',
    time: '32 min ago',
    type: 'blocked',
  },
];

const AIModerationDashboard = () => {
  const { token, isAdmin } = useAuth();
  const [items, setItems] = useState(initialModerationItems);
  const [activities, setActivities] = useState(initialActivity);

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState('');
  const [reportFilter, setReportFilter] = useState('all');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [selectedItem, setSelectedItem] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [showReportsOnly, setShowReportsOnly] = useState(false);

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      setReportsError('');

      if (!token) {
        setReportsError('Authentication token not found.');
        return;
      }

      const response = await axios.get(
        'http://localhost:5000/api/reports',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        setReports(response.data.reports || []);
      } else {
        setReportsError(
          response.data?.message || 'Failed to load reports.'
        );
      }
    } catch (error) {
      console.error('Fetch reports error:', error);
      setReportsError(
        error.response?.data?.message ||
          'Failed to load reports.'
      );
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchReports();
    }
  }, [token, isAdmin]);

const updateReportStatus = async (reportId, status) => {
  try {
    setReportsError('');

    if (!token) {
      setReportsError('Authentication token not found.');
      return;
    }

    const response = await axios.patch(
      `http://localhost:5000/api/reports/${reportId}/status`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data?.success) {
      setReports((prev) =>
        prev.map((report) =>
          report._id === reportId
            ? {
                ...report,
                status,
              }
            : report
        )
      );

      setSuccessMessage(
        status === 'resolved'
          ? 'Report resolved successfully.'
          : 'Report dismissed successfully.'
      );

      setActivities((prev) => [
        {
          id: Date.now(),
          text:
            status === 'resolved'
              ? 'Report resolved'
              : 'Report dismissed',
          user:
            response.data.report?.reportedBy ||
            'Admin',
          time: 'Just now',
          type:
            status === 'resolved'
              ? 'approved'
              : 'report',
        },
        ...prev,
      ]);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  } catch (error) {
    console.error(
      'Update report status error:',
      error
    );

    setReportsError(
      error.response?.data?.message ||
        'Failed to update report status.'
    );
  }
};

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalModerated = items.length;

  const safeCount = items.filter(
    (item) => item.status === 'safe'
  ).length;

  const reviewCount = items.filter(
    (item) => item.status === 'review'
  ).length;

  const blockedCount = items.filter(
    (item) => item.status === 'blocked'
  ).length;

  const reportedCount = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === 'pending'
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === 'resolved'
  ).length;

  const dismissedReports = reports.filter(
    (report) => report.status === 'dismissed'
  ).length;

  const safePercentage =
    totalModerated > 0
      ? Math.round((safeCount / totalModerated) * 100)
      : 0;

  const reviewPercentage =
    totalModerated > 0
      ? Math.round((reviewCount / totalModerated) * 100)
      : 0;

  const blockedPercentage =
    totalModerated > 0
      ? Math.round((blockedCount / totalModerated) * 100)
      : 0;

  // ==========================================
  // FILTERING
  // ==========================================

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(searchValue) ||
        item.author.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === 'all' ||
        item.status === statusFilter;

      const matchesType =
        typeFilter === 'all' ||
        item.type === typeFilter;

      let matchesRisk = true;

      if (riskFilter === 'low') {
        matchesRisk = item.riskScore < 40;
      }

      if (riskFilter === 'medium') {
        matchesRisk =
          item.riskScore >= 40 &&
          item.riskScore < 70;
      }

      if (riskFilter === 'high') {
        matchesRisk = item.riskScore >= 70;
      }

      const matchesReports =
        !showReportsOnly || item.reported;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesRisk &&
        matchesReports
      );
    });
  }, [
    items,
    search,
    statusFilter,
    riskFilter,
    typeFilter,
    showReportsOnly,
  ]);

  // ==========================================
  // ACTIONS
  // ==========================================

  const updateModerationStatus = (id, status) => {
    const selected = items.find(
      (item) => item.id === id
    );

    if (!selected) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              reported: false,
            }
          : item
      )
    );

    const activityText =
      status === 'safe'
        ? 'Content approved'
        : 'Content blocked';

    setActivities((prev) => [
      {
        id: Date.now(),
        text: activityText,
        user: selected.author,
        time: 'Just now',
        type:
          status === 'safe'
            ? 'approved'
            : 'blocked',
      },
      ...prev,
    ]);

    setSelectedItem(null);

    setSuccessMessage(
      status === 'safe'
        ? 'Content approved successfully.'
        : 'Content blocked successfully.'
    );

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setRiskFilter('all');
    setTypeFilter('all');
    setShowReportsOnly(false);
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getRiskLabel = (score) => {
    if (score < 40) return 'Safe';
    if (score < 70) return 'Needs Review';
    return 'High Risk';
  };

  const getRiskStyle = (score) => {
    if (score < 40) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }

    if (score < 70) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }

    return 'bg-rose-50 text-rose-800 border-rose-200';
  };

  const getRiskBarStyle = (score) => {
    if (score < 40) {
      return 'bg-emerald-500';
    }

    if (score < 70) {
      return 'bg-amber-500';
    }

    return 'bg-rose-500';
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'safe':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';

      case 'review':
        return 'bg-amber-50 text-amber-800 border-amber-200';

      case 'blocked':
        return 'bg-rose-50 text-rose-800 border-rose-200';

      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'safe':
        return 'Safe';

      case 'review':
        return 'Needs Review';

      case 'blocked':
        return 'Blocked';

      default:
        return status;
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">

        <div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI Moderation
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Moderation Dashboard
          </h2>

          <p className="text-xs text-stone-500 mt-1">
            Monitor content risk, reports and moderation activity.
          </p>

        </div>

        <button
          onClick={async () => {
            await fetchReports();

            setSuccessMessage(
              'Moderation data refreshed.'
            );

            setTimeout(() => {
              setSuccessMessage('');
            }, 2500);
          }}
          className="self-start inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EDE8DF] hover:bg-[#FAF7F2] text-stone-700 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>

      </div>

      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-5 xl:grid-cols-5 gap-4">

        <ModerationStatCard
          label="Total Moderated"
          value={totalModerated}
          description="All reviewed content"
          icon={Activity}
        />

        <ModerationStatCard
          label="Safe Content"
          value={safeCount}
          description={`${safePercentage}% of content`}
          icon={CheckCircle2}
          iconClass="text-emerald-600"
        />

        <ModerationStatCard
          label="Needs Review"
          value={reviewCount}
          description={`${reviewPercentage}% of content`}
          icon={Clock3}
          iconClass="text-amber-600"
        />

        <ModerationStatCard
          label="Blocked"
          value={blockedCount}
          description={`${blockedPercentage}% of content`}
          icon={Ban}
          iconClass="text-rose-600"
        />

        <ModerationStatCard
          label="Reports"
          value={reportedCount}
          description="Reported content"
          icon={Flag}
          iconClass="text-purple-600"
        />

      </div>

      {/* SUMMARY */}

      <div className="grid lg:grid-cols-2 gap-5">

        {/* MODERATION SUMMARY */}

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Moderation Summary
              </h3>

              <p className="text-[11px] text-stone-500 mt-1">
                Current distribution of moderated content.
              </p>
            </div>

            <BarChart3 className="w-5 h-5 text-stone-400" />

          </div>

          <ModerationProgress
            label="Safe Content"
            value={safeCount}
            total={totalModerated}
            percentage={safePercentage}
            barClass="bg-emerald-500"
            valueClass="text-emerald-600"
          />

          <ModerationProgress
            label="Needs Review"
            value={reviewCount}
            total={totalModerated}
            percentage={reviewPercentage}
            barClass="bg-amber-500"
            valueClass="text-amber-600"
          />

          <ModerationProgress
            label="Blocked"
            value={blockedCount}
            total={totalModerated}
            percentage={blockedPercentage}
            barClass="bg-rose-500"
            valueClass="text-rose-600"
          />

        </div>

        {/* REPORT SUMMARY */}

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Report Summary
              </h3>

              <p className="text-[11px] text-stone-500 mt-1">
                Content requiring administrative attention.
              </p>
            </div>

            <Flag className="w-5 h-5 text-stone-400" />

          </div>

          <div className="grid grid-cols-2 gap-3">

            <SummaryBox
              label="Reported"
              value={reportedCount}
              icon={Flag}
              className="text-purple-700 bg-purple-50 border-purple-100"
            />

            <SummaryBox
              label="Needs Review"
              value={reviewCount}
              icon={AlertTriangle}
              className="text-amber-700 bg-amber-50 border-amber-100"
            />

            <SummaryBox
              label="High Risk"
              value={
                items.filter(
                  (item) => item.riskScore >= 70
                ).length
              }
              icon={ShieldCheck}
              className="text-rose-700 bg-rose-50 border-rose-100"
            />

            <SummaryBox
              label="Safe"
              value={safeCount}
              icon={CheckCircle2}
              className="text-emerald-700 bg-emerald-50 border-emerald-100"
            />

          </div>

          <button
            onClick={() => {
              document.getElementById('reports-section') ?.scrollIntoView({behavior: 'smooth',});
            }}
            className="w-full mt-4 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F3EEE5] border border-[#EDE8DF] rounded-xl text-xs font-semibold text-[#1A382B] transition"
          >
            View Reported Content
          </button>

        </div>

      </div>

      {/* MODERATION QUEUE */}

      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-5 sm:p-7">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

          <div>

            <h3 className="font-serif text-xl font-bold text-stone-900">
              Moderation Queue
            </h3>

            <p className="text-[11px] text-stone-500 mt-1">
              Review content based on risk scores and reports.
            </p>

          </div>

          <div className="text-xs text-stone-500">
            {filteredItems.length} item
            {filteredItems.length !== 1 ? 's' : ''}
          </div>

        </div>

        {/* FILTERS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 mb-6">

          <div className="relative xl:col-span-2">

            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search content or author..."
              className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs focus:outline-none focus:border-[#1A382B]"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="safe">Safe</option>
            <option value="review">Needs Review</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) =>
              setRiskFilter(e.target.value)
            }
            className="px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="Article">Articles</option>
            <option value="Quiz">Quizzes</option>
          </select>

        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">

          <button
            onClick={() =>
              setShowReportsOnly(!showReportsOnly)
            }
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
              showReportsOnly
                ? 'bg-purple-50 border-purple-200 text-purple-800'
                : 'bg-white border-[#EDE8DF] text-stone-600 hover:bg-[#FAF7F2]'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            Reported Only
          </button>

          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-[#FAF7F2]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>

        </div>

        {/* TABLE */}

        {filteredItems.length === 0 ? (

          <div className="py-12 text-center">

            <ShieldCheck className="w-8 h-8 mx-auto text-stone-300 mb-3" />

            <p className="text-sm font-semibold text-stone-600">
              No moderation items found.
            </p>

            <p className="text-xs text-stone-400 mt-1">
              Try changing your filters.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead>

                <tr className="border-b border-[#F5F2EB] text-stone-500">

                  <th className="pb-3 pl-2">
                    Content
                  </th>

                  <th className="pb-3">
                    Type
                  </th>

                  <th className="pb-3">
                    Risk Score
                  </th>

                  <th className="pb-3">
                    Status
                  </th>

                  <th className="pb-3">
                    Report
                  </th>

                  <th className="pb-3 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[#F5F2EB]">

                {filteredItems.map((item) => (

                  <tr
                    key={item.id}
                    className="hover:bg-[#FAF7F2]/60"
                  >

                    <td className="py-4 pl-2">

                      <div className="max-w-xs">

                        <span className="block font-bold text-stone-900 line-clamp-1">
                          {item.title}
                        </span>

                        <span className="block text-[10px] text-stone-400 mt-1">
                          {item.author}
                        </span>

                      </div>

                    </td>

                    <td className="py-4">

                      <div className="inline-flex items-center gap-1.5 text-stone-600">

                        {item.type === 'Article' ? (
                          <FileText className="w-3.5 h-3.5" />
                        ) : (
                          <BookOpen className="w-3.5 h-3.5" />
                        )}

                        {item.type}

                      </div>

                    </td>

                    <td className="py-4">

                      <div className="min-w-[120px]">

                        <div className="flex items-center justify-between mb-1">

                          <span className="font-bold text-stone-800">
                            {item.riskScore}
                          </span>

                          <span
                            className={`text-[9px] font-bold`}
                          >
                            {getRiskLabel(
                              item.riskScore
                            )}
                          </span>

                        </div>

                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">

                          <div
                            className={`h-full rounded-full ${getRiskBarStyle(
                              item.riskScore
                            )}`}
                            style={{
                              width: `${item.riskScore}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>

                    <td className="py-4">

                      <span
                        className={`inline-flex px-2 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>

                    </td>

                    <td className="py-4">

                      {item.reported ? (

                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-[9px] font-bold">
                          <Flag className="w-3 h-3" />
                          Reported
                        </span>

                      ) : (

                        <span className="text-stone-400 text-[10px]">
                          None
                        </span>

                      )}

                    </td>

                    <td className="py-4 text-right">

                      <button
                        onClick={() =>
                          setSelectedItem(item)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-600 hover:text-[#1A382B] hover:bg-[#FAF7F2] font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* USER REPORTS */}

      <div
        id="reports-section"
        className="bg-white border border-[#EDE8DF] rounded-3xl p-5 sm:p-7"
      >

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              User Reports
            </h3>

            <p className="text-[11px] text-stone-500 mt-1">
              Review reports submitted by users and manage their status.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <select
              value={reportFilter}
              onChange={(e) =>
                setReportFilter(e.target.value)
              }
              className="px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs focus:outline-none"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>

            <button
              onClick={fetchReports}
              className="inline-flex items-center gap-2 px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#F3EEE5]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>

          </div>

        </div>

        {/* REPORT SUMMARY */}

        <div className="grid grid-cols-3 gap-3 mb-6">

          <SummaryBox
            label="Pending"
            value={pendingReports}
            icon={Clock3}
            className="text-amber-700 bg-amber-50 border-amber-100"
          />

          <SummaryBox
            label="Resolved"
            value={resolvedReports}
            icon={CheckCircle2}
            className="text-emerald-700 bg-emerald-50 border-emerald-100"
          />

          <SummaryBox
            label="Dismissed"
            value={dismissedReports}
            icon={XCircle}
            className="text-stone-600 bg-stone-50 border-stone-200"
          />

        </div>

        {/* ERROR */}

        {reportsError && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
            {reportsError}
          </div>
        )}

        {/* LOADING */}

        {reportsLoading ? (

          <div className="py-12 text-center">

            <RefreshCw className="w-7 h-7 mx-auto text-stone-300 animate-spin mb-3" />

            <p className="text-xs text-stone-500">
              Loading reports...
            </p>

          </div>

        ) : ((() => {
          const filteredReports =
          reportFilter === 'all'
          ? reports
          : reports.filter(
            (report) =>
              report.status === reportFilter
          );

          if (filteredReports.length === 0) {
            return (
              <div className="py-12 text-center">

                <Flag className="w-8 h-8 mx-auto text-stone-300 mb-3" />

                <p className="text-sm font-semibold text-stone-600">
                  No reports found.
                </p>

                <p className="text-xs text-stone-400 mt-1">
                  There are no reports matching the selected filter.
                </p>

              </div>
            );
          }

          return (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead>

                  <tr className="border-b border-[#F5F2EB] text-stone-500">

                    <th className="pb-3 pl-2">
                      Report
                    </th>

                    <th className="pb-3">
                      Type
                    </th>

                    <th className="pb-3">
                      Reported By
                    </th>

                    <th className="pb-3">
                      Reason
                    </th>

                    <th className="pb-3">
                      Status
                    </th>

                    <th className="pb-3 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-[#F5F2EB]">

                  {filteredReports.map((report) => (

                    <tr
                      key={report._id}
                      className="hover:bg-[#FAF7F2]/60"
                    >

                      <td className="py-4 pl-2">

                        <div className="max-w-xs">

                          <span className="block font-bold text-stone-900 line-clamp-1">
                            {report.item}
                          </span>

                          {report.description && (
                            <span className="block text-[10px] text-stone-400 mt-1 line-clamp-1">
                              {report.description}
                            </span>
                          )}

                        </div>

                      </td>

                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-stone-600">
                          {report.type === 'Article' ? (
                            <FileText className="w-3.5 h-3.5" />
                          ) : (
                            <Flag className="w-3.5 h-3.5" />
                          )}
                          {report.type}
                        </span>
                      </td>

                      <td className="py-4">
                        <span className="text-stone-700 font-medium">
                          {report.reportedBy}
                        </span>
                      </td>

                      <td className="py-4">
                        <span className="text-stone-600">
                          {report.reason}
                        </span>
                      </td>

                      <td className="py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-wide ${
                            report.status === 'pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : report.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>

                      <td className="py-4 text-right">

                        <div className="inline-flex items-center gap-2">
                          {report.status === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  updateReportStatus(
                                    report._id,
                                    'resolved'
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Resolve
                              </button>

                              <button
                                onClick={() =>
                                  updateReportStatus(
                                    report._id,
                                    'dismissed'
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 font-semibold hover:bg-stone-100"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Dismiss
                              </button>
                            </>    
                          )}
                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          );

        })()
        )}

      </div>

      {/* RECENT MODERATION ACTIVITY */}

      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h3 className="font-serif text-lg font-bold text-stone-900">
              Recent Moderation Activity
            </h3>

            <p className="text-[11px] text-stone-500 mt-1">
              Latest moderation actions on the platform.
            </p>

          </div>

          <Activity className="w-5 h-5 text-stone-400" />

        </div>

        <div className="space-y-1">

          {activities.slice(0, 6).map((activity) => (

            <div
              key={activity.id}
              className="flex items-center gap-3 py-3 border-b border-[#F5F2EB] last:border-0"
            >

              <ActivityIcon type={activity.type} />

              <div className="flex-1 min-w-0">

                <p className="text-xs font-semibold text-stone-800">
                  {activity.text}
                </p>

                <p className="text-[10px] text-stone-400 mt-0.5">
                  {activity.user}
                </p>

              </div>

              <span className="text-[10px] text-stone-400">
                {activity.time}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* VIEW / REVIEW MODAL */}

      {selectedItem && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-white border border-[#EDE8DF] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">

            {/* MODAL HEADER */}

            <div className="shrink-0 bg-white border-b border-[#EDE8DF] px-6 py-4 flex items-center justify-between">

              <div>

                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                  {selectedItem.type}
                </span>

                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {selectedItem.title}
                </h3>

              </div>

              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="text-stone-400 hover:text-stone-700"
              >
                <XCircle className="w-5 h-5" />
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="p-6 space-y-5 overflow-y-auto">

              <div className="grid sm:grid-cols-3 gap-3">

                <ModerationInfoBox
                  label="Author"
                  value={selectedItem.author}
                />

                <ModerationInfoBox
                  label="Risk Score"
                  value={`${selectedItem.riskScore} / 100`}
                />

                <ModerationInfoBox
                  label="Status"
                  value={getStatusLabel(
                    selectedItem.status
                  )}
                />

              </div>

              {/* RISK SCORE */}

              <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-5">

                <div className="flex items-center justify-between mb-2">

                  <div>

                    <h4 className="font-serif font-bold text-stone-900">
                      Risk Assessment
                    </h4>

                    <p className="text-[10px] text-stone-500 mt-1">
                      Current moderation risk score.
                    </p>

                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${getRiskStyle(
                      selectedItem.riskScore
                    )}`}
                  >
                    {getRiskLabel(
                      selectedItem.riskScore
                    )}
                  </span>

                </div>

                <div className="flex items-center gap-3 mt-4">

                  <div className="flex-1 h-3 bg-white border border-[#EDE8DF] rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full ${getRiskBarStyle(
                        selectedItem.riskScore
                      )}`}
                      style={{
                        width: `${selectedItem.riskScore}%`,
                      }}
                    />

                  </div>

                  <span className="font-serif font-bold text-stone-900">
                    {selectedItem.riskScore}
                  </span>

                </div>

              </div>

              {/* REPORT */}

              <div>

                <h4 className="font-serif font-bold text-stone-900 mb-2">
                  Moderation Details
                </h4>

                <div className="bg-white border border-[#EDE8DF] rounded-2xl p-4">

                  <div className="flex items-start gap-3">

                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">

                      <AlertTriangle className="w-4 h-4 text-amber-700" />

                    </div>

                    <div>

                      <p className="text-xs font-semibold text-stone-800">
                        Review Reason
                      </p>

                      <p className="text-xs text-stone-500 mt-1">
                        {selectedItem.reason}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* REPORT STATUS */}

              <div className="flex items-center justify-between p-4 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl">

                <div className="flex items-center gap-3">

                  <Flag className="w-4 h-4 text-purple-600" />

                  <div>

                    <p className="text-xs font-semibold text-stone-800">
                      User Report
                    </p>

                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {selectedItem.reported
                        ? 'This content has been reported.'
                        : 'No active user report.'}
                    </p>

                  </div>

                </div>

                <span
                  className={`text-[10px] font-bold ${
                    selectedItem.reported
                      ? 'text-purple-700'
                      : 'text-stone-400'
                  }`}
                >
                  {selectedItem.reported
                    ? 'REPORTED'
                    : 'NONE'}
                </span>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="shrink-0 border-t border-[#EDE8DF] px-6 py-4 flex flex-col sm:flex-row justify-end gap-2">

              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Close
              </button>

              {selectedItem.status !== 'blocked' && (

                <button
                  onClick={() =>
                    updateModerationStatus(
                      selectedItem.id,
                      'blocked'
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold"
                >
                  <Ban className="w-4 h-4" />
                  Block
                </button>

              )}

              {selectedItem.status !== 'safe' && (

                <button
                  onClick={() =>
                    updateModerationStatus(
                      selectedItem.id,
                      'safe'
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

// ==========================================
// SMALL COMPONENTS
// ==========================================

const ModerationStatCard = ({
  label,
  value,
  description,
  icon: Icon,
  iconClass = 'text-stone-400',
}) => (
  <div className="bg-white border border-[#EDE8DF] rounded-3xl p-5">

    <div className="flex items-center justify-between">

      <span className="text-xs font-medium text-stone-500">
        {label}
      </span>

      <Icon className={`w-4 h-4 ${iconClass}`} />

    </div>

    <p className="font-serif text-2xl font-bold text-stone-900 mt-2">
      {value}
    </p>

    <span className="text-[10px] text-stone-400">
      {description}
    </span>

  </div>
);

const ModerationProgress = ({
  label,
  value,
  total,
  percentage,
  barClass,
  valueClass,
}) => (
  <div className="mb-5 last:mb-0">

    <div className="flex items-center justify-between mb-2">

      <span className="text-xs font-semibold text-stone-700">
        {label}
      </span>

      <span className={`text-xs font-bold ${valueClass}`}>
        {value}
      </span>

    </div>

    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">

      <div
        className={`h-full rounded-full ${barClass}`}
        style={{
          width: `${percentage}%`,
        }}
      />

    </div>

    <div className="text-[9px] text-stone-400 mt-1">
      {percentage}% of moderated content
    </div>

  </div>
);

const SummaryBox = ({
  label,
  value,
  icon: Icon,
  className,
}) => (
  <div
    className={`border rounded-2xl p-4 ${className}`}
  >

    <div className="flex items-center justify-between">

      <span className="text-[10px] font-bold">
        {label}
      </span>

      <Icon className="w-4 h-4" />

    </div>

    <p className="font-serif text-xl font-bold mt-2">
      {value}
    </p>

  </div>
);

const ModerationInfoBox = ({
  label,
  value,
}) => (
  <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3">

    <span className="block text-[10px] text-stone-400 uppercase tracking-wider font-bold">
      {label}
    </span>

    <span className="block text-xs font-semibold text-stone-800 mt-1">
      {value}
    </span>

  </div>
);

const ActivityIcon = ({ type }) => {

  if (type === 'approved') {
    return (
      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      </div>
    );
  }

  if (type === 'blocked') {
    return (
      <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
        <Ban className="w-4 h-4 text-rose-600" />
      </div>
    );
  }

  if (type === 'report') {
    return (
      <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
        <Flag className="w-4 h-4 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
      <AlertTriangle className="w-4 h-4 text-amber-600" />
    </div>
  );
};

export default AIModerationDashboard;