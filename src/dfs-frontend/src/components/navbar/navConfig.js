import { USER_STATE } from "../../withAuth";

export const NAV_CONFIG = [
  {
    name: "My Data",
    pathname: "/my-data",
    permissions: USER_STATE.SIGNED_IN,
  },
  {
    name: "My Models",
    pathname: "/dataModels",
    permissions: USER_STATE.SIGNED_IN,
  },
  {
    name: "Datasets",
    pathname: "/datasets",
    permissions: USER_STATE.ANY,
    options: [],
  },
  {
    name: "About Us",
    permissions: USER_STATE.ANY,
    options: [{
      name: "Architecture",
      pathname: "/architecture",
    }, 
    {
      name: "Overview",
      pathname: "/",
    },
    {
      name: "About",
      pathname: "/about",
    },
    {
      name: "Team",
      pathname: "/team",
    }],
  },
  {
    name: "Groups",
    pathname: "/groups",
    permissions: USER_STATE.SIGNED_IN,
    options: [],
  },
  {
    name: "Contact",
    pathname: "/contact",
    permissions: USER_STATE.ANY,
    options: [],
  },
  {
    name: "Verify Datasets",
    pathname: "/verify",
    permissions: USER_STATE.ADMIN,
    options: [],
  },
  {
    name: "Domains",
    pathname: "/domain",
    permissions: "ADMIN",
    options: [],
  },
  {
    name: "Tools",
    permissions: USER_STATE.ANY,
    options: [{
      name: "ML Challenges",
      pathname: "/mlc",
      redirect: true,
    }],
  },

];
