import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";
import { useAuth } from "../auth/AuthContext";

function ChatPage() {
  const { user } = useAuth();
  const { matchId } = useParams(); // Grab the ID from the URL if coming from Dashboard

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Hitting the matches endpoint to get your chat contacts
      const response = await fetch("http://localhost:8081/matches/my", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error("Failed to fetch chat contacts");
        return;
      }

      const data = await response.json();
      const contacts = Array.isArray(data) ? data : [];
      setUsers(contacts);

      // If we came from the Dashboard "Secure Chat" button, auto-select that user!
      if (matchId && contacts.length > 0) {
        // Look for matchId or id depending on how your backend sends it
        const targetChat = contacts.find((c: any) => 
          String(c.matchId) === String(matchId) || String(c.id) === String(matchId)
        );
        if (targetChat) {
          setSelectedUser(targetChat);
        }
      }
    } catch (error) {
      console.error("Error fetching chat contacts", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar
        title="Secure Chat"
        name={user.username}
        role={user.role}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          role={user.role}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* ChatList */}
        <div className="border-t border-blue-200 my-4 lg:border-t-0 lg:border-r lg:my-0 lg:w-1/4">
          <ChatList
            users={users}
            setSelectedUser={setSelectedUser}
          />
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1">
          {!selectedUser ? (
            <div className="flex flex-1 items-center justify-center text-gray-500 text-xl">
              Hello, {user.username}
              <br />
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <ChatHeader selectedUser={selectedUser} />
              <div className="flex-1 overflow-y-auto">
                <ChatMessages selectedUser={selectedUser} />
              </div>
              <MessageInput selectedUser={selectedUser} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;