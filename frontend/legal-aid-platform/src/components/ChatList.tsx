import React, { useMemo, useState } from "react";

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

interface Props {
  users: MatchDTO[];
  setSelectedUser: (user: MatchDTO) => void;
}

const ChatList: React.FC<Props> = ({ users, setSelectedUser }) => {
  const [query, setQuery] = useState("");

  // ✅ Remove duplicates (based on matchId)
  const uniqueUsers = useMemo(() => {
    const map = new Map<number, MatchDTO>();
    users.forEach((user) => {
      if (!map.has(user.matchId)) {
        map.set(user.matchId, user);
      }
    });
    return Array.from(map.values());
  }, [users]);

  // ✅ Filter based on search
  const filteredUsers = useMemo(() => {
    return uniqueUsers.filter((u) =>
      (u.displayName || "")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [uniqueUsers, query]);

  return (
    <div className="flex flex-col h-full bg-white border-r">
      
      {/* 🔍 Search Bar */}
      <div className="p-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
      </div>

      <hr className="border-t border-blue-200 my-2" />

      {/* 📋 Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-sm text-gray-400 text-center">
            No conversations found.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const name = user.displayName || "Unknown User";
            const initial = name.charAt(0).toUpperCase();

            return (
              <div key={user.matchId}>
                <div
                  onClick={() => setSelectedUser(user)}
                  className="flex items-center p-4 cursor-pointer hover:bg-blue-50 transition"
                >
                  {/* 👤 Avatar */}
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3 shrink-0">
                    {initial}
                  </div>

                  {/* 📄 User Info */}
                  <div className="overflow-hidden">
                    <div className="font-semibold text-blue-900 truncate">
                      {name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Click to start chat
                    </div>
                  </div>
                </div>

                <hr className="border-t border-blue-200 mx-4" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
