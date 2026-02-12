import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md transition"
    >
      {text}
    </button>
  );
};

export default Button;
