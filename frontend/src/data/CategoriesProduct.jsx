import shirtImage from "../assets/shirtcategory.webp"
import shortsImage from "../assets/shortsimage.webp"
import womenSweater from "../assets/womensweater.webp"
import menshoes from "../assets/menshoes.webp"
import mensTshirt from "../assets/menTshirt.webp"
import deodrentsandattars from "../assets/deodrentsandattars.webp"
import mensJeans from "../assets/mensjeans.webp"
import mensJacktes from "../assets/mensjacket.webp"
import mensHoodies from "../assets/mensHoodie.webp"
import Accessories from "../assets/accessories.webp"
import WomensBags from "../assets/womensBags.webp"
import WomenShoes from "../assets/womensShoes.webp"
const categories = [
  {
    id: 1,
    title: "Men's Shirts",
    subtitle: "Trending Styles",
    image: shirtImage,
    path: "/men",
    category: "Shirts",
  },
  {
    id: 2,
    title: "Men's Shorts",
    subtitle: "Summer Picks",
    image: shortsImage,
    path: "/men",
    category: "Shorts",
  },
  {
    id: 3,
    title: "Men's Hoodies",
    subtitle: "Winter Collection",
    image: mensHoodies,
    path: "/men",
    category: "Uppers",
  },
    {
    id: 4,
    title: "Accessories",
    subtitle: "Caps & Belts ",
    image: Accessories,
    path: "/men",
    category: "Accessories",
  },
  {
    id: 5,
    title: "Women's Bags",
    subtitle: "New Arrivals",
    image: WomensBags,
    path: "/women",
    category: "Bags",
  },
  {
    id: 6,
    title: "Men's Jackets",
    subtitle: "Top Picks",
    image: mensJacktes,
    path: "/men",
    category: "Jackets",
  },
  {
    id: 7,
    title: "Men's Jeans",
    subtitle: "Best Sellers",
    image: mensJeans,
    path: "/men",
    category: "Jeans",
  },
  {
    id: 8,
    title: "Men's Shoes",
    subtitle: "Latest Styles",
    image: menshoes,
    path: "/men",
    category: "Shoes",
  },
  {
    id: 9,
    title: "Men's T-Shirts",
    subtitle: "Casual Wear",
    image: mensTshirt,
    path: "/men",
    category: "Tshirts",
  },
  {
    id: 10,
    title: "Fragrance",
    subtitle: "Deodorants & Attars",
    image: deodrentsandattars,
    path: "/fragrances",
    category: "All",
  },
  {
    id: 11,
    title: "Women's Shoes",
    subtitle: "Style that speaks with every step",
    image: WomenShoes,
    path: "/women",
    category: "Bags",
  },
    {
    id: 12,
    title: "Women's Sweaters",
    subtitle: "Winter Collection",
    image: womenSweater,
    path: "/women",
    category: "Sweaters",
  },
];

export default categories;