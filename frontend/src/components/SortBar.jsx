const SortBar = ({ count, sortValue, onSortChange }) => {
  return (
    <div className="flex items-center justify-between gap-5 ">
      <p className="text-sm text-black">
        Showing {count} products
      </p>

      <select
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="border px-3 py-2 text-sm outline-none bg-white  "
      >
        <option value="default">Sort by</option>
        <option value="priceLowHigh">Price: Low to High</option>
        <option value="priceHighLow">Price: High to Low</option>
        <option value="nameAZ">Name: A–Z</option>
      </select>
    </div>
  );
};

export default SortBar;
