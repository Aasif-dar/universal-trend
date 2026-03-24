import shirtImage from "../assets/shirtcategory.png"
import shortsImage from "../assets/shortsimage.png"
import womenSweater from "../assets/womensweater.png"
import menshoes from "../assets/menshoes.png"
import mensTshirt from "../assets/menTshirt.png"
import deodrentsandattars from "../assets/deodrentsandattars.png"
import mensJeans from "../assets/mensjeans.png"
import mensJacktes from "../assets/mensjacket.png"
import mensHoodies from "../assets/mensHoodie.png"
import Accessories from "../assets/accessories.png"
import WomensBags from "../assets/womensBags.png"
import WomenShoes from "../assets/womensShoes.png"
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
    title: "Women's Sweaters",
    subtitle: "Winter Collection",
    image: womenSweater,
    path: "/women",
    category: "Sweaters",
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
    title: "Accessories",
    subtitle: "Caps & Belts ",
    image: Accessories,
    path: "/men",
    category: "Accessories",
  },
  {
    id: 12,
    title: "Women's Shoes",
    subtitle: "Style that speaks with every step",
    image: WomenShoes,
    path: "/women",
    category: "Bags",
  },
];

export default categories;