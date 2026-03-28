import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";
import { useAuth } from "../auth/AuthContext";
import PageTitle from "../components/PageTitle";

interface MatchDTO {
  matchId: number;
  displayName: string;
  providerName?: string;
  clientName?: string;
  providerEmail?: string;
  clientEmail?: string;
  providerPhone?: string;
  clientPhone?: string;
  providerType?: string;
}

function ChatPage() {
  const { user } = useAuth();
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState<MatchDTO[]>([]);
  const [selectedUser, setSelectedUser] = useState<MatchDTO | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !user) return;

      const response = await fetch("http://localhost:8081/matches/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        setLoadError("Could not load your conversations. Please try again.");
        return;
      }

      const data = await response.json();
      const rawContacts = Array.isArray(data) ? data : [];

      // Deduplicate by matchId (not by name — two providers can share a name)
      const uniqueContacts: MatchDTO[] = [];
      const seenIds = new Set<number>();

      rawContacts.forEach((contact: any) => {
        const id = contact.matchId || contact.id;
        if (seenIds.has(id)) return;
        seenIds.add(id);

        const isCitizen = user.role === "CITIZEN";
        const calculatedName = isCitizen
          ? contact.providerName
          : contact.clientName;
        const displayName = calculatedName || `Match #${id}`;

        uniqueContacts.push({ ...contact, matchId: id, displayName });
      });

      setUsers(uniqueContacts);

      if (matchId && uniqueContacts.length > 0) {
        const target = uniqueContacts.find(
          (c) => String(c.matchId) === String(matchId)
        );
        if (target) setSelectedUser(target);
      }
    } catch (error) {
      console.error("Error fetching chat contacts", error);
      setLoadError("Something went wrong. Please refresh the page.");
    }
  };

  if (!user) return null;

  return (
    <>
      <PageTitle title="Chat - Legal Aid Matching Platform" />
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
            {loadError ? (
              <div className="p-4 text-sm text-red-500">{loadError}</div>
            ) : (
              <ChatList users={users} setSelectedUser={setSelectedUser} />
            )}
          </div>

          <div className="flex flex-col flex-1">
            {!selectedUser ? (
              <div className="flex flex-1 items-center justify-center text-gray-500 text-xl text-center px-4">
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
    </>
  );
}

export default ChatPage;
