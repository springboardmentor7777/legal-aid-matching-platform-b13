const Button = ({ text, onClick, className = "", style = {} }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-white py-2 rounded-lg transition duration-200 hover:opacity-90 ${className}`}
      style={style}
    >
      {text}
    </button>
  );
};

export default Button;