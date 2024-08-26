import {
  HomeIcon,
  UserCircleIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { Home, Orders, Products, Invoice, Register, Users, Account } from "@/pages/dashboard";
import { SignIn, ForgotPassword } from "@/pages/auth";
import { AddNewProduct, InvoiceDetails, ViewOrder } from "@/pages/screen";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "products",
        path: "/products",
        element: <Products />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "invoice",
        path: "/invoice",
        element: <Invoice />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "register",
        path: "/register",
        element: <Register />,
      },
      {
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "users",
        path: "/users",
        element: <Users />,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "account",
        path: "/account",
        element: <Account />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "forgot-password",
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    layout: "screen",
    pages: [
      {
        name: "addnewproduct",
        path: "/addnewproduct",
        element: <AddNewProduct />,
      },
      {
        name: "invoicedetails",
        path: "/invoicedetails/:invoiceNumber",
        element: <InvoiceDetails />,
      },
      {
        name: "vieworder",
        path: "/vieworder",
        element: <ViewOrder />,
      },
    ],
  },
];

export default routes;
