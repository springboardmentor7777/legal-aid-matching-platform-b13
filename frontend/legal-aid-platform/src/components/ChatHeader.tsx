import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";

interface Props {
  selectedUser: any;
}

const ChatHeader: React.FC<Props> = ({ selectedUser }) => {
  const { user } = useAuth(); //  Grab the logged-in user to check their role
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the popup

  const displayName = selectedUser.displayName || `Match #${selectedUser.matchId || selectedUser.id}`;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";
  const displayRole = selectedUser.providerType || "CITIZEN (CLIENT)";

  //  SMART LOGIC: Flip the modal details based on who is logged in!
  const isCitizen = user?.role === "CITIZEN";
  const modalTitle = isCitizen ? "Provider Profile" : "Client Profile";
  const profileRole = isCitizen ? displayRole : "CITIZEN";
  
  // (These will gracefully hide if your backend doesn't send email/phone data yet)
  const profileEmail = isCitizen ? selectedUser.providerEmail : selectedUser.clientEmail;
  const profilePhone = isCitizen ? selectedUser.providerPhone : selectedUser.clientPhone;

  return (
    <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-white relative">
      <div className="flex items-center">
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

      {/*  Added the onClick trigger here */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-1.5 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition text-sm font-medium"
      >
        View Profile
      </button>

      {/* THE PROFILE MODAL  */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold">{modalTitle}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-blue-200 hover:text-white font-bold text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-4xl mb-3 shadow-inner">
                  {initial}
                </div>
                <h3 className="text-xl font-bold text-blue-900 text-center">{displayName}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mt-2 uppercase font-bold tracking-wider">
                  {profileRole}
                </span>
              </div>

              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">Match ID:</span>
                  <span className="font-bold text-blue-900">#{selectedUser.matchId || selectedUser.id}</span>
                </div>
                
                {/* Dynamically show email/phone if they exist in the backend DTO */}
                {profileEmail && (
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">Email:</span>
                    <span className="font-bold text-blue-900">{profileEmail}</span>
                  </div>
                )}
                {profilePhone && (
                  <div className="flex justify-between pb-1">
                    <span className="text-gray-500 font-medium">Phone:</span>
                    <span className="font-bold text-blue-900">{profilePhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex justify-end border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-bold shadow-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
};

export default ChatHeader;