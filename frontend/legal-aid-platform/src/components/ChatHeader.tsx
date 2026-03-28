import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";

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
  selectedUser: MatchDTO;
}

const ChatHeader: React.FC<Props> = ({ selectedUser }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCitizen = user?.role === "CITIZEN";

  const displayName = isCitizen
    ? selectedUser?.providerName || selectedUser?.displayName
    : selectedUser?.clientName || selectedUser?.displayName;

  const displayRole = isCitizen
    ? selectedUser?.providerType || "Lawyer"
    : "Citizen";

  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  const profileEmail = isCitizen
    ? selectedUser?.providerEmail
    : selectedUser?.clientEmail;

  const profilePhone = isCitizen
    ? selectedUser?.providerPhone
    : selectedUser?.clientPhone;

  return (
    <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-white relative">

      {/* LEFT SIDE */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3 shrink-0">
          {initial}
        </div>
        <div>
          <div className="font-semibold text-blue-900">
            {displayName || "Unknown User"}
          </div>
          <div className="text-sm text-gray-500">{displayRole}</div>
        </div>
      </div>

      {/* VIEW PROFILE BUTTON */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-1.5 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition text-sm font-medium"
      >
        View Profile
      </button>

      {/* PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden">

            {/* HEADER */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {isCitizen ? "Provider Profile" : "Client Profile"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-blue-200 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            {/* BODY */}
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-4xl mb-3">
                  {initial}
                </div>
                <h3 className="text-xl font-bold text-blue-900 text-center">
                  {displayName}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mt-2 uppercase font-bold tracking-wider">
                  {displayRole}
                </span>
              </div>

              {/* DETAILS */}
              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">Match ID:</span>
                  <span className="font-bold text-blue-900">
                    #{selectedUser.matchId}
                  </span>
                </div>

                {profileEmail && (
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">Email:</span>
                    <span className="font-bold text-blue-900">{profileEmail}</span>
                  </div>
                )}

                {profilePhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Phone:</span>
                    <span className="font-bold text-blue-900">{profilePhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="bg-gray-50 p-4 flex justify-end border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-bold"
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
