import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  return (
    <Navbar
      color={"white"}
      className={`rounded-xl transition-all sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5 ${fixedNavbar ? "mt-1" : ""}  mb-4 lg:hidden`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <div className="flex justify-center">
              <img src="https://mevn.in/apps/ocean/logo.png" alt="Logo" className="h-14 w-28"/>
            </div>
          </div>
        <div className="capitalize">
          <Typography variant="h5" color="blue-gray">
            {page}
          </Typography>
        </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden ml-3"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
