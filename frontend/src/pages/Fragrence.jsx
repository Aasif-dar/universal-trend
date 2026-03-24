import { useState } from "react";
import fragranceProducts from "../data/FragrenceProducts";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import SortBar from "../components/SortBar";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import Footer from "../components/Footer";

const categories = [
  "All",
  "Attars",
  "Perfumes",
  "Deodorants",
  "Attar Deodorants",
];

const sortProducts = (products, sort) => {
  if (sort === "priceLowHigh") return [...products].sort((a, b) => a.price - b.price);
  if (sort === "priceHighLow") return [...products].sort((a, b) => b.price - a.price);
  if (sort === "nameAZ") return [...products].sort((a, b) => a.name.localeCompare(b.name));
  return products;
};

const Fragrances = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered =
    activeCategory === "All"
      ? fragranceProducts
      : fragranceProducts.filter(p => p.category === activeCategory);

  const sortedProducts = sortProducts(filtered, sort);

  return (
    <div>
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Home / Fragrances</p>
          <h1 className="text-3xl font-semibold">Fragrances</h1>
        </div>

        {/* Mobile Top Bar */} 
          <div className="flex justify-between items-center mb-6 md:hidden">
           <button
            onClick={() => setMobileFilterOpen(true)}
            className="border px-4 py-2 text-sm flex items-center"
          >
           <span className="font-bold">Filter:</span> {activeCategory}
          </button>

          <SortBar
            count={sortedProducts.length}
            sortValue={sort}
            onSortChange={setSort}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <CategorySidebar
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          {/* Products */}
          <div className="md:col-span-3">

            <div className="hidden md:block">
              <SortBar
                count={sortedProducts.length}
                sortValue={sort}
                onSortChange={setSort}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

      </div>
    </section>
    <Footer/>
    </div>
  );
};

export default Fragrances;
