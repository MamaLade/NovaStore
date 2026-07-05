import { useEffect, useMemo, useState } from "react";
import { FaCommentDots, FaUser, FaRobot } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import "./Chat.css";

function ChatAdmin() {
  const { chatThreads, sendAdminChatMessage, clearChatUnread } = useCart();
  const [searchParams] = useSearchParams();
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const requestedThread = searchParams.get("thread");
    if (requestedThread && chatThreads.some((thread) => thread.id === requestedThread)) {
      setSelectedThreadId(requestedThread);
      return;
    }
    if (!selectedThreadId && chatThreads.length > 0) {
      setSelectedThreadId(chatThreads[0].id);
    }
  }, [chatThreads, searchParams, selectedThreadId]);

  useEffect(() => {
    if (selectedThreadId) {
      clearChatUnread(selectedThreadId);
    }
  }, [selectedThreadId, clearChatUnread]);

  const selectedThread = useMemo(
    () => chatThreads.find((thread) => thread.id === selectedThreadId) || null,
    [chatThreads, selectedThreadId]
  );

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
  };

  const handleReply = (event) => {
    event.preventDefault();
    const trimmed = reply.trim();
    if (!trimmed || !selectedThreadId) return;
    sendAdminChatMessage(trimmed, selectedThreadId);
    setReply("");
  };

  return (
    <div className="admin-chat-page">
      <div className="admin-chat-header">
        <h1>Hộp chat hỗ trợ</h1>
        <p>Nhận tin nhắn khách và phản hồi trực tiếp từ trang admin.</p>
      </div>

      <div className="admin-chat-content">
        <aside className="chat-thread-list">
          <h2>Hội thoại khách</h2>
          {chatThreads.length === 0 ? (
            <div className="chat-empty">
              <FaCommentDots />
              <p>Chưa có tin nhắn nào.</p>
            </div>
          ) : (
            chatThreads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className={`thread-item ${thread.id === selectedThreadId ? "active" : ""}`}
                onClick={() => handleSelectThread(thread.id)}
              >
                <div>
                  <strong>{thread.userName || thread.userEmail || "Khách"}</strong>
                  <span>{thread.userEmail}</span>
                </div>
                {thread.unreadCount > 0 && <span className="thread-badge">{thread.unreadCount}</span>}
              </button>
            ))
          )}
        </aside>

        <section className="chat-thread-panel">
          {!selectedThread ? (
            <div className="chat-empty">
              <FaCommentDots />
              <p>Chọn một hội thoại để xem tin nhắn.</p>
            </div>
          ) : (
            <>
              <div className="admin-chat-box">
                {selectedThread.messages.map((message) => (
                  <div key={message.id} className={`admin-chat-message ${message.sender}`}>
                    <div className="message-meta">
                      <span className="message-sender">
                        {message.sender === "admin" && <FaUser />}
                        {message.sender === "user" && "Khách"}
                        {message.sender === "bot" && <FaRobot />}
                        {message.sender === "admin" ? "Admin" : message.sender === "user" ? message.userName || "Khách" : "Bot"}
                      </span>
                      <span className="message-time">
                        {new Date(message.time).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="message-text">{message.text}</div>
                  </div>
                ))}
              </div>

              <form className="admin-chat-form" onSubmit={handleReply}>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Nhập phản hồi cho khách hàng..."
                  rows={3}
                />
                <button type="submit">Gửi phản hồi</button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ChatAdmin;
