import React, { useMemo, useState } from 'react';
import {
  CreditCard,
  Search,
  Eye,
  X,
  AlertCircle,
} from 'lucide-react';

const initialSubscriptions = [
  {
    id: 1,
    user: 'Aarav Mehta',
    email: 'aarav@example.com',
    plan: 'Premium',
    startDate: 'Aug 12, 2026',
    expiryDate: 'Sep 12, 2026',
    status: 'active',
    amount: '₹299',
  },
  {
    id: 2,
    user: 'Priya Sharma',
    email: 'priya@example.com',
    plan: 'Premium',
    startDate: 'Aug 05, 2026',
    expiryDate: 'Sep 05, 2026',
    status: 'expired',
    amount: '₹299',
  },
  {
    id: 3,
    user: 'Rohan Patil',
    email: 'rohan@example.com',
    plan: 'Basic',
    startDate: 'Aug 20, 2026',
    expiryDate: 'Sep 20, 2026',
    status: 'active',
    amount: '₹149',
  },
  {
    id: 4,
    user: 'Neha Joshi',
    email: 'neha@example.com',
    plan: 'Premium',
    startDate: 'Jul 15, 2026',
    expiryDate: 'Aug 15, 2026',
    status: 'expired',
    amount: '₹299',
  },
  {
    id: 5,
    user: 'Vikram Singh',
    email: 'vikram@example.com',
    plan: 'Premium',
    startDate: 'Aug 28, 2026',
    expiryDate: 'Sep 28, 2026',
    status: 'active',
    amount: '₹299',
  },
];

const SubscriptionsManagement = () => {
  const [subscriptions] = useState(initialSubscriptions);

  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedSubscription, setSelectedSubscription] =
    useState(null);

  const filteredSubscriptions = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return subscriptions.filter((subscription) => {
      const matchesSearch =
        !searchTerm ||
        subscription.user
          .toLowerCase()
          .includes(searchTerm) ||
        subscription.email
          .toLowerCase()
          .includes(searchTerm);

      const matchesPlan =
        planFilter === 'all' ||
        subscription.plan === planFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        subscription.status === statusFilter;

      return (
        matchesSearch &&
        matchesPlan &&
        matchesStatus
      );
    });
  }, [
    subscriptions,
    search,
    planFilter,
    statusFilter,
  ]);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';

      case 'expired':
        return 'bg-stone-100 text-stone-600 border-stone-200';

      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';

      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getPlanClasses = (plan) => {
    if (plan === 'Premium') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }

    return 'bg-stone-100 text-stone-600 border-stone-200';
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Subscription Management
        </h2>

        <p className="text-xs text-stone-500 mt-1">
          View and monitor user subscription information.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total */}
        <div className="bg-white border border-[#EDE8DF] rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
              Total Subscriptions
            </span>

            <CreditCard className="w-4 h-4 text-stone-400" />

          </div>

          <p className="font-serif text-2xl font-bold text-stone-900 mt-3">
            {subscriptions.length}
          </p>

        </div>

        {/* Active */}
        <div className="bg-white border border-[#EDE8DF] rounded-2xl p-5">

          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
            Active
          </span>

          <p className="font-serif text-2xl font-bold text-stone-900 mt-3">
            {
              subscriptions.filter(
                (subscription) =>
                  subscription.status === 'active'
              ).length
            }
          </p>

        </div>

        {/* Expired */}
        <div className="bg-white border border-[#EDE8DF] rounded-2xl p-5">

          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
            Expired
          </span>

          <p className="font-serif text-2xl font-bold text-stone-900 mt-3">
            {
              subscriptions.filter(
                (subscription) =>
                  subscription.status === 'expired'
              ).length
            }
          </p>

        </div>

      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-4">

        <div className="flex flex-col md:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search users or email..."
              className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#1A382B]"
            />

          </div>

          {/* Plan */}
          <select
            value={planFilter}
            onChange={(e) =>
              setPlanFilter(e.target.value)
            }
            className="px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#1A382B]"
          >
            <option value="all">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#1A382B]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>

        </div>

      </div>

      {/* Subscriptions Table */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-[#FAF7F2] border-b border-[#EDE8DF]">

              <tr>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  User
                </th>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Plan
                </th>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Start Date
                </th>

                <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Expiry Date
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

              {filteredSubscriptions.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-14 text-center"
                  >

                    <CreditCard className="w-8 h-8 text-stone-300 mx-auto" />

                    <p className="text-sm font-semibold text-stone-600 mt-3">
                      No subscriptions found
                    </p>

                    <p className="text-xs text-stone-400 mt-1">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredSubscriptions.map(
                  (subscription) => (

                    <tr
                      key={subscription.id}
                      className="hover:bg-[#FAF7F2]/60 transition"
                    >

                      {/* User */}
                      <td className="px-5 py-4">

                        <p className="text-xs font-semibold text-stone-800">
                          {subscription.user}
                        </p>

                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {subscription.email}
                        </p>

                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] font-semibold ${getPlanClasses(
                            subscription.plan
                          )}`}
                        >
                          {subscription.plan}
                        </span>

                      </td>

                      {/* Start */}
                      <td className="px-5 py-4">

                        <span className="text-xs text-stone-500">
                          {subscription.startDate}
                        </span>

                      </td>

                      {/* Expiry */}
                      <td className="px-5 py-4">

                        <span className="text-xs text-stone-500">
                          {subscription.expiryDate}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] font-semibold capitalize ${getStatusClasses(
                            subscription.status
                          )}`}
                        >
                          {subscription.status}
                        </span>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              setSelectedSubscription(
                                subscription
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-600 hover:text-[#1A382B] hover:bg-[#FAF7F2] text-[10px] font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

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
            Subscription information is currently displayed
            using temporary data. This will be replaced with
            the subscriptions API once the backend is available.
          </p>

        </div>

      </div>

      {/* Subscription Details Modal */}
      {selectedSubscription && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white border border-[#EDE8DF] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between">

              <div>

                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Subscription
                </span>

                <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
                  Subscription Details
                </h3>

              </div>

              <button
                onClick={() =>
                  setSelectedSubscription(null)
                }
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Body */}
            <div className="p-6 space-y-5">

              {/* User */}
              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  User
                </p>

                <div className="mt-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-4">

                  <p className="text-sm font-semibold text-stone-800">
                    {selectedSubscription.user}
                  </p>

                  <p className="text-xs text-stone-500 mt-1">
                    {selectedSubscription.email}
                  </p>

                </div>

              </div>

              {/* Details */}
              <div className="grid sm:grid-cols-2 gap-4">

                <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-4">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                    Plan
                  </p>

                  <span
                    className={`inline-flex mt-2 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${getPlanClasses(
                      selectedSubscription.plan
                    )}`}
                  >
                    {selectedSubscription.plan}
                  </span>

                </div>

                <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-4">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                    Status
                  </p>

                  <span
                    className={`inline-flex mt-2 px-2.5 py-1 rounded-full border text-[10px] font-semibold capitalize ${getStatusClasses(
                      selectedSubscription.status
                    )}`}
                  >
                    {selectedSubscription.status}
                  </span>

                </div>

              </div>

              {/* Dates */}
              <div className="grid sm:grid-cols-2 gap-4">

                <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-4">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                    Start Date
                  </p>

                  <p className="text-sm font-semibold text-stone-800 mt-1">
                    {selectedSubscription.startDate}
                  </p>

                </div>

                <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-4">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                    Expiry Date
                  </p>

                  <p className="text-sm font-semibold text-stone-800 mt-1">
                    {selectedSubscription.expiryDate}
                  </p>

                </div>

              </div>

              {/* Amount */}
              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Subscription Amount
                </p>

                <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {selectedSubscription.amount}
                </p>

              </div>

              {/* Close */}
              <div className="flex justify-end pt-2">

                <button
                  onClick={() =>
                    setSelectedSubscription(null)
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#1A382B] hover:bg-[#11261D] text-white text-xs font-bold"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default SubscriptionsManagement;