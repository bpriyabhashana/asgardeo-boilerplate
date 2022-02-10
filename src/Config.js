export const APP_NAME = "Asgardeo Auth";

export const authConfig = {
  signInRedirectURL: `${process.env.REACT_APP_BASE_URL}`,
  signOutRedirectURL: `${process.env.REACT_APP_BASE_URL}`,
  clientID: `${process.env.REACT_APP_ASGARDEO_CLIENT_ID}`,
  serverOrigin: `${process.env.REACT_APP_ASGARDEO_SERVER_ORIGIN}`,
  scope: ["openid"],
};

export const PAGES = {
  BASE_URL: "/",
  CHILD_COMPONENT: "/finance-mis",
  PAGE_ONE: "/finance-mis/flash-dashboard",
  PAGE_TWO: "/finance-mis/flash-report",
};

export const NAV_LIST = {
  BASE_URL: "Base Path",
};
