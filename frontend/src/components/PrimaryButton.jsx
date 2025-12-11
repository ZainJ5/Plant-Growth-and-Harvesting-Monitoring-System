// basic green button with good animations on hover and click

const PrimaryButton = ({ children, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;