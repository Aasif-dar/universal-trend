import Categories from "../components/Catergories";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import PopularProducts from '../components/PopularProducts'

const Home = () => {
  return (
    <>
      <HeroBanner />
      <Categories/>
       <PopularProducts />
       <Footer/>
    </>
  );
};

export default Home;
