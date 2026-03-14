import React from "react";

interface Props {
  selectedUser: any;
}

const ChatMessages: React.FC<Props> = ({ selectedUser }) => {

  return (
    <div className="p-6 bg-gray-50 h-full">

      <div className="flex justify-start mb-4">
        <div className="bg-white p-3 rounded-lg shadow">
          Hello! How can I help you?
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="bg-purple-600 text-white p-3 rounded-lg">
          I need help with my case.
        </div>
      </div>

    </div>
  );
};

export default ChatMessages;