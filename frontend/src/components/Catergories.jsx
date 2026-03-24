import categories from "../data/CategoriesProduct";
import CategoryCard from "./CategoryCard";

const Categories = () => {
  return (
    <section className="py-14 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8">
          Categories
        </h2>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;
