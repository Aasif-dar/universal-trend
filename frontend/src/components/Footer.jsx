const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Shop Info */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">
            Universal Trend
          </h3>
          <p className="text-sm leading-relaxed">
            Universal Trend is your one-stop destination for fashion,
            footwear, and fragrances. We bring you modern styles
            crafted for comfort and confidence.
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Follow Us
          </h4>

          <div className="flex gap-4 text-2xl">
            <a href="#" className="hover:text-white">📸</a>
            <a href="#" className="hover:text-white">📘</a>
            <a href="#" className="hover:text-white">💬</a>
          </div>

          <p className="text-sm mt-4">
            Instagram • Facebook • WhatsApp
          </p>
        </div>

        {/* Map */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Visit Our Store
          </h4>

          <div className="w-full h-40 rounded overflow-hidden">
            <iframe
              title="shop-location"
              src="https://www.google.com/maps?q=New%20Delhi&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 py-4 text-center text-sm">
        © {new Date().getFullYear()} Universal Trend. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
