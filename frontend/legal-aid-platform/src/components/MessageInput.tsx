import React from "react";

interface Props {
  selectedUser: any;
}

const MessageInput: React.FC<Props> = ({ selectedUser }) => {

  return (
    <div className="p-4 border-t bg-white">

      <div className="flex items-center gap-3">

        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md"
        />

        <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
          Send
        </button>

      </div>

    </div>
  );
};

export default MessageInput;