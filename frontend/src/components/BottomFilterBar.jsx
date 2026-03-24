const BottomFilterBar = ({ onFilterOpen }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t md:hidden">
      <button
        onClick={onFilterOpen}
        className="w-full py-3 text-sm font-medium"
      >
        Filter & Categories
      </button>
    </div>
  );
};

export default BottomFilterBar;
