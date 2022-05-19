export const APP_NAME = "Internal Apps";

export const APP_CONTEXT = "/internal";

export const AUTH_CONFIG = {
  signInRedirectURL: `${process.env.REACT_APP_BASE_URL}`,
  signOutRedirectURL: `${process.env.REACT_APP_BASE_URL}`,
  clientID: `${process.env.REACT_APP_ASGARDEO_CLIENT_ID}`,
  serverOrigin: `${process.env.REACT_APP_ASGARDEO_SERVER_ORIGIN}`,
  scope: ["openid", "FinanceMIS"],
};

// If APIM token not necessary set value to false
export const OAUTH_CONFIG = {
  SKIP_TOKEN_EXCHANGE: false,
};

export const APIM_HEADERS = {
  Authorization:
    "Basic " +
    btoa(
      `${process.env.REACT_APP_APIM_IDP_CLIENT_ID}:${process.env.REACT_APP_APIM_IDP_CLIENT_SECRET}`
    ),
  "Content-Type": "application/x-www-form-urlencoded",
};

export const APIM_CLIENT = {
  APIM_TOKEN_ENDPOINT: `${process.env.REACT_APP_APIM_TOKEN_ENDPOINT}`,
};

// User configs - Customize according to the choice of user
export const USER_CUSTOM_CONFIGS = {
  LAUNCHPAD: true,
};

export const APP_CONFIG = {
  PAGES: {
    APP: APP_CONTEXT,
    HOME: APP_CONTEXT + "/home",
    MANAGE: APP_CONTEXT + "/manage",
  },
  EMAILS: {
    GET_HELP_EMAIL_TO: "internal-apps-group@wso2.com",
    GET_HELP_EMAIL_SUBJECT: `[HELP] ${APP_NAME}`,
  },
  QUERY_VALUES: {
    VIEW: "view",
    EDIT: "edit",
    ACCOUNT: "account",
    TAGS: "tags",
    ROLES: "roles",
  },
};

// ------------ old implementation ---------

export const PAGES = {
  BASE_URL: "/",
  CHILD_COMPONENT: "/dashboard",
  PAGE_ONE: "/dashboard/home",
  PAGE_TWO: "/dashboard/collection",
};

export const NAV_LIST = {
  BASE_URL: "Base Path",
};

export const LAUNCHPAD_ITEMS = [
  {
    id: 1,
    title: "Photos",
    category: "Marketing",
    description: "Marketing application make your life easier",
    isStared: true,
    url: "https://apps.wso2.com/",
    icon: "https://purepng.com/public/uploads/large/purepng.com-photos-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596102asedt.png",
  },
  {
    id: 2,
    title: "Camera",
    category: "General",
    description: "General applications",
    isStared: true,
    url: "https://apps.wso2.com/",
    icon: "https://i.pinimg.com/originals/e2/bc/2b/e2bc2b005d593253f62a4727d3da5d4f.png",
  },
  {
    id: 3,
    title: "Calender",
    category: "HR",
    description: "Human Resource application",
    isStared: true,
    url: "https://apps.wso2.com/",
    icon: "https://i.pinimg.com/originals/1c/18/61/1c1861046d8f837de76fa78fcad98b7a.png",
  },
  {
    id: 4,
    title: "Stocks",
    category: "Sites",
    description: "All recordes sites are here",
    isStared: false,
    url: "https://apps.wso2.com/",
    icon: "https://cdn0.iconfinder.com/data/icons/apple-apps/100/Apple_Stock-512.png",
  },
  {
    id: 5,
    title: "Videos",
    category: "Marketing",
    description: "Marketing application make your life easier",
    isStared: true,
    url: "https://apps.wso2.com/",
    icon: "https://purepng.com/public/uploads/large/purepng.com-videos-icon-ios-7symbolsiconsapple-iosiosios-7-iconsios-7-721522596692wqfcj.png",
  },
  {
    id: 6,
    title: "Music",
    category: "HR",
    description: "HR perspectives",
    isStared: true,
    url: "https://apps.wso2.com/",
    icon: "https://i.pinimg.com/originals/ae/2e/56/ae2e5651b74a00d5d31b8c6453fa3ebb.png",
  },
  {
    id: 7,
    title: "Voice",
    category: "Sites",
    description: "Marketing application make your life easier",
    isStared: true,
    url: "https://apps.wso2.com/",
    icon: "https://i.pinimg.com/originals/13/6f/6b/136f6b5e8bc194b681b591dc61e16b36.png",
  },
];
