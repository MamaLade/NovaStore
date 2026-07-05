import { useEffect, useMemo, useRef, useState } from "react";
import { FaCommentDots, FaPaperPlane, FaTimes, FaUserCircle, FaRobot } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import "./ChatSupport.css";

function ChatSupport() {
  const { user, currentChatThread, sendCustomerChatMessage } = useCart();
  if (user?.role === "admin") return null;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState(0);

  const messages = useMemo(() => {
    if (currentChatThread?.messages?.length > 0) return currentChatThread.messages;
    return [
      {
        id: "welcome",
        sender: "bot",
        text: "Xin chào! Mình là NovaSupport. Bạn cần giúp gì hôm nay?",
        time: new Date().toISOString(),
      },
    ];
  }, [currentChatThread]);

  const previousMessages = useRef(messages);

  useEffect(() => {
    if (!open) {
      const prev = previousMessages.current || [];
      const newMessages = messages.slice(prev.length);
      const adminMessages = newMessages.filter((message) => message.sender === "admin");
      if (adminMessages.length > 0) {
        setUnread((prevCount) => prevCount + adminMessages.length);
      }
    }
    previousMessages.current = messages;
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
    }
  }, [open]);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    sendCustomerChatMessage(trimmed);
    setDraft("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const formattedMessages = useMemo(() => {
    return messages.map((message) => ({
      ...message,
      timeLabel: new Date(message.time).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, [messages]);

  return (
    <div className="chat-support">
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div className="chat-panel-title">
              <FaCommentDots />
              <div>
                <p>Hỗ trợ khách hàng</p>
                <span>NovaStore Support</span>
              </div>
            </div>
            <button className="chat-close" onClick={toggleOpen} type="button" aria-label="Đóng chat">
              <FaTimes />
            </button>
          </div>

          <div className="chat-messages">
            {formattedMessages.map((message) => (
              <div key={message.id} className={`chat-message ${message.sender}`}>
                <div className="chat-avatar">
                  {message.sender === "bot" ? <FaRobot /> : message.sender === "admin" ? <FaUserCircle /> : <span>Bạn</span>}
                </div>
                <div className="chat-message-body">
                  <p>{message.text}</p>
                  <span>{message.timeLabel}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              rows={2}
            />
            <button className="chat-send-btn" onClick={sendMessage} type="button">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      <button className="chat-toggle-btn" onClick={toggleOpen} type="button" aria-label="Mở chat hỗ trợ">
        <FaCommentDots />
        <span>Hỗ trợ</span>
        {unread > 0 && <span className="chat-badge">{unread}</span>}
      </button>
    </div>
  );
}

export default ChatSupport;
