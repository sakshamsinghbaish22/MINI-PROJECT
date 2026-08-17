import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  Unlock,
  Search,
  ExternalLink,
  Filter
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { useToast } from '../context/ToastContext';
import { StatusBadge, ModeBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/Loading';

export const AdminDashboard = () => {
  const { showSuccess, showError } = useToast();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'users', 'books'
  
  // Tab Data States
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState('');

  // Report Resolution Modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportResolution, setReportResolution] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchStats = async () => {
    try {
      const s = await adminApi.getStats();
      setStats(s);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const r = await adminApi.getReports(reportStatusFilter);
      setReports(r);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const u = await adminApi.getUsers(userSearch);
      setUsers(u);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const b = await adminApi.getBooks({ search: bookSearch });
      setBooks(b);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchReports(), fetchUsers(), fetchBooks()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [reportStatusFilter]);

  const handleToggleUser = async (userId, currentActive) => {
    try {
      await adminApi.toggleUserStatus(userId, !currentActive);
      showSuccess(`User account ${!currentActive ? 'activated' : 'suspended'}.`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to update user status.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to permanently remove this listing as moderator?')) return;
    try {
      await adminApi.deleteBook(bookId);
      showSuccess('Listing deleted from catalog.');
      fetchBooks();
      fetchStats();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to delete listing.');
    }
  };

  const handleOpenResolve = (rep) => {
    setSelectedReport(rep);
    setReportResolution('RESOLVED');
    setAdminNotes(rep.admin_notes || 'Reviewed by campus admin. Action verified.');
    setShowReportModal(true);
  };

  const handleSubmitResolve = async () => {
    try {
      await adminApi.updateReportStatus(selectedReport.id, {
        status: reportResolution,
        admin_notes: adminNotes,
      });
      showSuccess(`Report status set to ${reportResolution}`);
      setShowReportModal(false);
      fetchReports();
      fetchStats();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to resolve report.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin control center..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Admin Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 700, fontSize: '0.88rem' }}>
          <ShieldCheck size={18} />
          <span>CAMPUS MODERATION PANEL</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>
          Administrator Dashboard
        </h1>
      </div>

      {/* Stats Counter Grid */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-blue)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>REGISTERED USERS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-navy)' }}>{stats.total_users}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACTIVE BOOK LISTINGS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>{stats.available_books} / {stats.total_books}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>COMPLETED TRADES</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>{stats.completed_transactions}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PENDING REPORTS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>{stats.pending_reports}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <AlertTriangle size={18} />
          <span>User Reports Queue ({reports.length})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          <BookOpen size={18} />
          <span>Catalog Moderation ({books.length})</span>
        </button>
      </div>

      {/* TAB 1: REPORTS */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <select
              value={reportStatusFilter}
              onChange={(e) => setReportStatusFilter(e.target.value)}
              style={{ width: 'auto', padding: '0.45rem 0.85rem' }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>

          {reports.length > 0 ? (
            reports.map((rep) => (
              <div key={rep.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem' }}>
                      {rep.reason}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Reported by: <strong>{rep.reporter_name}</strong> ({rep.reporter_email})
                    </span>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor: rep.status === 'PENDING' ? '#fef3c7' : rep.status === 'RESOLVED' ? '#ecfdf5' : '#f1f5f9',
                    color: rep.status === 'PENDING' ? '#b45309' : rep.status === 'RESOLVED' ? '#047857' : '#475569'
                  }}>
                    {rep.status}
                  </span>
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  "{rep.description}"
                </p>

                {rep.reported_book_title && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Target Book: <strong>{rep.reported_book_title}</strong> (ID: {rep.reported_book_id})
                  </div>
                )}

                {rep.admin_notes && (
                  <div style={{ fontSize: '0.85rem', color: '#047857', backgroundColor: '#ecfdf5', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Admin Note:</strong> {rep.admin_notes}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <button onClick={() => handleOpenResolve(rep)} className="btn btn-secondary btn-sm">
                    Resolve / Update Report
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No reports filed.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search users by name, email, or college..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <button onClick={fetchUsers} className="btn btn-primary btn-sm">
              <Search size={16} />
            </button>
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User</th>
                  <th style={{ padding: '0.75rem 1rem' }}>College / Campus</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{u.college}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontWeight: 700, color: u.role === 'ADMIN' ? '#0284c7' : 'inherit' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>⭐ {u.rating} ({u.review_count})</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: u.is_active ? '#ecfdf5' : '#fee2e2',
                        color: u.is_active ? '#047857' : '#b91c1c'
                      }}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleUser(u.id, u.is_active)}
                          className={`btn btn-sm ${u.is_active ? 'btn-outline' : 'btn-success'}`}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        >
                          {u.is_active ? <><Lock size={12} /> Suspend</> : <><Unlock size={12} /> Unsuspend</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKS MODERATION */}
      {activeTab === 'books' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search listings by title, author..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
            />
            <button onClick={fetchBooks} className="btn btn-primary btn-sm">
              <Search size={16} />
            </button>
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Book Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Owner</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Mode / Price</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{b.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {b.author}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{b.owner_name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{b.category}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <ModeBadge mode={b.mode} price={b.price} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <StatusBadge status={b.status} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <a href={`/books/${b.id}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                          <ExternalLink size={12} />
                        </a>
                        <button onClick={() => handleDeleteBook(b.id)} className="btn btn-danger btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Resolution Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Resolve Campus Report"
        footer={
          <>
            <button onClick={() => setShowReportModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
            <button onClick={handleSubmitResolve} className="btn btn-primary btn-sm">Save Moderation Decision</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Decision Status
            </label>
            <select value={reportResolution} onChange={(e) => setReportResolution(e.target.value)}>
              <option value="RESOLVED">RESOLVED (Action Taken)</option>
              <option value="DISMISSED">DISMISSED (No Violation)</option>
              <option value="PENDING">PENDING (Under Investigation)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Admin Moderation Notes
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Document reason for resolution or action taken..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
