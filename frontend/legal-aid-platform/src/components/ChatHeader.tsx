import React from "react";

interface Props {
  selectedUser: any;
}

const ChatHeader: React.FC<Props> = ({ selectedUser }) => {

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">

      <div className="flex items-center">

        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />

        <div>
          <div className="font-semibold">
            {selectedUser.name}
          </div>

          <div className="text-sm text-gray-500">
            {selectedUser.role}
          </div>
        </div>

      </div>

      <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
        View Profile
      </button>

    </div>
  );
};

export default ChatHeader;