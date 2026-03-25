import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";
import { useAuth } from "../auth/AuthContext";
import PageTitle from "../components/PageTitle";

function ChatPage() {
  const { user } = useAuth();
  const { matchId } = useParams();

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchUsers();
  }, [user]); // Re-run if user object loads

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !user) return;

      const response = await fetch("http://localhost:8081/matches/my", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error("Failed to fetch chat contacts");
        return;
      }

      const data = await response.json();
      const rawContacts = Array.isArray(data) ? data : [];

      //  FIX 1: Filter out duplicates and inject a universal "displayName"
      const uniqueContacts: any[] = [];
      const seenNames = new Set();

      rawContacts.forEach((contact: any) => {
        const isCitizen = user.role === "CITIZEN";
        const calculatedName = isCitizen ? contact.providerName : contact.clientName;
        const displayName = calculatedName || `Match #${contact.matchId || contact.id}`;

        // Only add them to the sidebar if we haven't seen this name yet!
        if (!seenNames.has(displayName)) {
          seenNames.add(displayName);
          uniqueContacts.push({ ...contact, displayName }); // Injecting displayName for the Header!
        }
      });

      setUsers(uniqueContacts);

      if (matchId && uniqueContacts.length > 0) {
        const targetChat = uniqueContacts.find((c: any) => 
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
    <><PageTitle title="Chat - Legal Aid Matching Platform" />
    <div className="flex flex-col h-screen">
      <Navbar
        title="Secure Chat"
        name={user.username}
        role={user.role}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={user.role}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="border-t border-blue-200 my-4 lg:border-t-0 lg:border-r lg:my-0 lg:w-1/4">
          <ChatList
            users={users}
            setSelectedUser={setSelectedUser}
          />
        </div>

        <div className="flex flex-col flex-1">
          {!selectedUser ? (
            <div className="flex flex-1 items-center justify-center text-gray-500 text-xl">
              Hello, {user.username}
              <br />
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              {/*  Passes the selected user with the new displayName injected */}
              <ChatHeader selectedUser={selectedUser} />
              <div className="flex-1 overflow-y-auto">
                <ChatMessages selectedUser={selectedUser} />
              </div>
              <MessageInput selectedUser={selectedUser} />
            </>
          )}
        </div>
      </div>
    </div></>
  );
}

export default ChatPage;
