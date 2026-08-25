import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  LayoutGrid,
  Search,
  PenLine,
  User,
  Bell,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Clock,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isReader, isAuthor, isAdmin, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Article Published',
      message: 'Your piece "How CRISPR Is Rewriting Medicine" is now live.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Reader Interaction',
      message: '14 new readers bookmarked your article this morning.',
      time: '1 day ago',
      unread: false,
    },
  ]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns & mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Helper for 2-letter initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isHomeActive = location.pathname === '/';
  const isBrowseActive = location.pathname === '/browse';
  const isWriteActive = location.pathname === '/write';
  const isAdminActive = location.pathname.startsWith('/admin');
  const isProfileActive = location.pathname === '/profile';
  const unreadCount = notifications.filter((n) => n.unread).length;
  const navItems = [
    { to: '/', label: 'Home', icon: LayoutGrid, active: isHomeActive },
    { to: '/browse', label: 'Browse', icon: Search, active: isBrowseActive },
    { to: '/write', label: 'Write', icon: PenLine, active: isWriteActive, show: isAuthor },
    {
      to: '/admin',
      label: 'Admin',
      mobileLabel: 'Admin Center',
      icon: ShieldCheck,
      iconClass: 'text-emerald-700',
      active: isAdminActive,
      show: isAdmin,
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: User,
      active: isProfileActive,
      show: isAuthenticated,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EDE8DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3.5">
          {/* Left: Lumen Logo Branding */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#1A382B] flex items-center justify-center text-white shadow-sm group-hover:bg-[#11261D] transition">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
              Lumen
            </span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.filter(({ show }) => show !== false).map(({ to, label, icon: Icon, iconClass, active }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                  active
                    ? 'bg-[#1A382B] text-white shadow-xs font-semibold'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-[#EFECE6]/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${iconClass || ''}`} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User Role Pill Button with Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 bg-[#EFECE6] hover:bg-[#E7E2D9] px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-800 border border-[#E2DDD3] transition shadow-2xs"
                  >
                    <span className="truncate max-w-[140px] sm:max-w-[180px]">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-stone-300/60 text-stone-700">
                      {user?.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {/* Account Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-[#EDE8DF] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-2.5 border-b border-[#EDE8DF] mb-1">
                        <p className="text-[11px] text-stone-500">Signed in as</p>
                        <p className="text-sm font-bold text-stone-900 truncate">{user?.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-[#FAF7F2] transition"
                      >
                        <User className="w-4 h-4 text-stone-500" />
                        My Profile
                      </Link>

                      {isAuthor && (
                        <Link
                          to="/write"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-[#FAF7F2] transition"
                        >
                          <PenLine className="w-4 h-4 text-[#1A382B]" />
                          Write New Article
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-[#FAF7F2] transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#1A382B]" />
                          Admin Verification Center
                        </Link>
                      )}

                      <div className="my-1 border-t border-[#EDE8DF]" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Notification Icon & Dropdown */}
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="relative p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6] transition"
                    title="Notifications"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D97736] rounded-full ring-2 ring-[#FAF7F2]" />
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-[#EDE8DF] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-3 border-b border-[#EDE8DF] flex items-center justify-between bg-[#FAF7F2]">
                        <span className="font-serif font-bold text-sm text-stone-900">Notifications</span>
                        <span className="text-[11px] text-stone-500">{unreadCount} unread</span>
                      </div>
                      <div className="divide-y divide-[#EDE8DF] max-h-64 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-3.5 hover:bg-[#FAF7F2] transition text-xs">
                            <p className="font-bold text-stone-900">{n.title}</p>
                            <p className="text-stone-600 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-stone-400 mt-1 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Circular Initials Avatar */}
                <Link
                  to="/profile"
                  title="View Profile"
                  className="w-8 h-8 rounded-full bg-[#1A382B] text-white flex items-center justify-center text-xs font-serif font-bold shadow-xs hover:bg-[#11261D] transition"
                >
                  {getInitials(user?.name)}
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 rounded-xl hover:bg-[#EFECE6]/70 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold bg-[#1A382B] hover:bg-[#11261D] text-white rounded-xl shadow-xs transition"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-[#EFECE6]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EDE8DF] bg-[#FAF7F2] px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
          {navItems.filter(({ show, to }) => show !== false && to !== '/profile').map(({ to, label, mobileLabel, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-900 hover:bg-[#EFECE6]"
            >
              <Icon className="w-4 h-4" /> {mobileLabel || label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-900 hover:bg-[#EFECE6]"
              >
                <User className="w-4 h-4" /> Profile ({user?.role})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 hover:bg-rose-50 text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-[#EDE8DF] flex gap-2">
              <Link
                to="/login"
                className="flex-1 text-center py-2 text-xs font-semibold bg-[#EFECE6] text-stone-800 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2 text-xs font-bold bg-[#1A382B] text-white rounded-xl"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
