
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Men", path: "/men" },
    { name: "Women", path: "/women" },
    { name: "Fragrances", path: "/fragrances" },
  ];

  return (
    <nav className=" sm:block bg-black">
      <ul className="flex justify-center gap-10 h-12 items-center text-white text-sm">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `relative pb-1 ${
                isActive
                  ? "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-white"
                  : "hover:after:absolute hover:after:left-0 hover:after:-bottom-1 hover:after:h-[2px] hover:after:w-full hover:after:bg-white"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
