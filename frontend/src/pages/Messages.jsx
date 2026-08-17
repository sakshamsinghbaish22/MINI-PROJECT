import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MessageSquare, Send, BookOpen, User, Search, CheckCheck, Clock, ArrowLeft } from 'lucide-react';
import { messagesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Messages() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { showError } = useToast();

  const [conversations, setConversations] = useState([]);
  const [activeOtherUserId, setActiveOtherUserId] = useState(searchParams.get('userId') || '');
  const [activeBookId, setActiveBookId] = useState(searchParams.get('bookId') || '');

  const [thread, setThread] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        setLoadingConv(true);
        const data = await messagesApi.getConversations();
        setConversations(data);
        if (data.length > 0 && !activeOtherUserId) {
          setActiveOtherUserId(data[0].other_user_id);
          setActiveBookId(data[0].book_id || '');
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoadingConv(false);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeOtherUserId) return;
    async function loadThread() {
      try {
        setLoadingThread(true);
        const data = await messagesApi.getThread(activeOtherUserId);
        setThread(data);
      } catch (err) {
        console.error('Failed to load thread:', err);
      } finally {
        setLoadingThread(false);
      }
    }
    loadThread();
    const interval = setInterval(loadThread, 5000);
    return () => clearInterval(interval);
  }, [activeOtherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeOtherUserId) return;

    try {
      setSending(true);
      const newMsg = await messagesApi.sendMessage({
        receiver_id: activeOtherUserId,
        book_id: activeBookId || null,
        message: messageInput.trim(),
      });
      setThread((prev) => [...prev, newMsg]);
      setMessageInput('');
    } catch (err) {
      showError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.other_user_id === activeOtherUserId);

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-sell" style={{ marginBottom: '0.5rem' }}>
          <span>STUDENT INBOX</span>
        </div>
        <h1 className="heading-section">
          Campus <span className="gradient-text">Messages</span>
        </h1>
      </div>

      {/* Split-Pane Chat Shell */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-xl)',
          height: '75vh',
          minHeight: '520px',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          overflow: 'hidden',
          border: '1px solid rgba(0, 240, 255, 0.25)',
        }}
      >
        {/* Left: Conversations Column */}
        <div style={{
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(5, 8, 17, 0.65)',
        }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>Conversations</h3>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Filter messages..."
                className="form-input"
                style={{ padding: '0.5rem 0.75rem 0.5rem 2rem', fontSize: '0.85rem' }}
              />
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConv ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading chat list...
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No active conversations yet. Reach out to any seller from a book details page!
              </div>
            ) : (
              conversations.map((c) => {
                const isActive = c.other_user_id === activeOtherUserId;
                return (
                  <div
                    key={c.other_user_id}
                    onClick={() => {
                      setActiveOtherUserId(c.other_user_id);
                      setActiveBookId(c.book_id || '');
                    }}
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={c.other_user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={c.other_user_name}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid #050811' }} />
                    </div>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 600 }}>{c.other_user_name}</h4>
                        {c.unread_count > 0 && (
                          <span style={{ background: '#00F0FF', color: '#050811', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                        {c.last_message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {activeOtherUserId ? (
            <>
              {/* Chat Header with Book Inquiry Banner */}
              <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(11, 17, 33, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={activeConv?.other_user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt="Active User"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>{activeConv?.other_user_name || 'Student Peer'}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--cyan)' }}>Verified Campus Member</div>
                  </div>
                </div>

                {activeConv?.book_title && (
                  <div style={{
                    background: 'rgba(0, 240, 255, 0.08)',
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <BookOpen size={13} color="#00F0FF" />
                    <span>Inquiring about: <strong>{activeConv.book_title}</strong></span>
                  </div>
                )}
              </div>

              {/* Message Bubbles Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loadingThread ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    Loading message history...
                  </div>
                ) : thread.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    Say hello to initiate campus exchange coordination!
                  </div>
                ) : (
                  thread.map((msg, i) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id || i}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '0.85rem 1.25rem',
                            borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                            background: isMe ? 'linear-gradient(135deg, #00F0FF, #3B82F6)' : 'rgba(255, 255, 255, 0.08)',
                            color: isMe ? '#050811' : '#FFFFFF',
                            fontWeight: isMe ? 600 : 400,
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                            boxShadow: isMe ? '0 4px 15px rgba(0, 240, 255, 0.25)' : 'none',
                          }}
                        >
                          {msg.message}
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Reply Composer */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'rgba(5, 8, 17, 0.85)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="form-input"
                  style={{ borderRadius: 'var(--radius-full)' }}
                />
                <button
                  type="submit"
                  disabled={sending || !messageInput.trim()}
                  className="btn btn-primary"
                  style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, flexShrink: 0 }}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a conversation to begin chatting
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .glass-panel {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
