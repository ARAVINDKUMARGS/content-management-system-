import React, { useMemo, useState } from 'react';
import {
  Flag,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle,
} from 'lucide-react';

const initialReports = [
  {
    id: 1,
    type: 'Article',
    item: 'The Psychology of Success',
    reportedBy: 'Priya Sharma',
    reason: 'Misleading information',
    description:
      'Some of the claims in this article appear to be misleading and should be reviewed.',
    date: 'Sep 05, 2026',
    status: 'pending',
  },
  {
    id: 2,
    type: 'Comment',
    item: 'Comment by Rohan Patil',
    reportedBy: 'Aarav Mehta',
    reason: 'Inappropriate content',
    description:
      'The comment contains language that may violate the platform community guidelines.',
    date: 'Sep 04, 2026',
    status: 'pending',
  },
  {
    id: 3,
    type: 'Article',
    item: 'Understanding Human Behavior',
    reportedBy: 'Neha Joshi',
    reason: 'Incorrect information',
    description:
      'The reported article contains information that the user believes is factually incorrect.',
    date: 'Sep 03, 2026',
    status: 'resolved',
  },
  {
    id: 4,
    type: 'Comment',
    item: 'Comment by Vikram Singh',
    reportedBy: 'Priya Sharma',
    reason: 'Spam',
    description:
      'The reported comment appears to contain repetitive promotional content.',
    date: 'Sep 02, 2026',
    status: 'dismissed',
  },
  {
    id: 5,
    type: 'Article',
    item: 'Technology and Society',
    reportedBy: 'Rohan Patil',
    reason: 'Copyright concern',
    description:
      'The user has reported that some content may have been used without proper attribution.',
    date: 'Sep 01, 2026',
    status: 'pending',
  },
];

const ReportsManagement = () => {
  const [reports, setReports] = useState(initialReports);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        !searchTerm ||
        report.item.toLowerCase().includes(searchTerm) ||
        report.reportedBy.toLowerCase().includes(searchTerm) ||
        report.reason.toLowerCase().includes(searchTerm) ||
        report.type.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === 'all' ||
        report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const handleReportAction = (id, status) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === id
          ? {
              ...report,
              status,
            }
          : report
      )
    );

    setSelectedReport(null);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';

      case 'resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';

      case 'dismissed':
        return 'bg-stone-100 text-stone-600 border-stone-200';

      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Report Management
        </h2>

        <p className="text-xs text-stone-500 mt-1">
          Review reports submitted by users and manage reported content.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total */}
        <div className="bg-white border border-[#EDE8DF] rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
              Total Reports
            </span>

            <Flag className="w-4 h-4 text-stone-400" />

          </div>

          <p className="font-serif text-2xl font-bold text-stone-900 mt-3">
            {reports.length}
          </p>

        </div>

        {/* Pending */}
        <div className="bg-white border border-[#EDE8DF] rounded-2xl p-5">

          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
            Pending
          </span>

          <p className="font-serif text-2xl font-bold text-stone-900 mt-3">
            {
              reports.filter(
                (report) => report.status === 'pending'
              ).length
            }
          </p>

        </div>

        {/* Resolved */}
        <div className="bg-white border border-[#EDE8DF] rounded-2xl p-5">

          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
            Resolved
          </span>

          <p className="font-serif text-2xl font-bold text-stone-900 mt-3">
            {
              reports.filter(
                (report) => report.status === 'resolved'
              ).length
            }
          </p>

        </div>

      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-4">

        <div className="flex flex-col md:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports, users, reasons or content..."
              className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#1A382B]"
            />

          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#1A382B]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

        </div>

      </div>

      {/* Reports Table */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-[#FAF7F2] border-b border-[#EDE8DF]">

              <tr>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Reported Item
                </th>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Reported By
                </th>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Reason
                </th>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Date
                </th>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Status
                </th>

                <th className="text-right px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#EDE8DF]">

              {filteredReports.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-14 text-center"
                  >

                    <Flag className="w-8 h-8 text-stone-300 mx-auto" />

                    <p className="text-sm font-semibold text-stone-600 mt-3">
                      No reports found
                    </p>

                    <p className="text-xs text-stone-400 mt-1">
                      Try changing your search or filter.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredReports.map((report) => (

                  <tr
                    key={report.id}
                    className="hover:bg-[#FAF7F2]/60 transition"
                  >

                    {/* Reported Item */}
                    <td className="px-5 py-4 max-w-[250px]">

                      <div className="flex items-start gap-2">

                        <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 mt-0.5">
                          {report.type}
                        </span>

                        <p className="text-xs font-semibold text-stone-800 truncate">
                          {report.item}
                        </p>

                      </div>

                    </td>

                    {/* Reported By */}
                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-stone-700">
                        {report.reportedBy}
                      </p>

                    </td>

                    {/* Reason */}
                    <td className="px-5 py-4 max-w-[190px]">

                      <p className="text-xs text-stone-600 truncate">
                        {report.reason}
                      </p>

                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">

                      <span className="text-xs text-stone-500">
                        {report.date}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] font-semibold capitalize ${getStatusClasses(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">

                      <div className="flex justify-end">

                        <button
                          onClick={() =>
                            setSelectedReport(report)
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-600 hover:text-[#1A382B] hover:bg-[#FAF7F2] text-[10px] font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {report.status === 'pending'
                            ? 'Review'
                            : 'View'}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Temporary API Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">

        <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />

        <div>

          <p className="text-xs font-semibold text-amber-900">
            Temporary demonstration data
          </p>

          <p className="text-[11px] text-amber-800 mt-1">
            Reports are currently displayed using temporary data.
            This will be replaced with the reports API once the
            backend is available.
          </p>

        </div>

      </div>

      {/* Report Details Modal */}
      {selectedReport && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white border border-[#EDE8DF] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-[#EDE8DF] flex items-center justify-between">

              <div>

                <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400">
                  {selectedReport.type} Report
                </span>

                <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
                  Report Details
                </h3>

              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5">

              {/* Reported Item */}
              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Reported Item
                </p>

                <div className="mt-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3">

                  <p className="text-sm font-semibold text-stone-800">
                    {selectedReport.item}
                  </p>

                </div>

              </div>

              {/* Details Grid */}
              <div className="grid sm:grid-cols-2 gap-3">

                <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                    Reported By
                  </p>

                  <p className="text-sm font-semibold text-stone-800 mt-1">
                    {selectedReport.reportedBy}
                  </p>

                </div>

                <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                    Date
                  </p>

                  <p className="text-sm font-semibold text-stone-800 mt-1">
                    {selectedReport.date}
                  </p>

                </div>

              </div>

              {/* Reason */}
              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Reason
                </p>

                <p className="text-sm font-semibold text-stone-800 mt-1">
                  {selectedReport.reason}
                </p>

              </div>

              {/* Description */}
              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Description
                </p>

                <div className="mt-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-4">

                  <p className="text-sm text-stone-700 leading-7">
                    {selectedReport.description}
                  </p>

                </div>

              </div>

              {/* Current Status */}
              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Current Status
                </p>

                <span
                  className={`inline-flex mt-2 px-2.5 py-1 rounded-full border text-[10px] font-semibold capitalize ${getStatusClasses(
                    selectedReport.status
                  )}`}
                >
                  {selectedReport.status}
                </span>

              </div>

              {/* Actions */}
              {selectedReport.status === 'pending' && (

                <div className="border-t border-[#EDE8DF] pt-4">

                  <h4 className="font-serif font-bold text-stone-900 mb-1">
                    Review Report
                  </h4>

                  <p className="text-xs text-stone-500 mb-3">
                    Decide whether this report should be resolved
                    or dismissed.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-end gap-2">

                    <button
                      onClick={() =>
                        handleReportAction(
                          selectedReport.id,
                          'dismissed'
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss Report
                    </button>

                    <button
                      onClick={() =>
                        handleReportAction(
                          selectedReport.id,
                          'resolved'
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Resolve Report
                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ReportsManagement;