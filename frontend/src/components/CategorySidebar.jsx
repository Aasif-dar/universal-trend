const CategorySidebar = ({ categories, active, onChange }) => {
  return (
    <aside className="bg-white p-6 rounded-lg border shadow-sm h-fit sticky top-24">
      <h3 className="text-lg font-medium mb-6">
        Categories
      </h3>

      <ul className="space-y-2 text-sm">
        {categories.map((cat) => (
          <li
            key={cat}
            onClick={() => onChange(cat)}
            className={`cursor-pointer px-3 py-2 rounded transition
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
    </aside>
  );
};

export default CategorySidebar;
