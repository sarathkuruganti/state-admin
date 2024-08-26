import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { auth } from './../../../firebase'; // Ensure the path is correct
import { signOut } from 'firebase/auth';

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('user'); // Clear session storage
      navigate('/auth/sign-in'); // Redirect to the sign-in page
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  return (
    <aside
      className={`bg-gradient-to-br from-black to-black ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Typography variant="h5" color="white" className="flex justify-center mt-5">
          {brandName}
        </Typography>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden mr-5"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color="white"
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={isActive ? "green" : "white"}
                      className="flex items-center gap-4 px-4 capitalize"
                      onClick={() => setOpenSidenav(dispatch, false)}
                      fullWidth
                    >
                      {icon}
                      <Typography color="inherit" className="font-medium capitalize">
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
        {/* Logout Button */}
        <div className="-mt-2">
          <Button
            onClick={handleLogout}
            variant="text"
            color="red"
            className="flex items-center gap-4 px-4 capitalize"
            fullWidth
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
            <Typography color="inherit" className="font-medium capitalize">
              Logout
            </Typography>
          </Button>
        </div>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "State Admin",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;