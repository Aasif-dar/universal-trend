// import Logo from "./Logo";
// const NavBar = ({ isOpen, onClose }) => {
//   return (
//     <>
//       {/* Desktop Navbar */}
//       <nav className="hidden sm:block w-full bg-black">
//          {/* <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
//           <Logo />
//           </div>
//             */}
//         <ul className="flex justify-center items-center gap-10 h-12 text-white text-sm font-medium">
//           {["Home", "Men", "Women", "Fragrances"].map((item) => (
//             <li
//               key={item}
//               className="cursor-pointer relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white hover:after:w-full after:transition-all"
//             >
//               {item}
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Mobile Drawer */}
//       {isOpen && (
//         <div className="sm:hidden fixed inset-0 z-40 bg-black/50">
//           <div className="bg-white w-64 h-full p-6">
//             <button
//               className="mb-6 text-xl"
//               onClick={onClose}
//             >
//               ✕
//             </button>

//             <ul className="flex flex-col gap-4 text-lg font-medium">
//               {["Home", "Men", "Women", "Fragrances"].map((item) => (
//                 <li key={item} className="cursor-pointer">
//                   {item}
//                 </li>
//               ))}
//             </ul>

//             <button className="mt-6 border border-black w-full py-2 font-medium">
//               Login
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default NavBar;

// import { NavLink } from "react-router-dom";

// const NavBar = () => {
//   const links = [
//     { name: "Home", path: "/" },
//     { name: "Men", path: "/men" },
//     { name: "Women", path: "/women" },
//     { name: "Fragrances", path: "/fragrances" },
//   ];

//   return (
//     <nav className="hidden sm:block w-full bg-black">
//       <ul className="flex justify-center items-center gap-10 h-12 text-white text-sm font-medium">
//         {links.map((link) => (
//           <li key={link.name}>
//             <NavLink
//               to={link.path}
//               className={({ isActive }) =>
//                 `relative pb-1 transition ${
//                   isActive
//                     ? "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-white"
//                     : "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white hover:after:w-full after:transition-all"
//                 }`
//               }
//             >
//               {link.name}
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default NavBar;

// import { NavLink } from "react-router-dom";

// const NavBar = () => {
//   const links = [
//     { name: "Home", path: "/" },
//     { name: "Men", path: "/men" },
//     { name: "Women", path: "/women" },
//     { name: "Fragrances", path: "/fragrances" },
//   ];

//   return (
//     <nav className="hidden sm:block bg-black">
//       <ul className="flex justify-center gap-10 h-12 items-center text-white text-sm">
//         {links.map((link) => (
//           <NavLink
//             key={link.name}
//             to={link.path}
//             className={({ isActive }) =>
//               `relative pb-1 ${
//                 isActive
//                   ? "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-white"
//                   : "hover:after:absolute hover:after:left-0 hover:after:-bottom-1 hover:after:h-[2px] hover:after:w-full hover:after:bg-white"
//               }`
//             }
//           >
//             {link.name}
//           </NavLink>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default NavBar;



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
