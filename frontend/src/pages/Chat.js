import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Chat() {
  const currentUser = localStorage.getItem("user");

  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  // 📥 load friends
  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/friends/list/${currentUser}`
    );
    setFriends(res.data);
  };

  // 📥 load chat
  const loadChat = async (friend) => {
    setSelected(friend);

    const res = await axios.get(
      `http://localhost:5000/api/chat/${currentUser}/${friend}`
    );

    setChat(res.data);
  };

  // 📤 send message
  const sendMessage = async () => {
    if (!message) return;

    await axios.post("http://localhost:5000/api/chat/send", {
      from: currentUser,
      to: selected,
      text: message
    });

    setMessage("");
    loadChat(selected);
  };

  return (
    <>
      <Navbar />

      <div style={{ display: "flex", height: "90vh" }}>
        
        {/* LEFT: FRIENDS */}
        <div style={{
          width: "25%",
          background: "#020617",
          padding: "10px"
        }}>
          <h3>Friends</h3>

          {friends.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid gray"
              }}
              onClick={() => loadChat(f)}
            >
              {f}
            </div>
          ))}
        </div>

        {/* RIGHT: CHAT */}
        <div style={{ flex: 1, padding: "20px" }}>
          <h3>Chat with {selected}</h3>

          <div style={{
            height: "70%",
            overflowY: "auto",
            border: "1px solid gray",
            padding: "10px"
          }}>
            {chat.map((msg, i) => (
              <div key={i} style={{
                textAlign: msg.from === currentUser ? "right" : "left"
              }}>
                <p>
                  <b>{msg.from}:</b> {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div style={{ marginTop: "10px" }}>
            <input
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;