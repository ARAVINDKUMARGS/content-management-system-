import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import {
  ShieldCheck,
  Users,
  PenLine,
  BookOpen,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('password123');
  const [newUserRole, setNewUserRole] = useState('author');
  const [newUserBio, setNewUserBio] = useState('');
  const [addingUser, setAddingUser] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userAPI.getAllUsers();
      if (response.data?.success && response.data?.users) {
        setUsers(response.data.users);
      } else {
        setError('Failed to fetch user list.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading users from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Change Role Handler
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await userAPI.updateUserRole(userId, newRole);
      if (response.data?.success) {
        setSuccessMsg(response.data.message || 'User role updated.');
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}"?`)) {
      return;
    }
    try {
      const response = await userAPI.deleteUser(userId);
      if (response.data?.success) {
        setSuccessMsg(`User "${userName}" removed successfully.`);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Create User Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    setError('');
    try {
      const response = await userAPI.createUserByAdmin({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        password: newUserPassword,
        role: newUserRole,
        bio: newUserBio.trim(),
      });

      if (response.data?.success) {
        setSuccessMsg(`New ${newUserRole} account created for ${newUserName}.`);
        setShowAddModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserBio('');
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setAddingUser(false);
    }
  };

  // Helper for initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const authorCount = users.filter((u) => u.role === 'author').length;
  const readerCount = users.filter((u) => u.role === 'reader').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between animate-in fade-in">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center justify-between animate-in fade-in">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE8DF] pb-3">
        <Link
          to="/admin"
          className="px-4 py-2 bg-[#1A382B] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          User Management & Governance
        </Link>
        <Link
          to="/admin/verification"
          className="px-4 py-2 bg-white border border-[#EDE8DF] text-stone-700 hover:bg-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          Content Verification Queue
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrator Center
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">User Management & Platform Governance</h1>
          <p className="text-xs text-stone-500 mt-1">Logged in as Administrator: {user?.name} ({user?.email})</p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A382B] hover:bg-[#11261D] text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EDE8DF] hover:bg-[#FAF7F2] text-stone-700 rounded-xl text-xs font-semibold shadow-2xs transition"
            title="Refresh Users"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-500">Total Users</span>
            <Users className="w-4 h-4 text-stone-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900">{totalCount}</p>
          <span className="text-[11px] text-stone-400">Registered platform accounts</span>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-500">Authors</span>
            <PenLine className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900">{authorCount}</p>
          <span className="text-[11px] text-stone-400">Content creators</span>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-500">Readers</span>
            <BookOpen className="w-4 h-4 text-stone-700" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900">{readerCount}</p>
          <span className="text-[11px] text-stone-400">Active learners</span>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-3xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-500">Admins</span>
            <ShieldCheck className="w-4 h-4 text-purple-700" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900">{adminCount}</p>
          <span className="text-[11px] text-stone-400">Platform administrators</span>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F5F2EB]">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Registered Platform Users</h2>
            <p className="text-xs text-stone-500">Live database records with role modification and user deletion</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Search user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE8DF]">
              {['all', 'admin', 'author', 'reader'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                    roleFilter === r
                      ? 'bg-[#1A382B] text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500">Loading user database...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">No users match the search criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F5F2EB] text-stone-500 font-semibold">
                  <th className="pb-3 pl-2">User</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Registered Date</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF7F2]/60 transition">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1A382B] text-white font-serif font-bold flex items-center justify-center text-xs shadow-2xs">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">{u.name}</span>
                          {u.bio && <span className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">{u.bio}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-stone-600 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : u.role === 'author'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <option value="reader">READER</option>
                        <option value="author">AUTHOR</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-stone-500">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title={`Remove ${u.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-stone-900">Create New Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lena Kaufmann"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#1A382B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Assign Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl text-xs text-stone-900 font-semibold focus:outline-none focus:border-[#1A382B]"
                >
                  <option value="reader">Reader</option>
                  <option value="author">Author</option>
                  <option value="admin">Admin (Platform Administrator)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="px-5 py-2 bg-[#1A382B] text-white text-xs font-bold rounded-xl hover:bg-[#11261D] transition disabled:opacity-50"
                >
                  {addingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
