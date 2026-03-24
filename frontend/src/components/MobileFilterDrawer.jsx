const MobileFilterDrawer = ({ open, onClose, categories, active, onChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
      <div className="bg-white w-72 h-full p-6">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Categories</h3>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        <ul className="space-y-2 text-sm">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => {
                onChange(cat);
                onClose();
              }}
              className={`px-3 py-2 rounded cursor-pointer transition
                ${
                  active === cat
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              {cat}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default MobileFilterDrawer;
