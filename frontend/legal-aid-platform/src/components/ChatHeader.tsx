import React from "react";

interface Props {
  selectedUser: any;
}

const ChatHeader: React.FC<Props> = ({ selectedUser }) => {
  //  1. Use the displayName we injected in ChatPage
  const displayName = selectedUser.displayName || `Match #${selectedUser.matchId || selectedUser.id}`;
  
  //  2. Grab the first letter for the Avatar circle
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  //  3. Safely figure out their role (The backend DTO sends 'providerType')
  const displayRole = selectedUser.providerType || "CITIZEN (CLIENT)";

  return (
    <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-white">
      <div className="flex items-center">
        
        {/* Polished Avatar Circle to match the Sidebar */}
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3 shrink-0">
          {initial}
        </div>

        <div>
          <div className="font-semibold text-blue-900">
            {displayName}
          </div>
          <div className="text-sm text-gray-500 capitalize">
            {displayRole.toLowerCase()}
          </div>
        </div>

      </div>

      <button className="px-4 py-1.5 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition text-sm font-medium">
        View Profile
      </button>

    </div>
  );
};

export default ChatHeader;