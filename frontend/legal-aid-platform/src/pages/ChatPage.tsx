import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";
import { useAuth } from "../auth/AuthContext";

function ChatPage() {

  const { user } = useAuth();  

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("/");
    const data = await response.json();
    setUsers(data);
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
          role = {user.role}
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