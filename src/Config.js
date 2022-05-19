export const APP_NAME = "Internal Apps";

export const APP_CONTEXT = "/internal";

export const AUTH_CONFIG = {
  signInRedirectURL: `${process.env.REACT_APP_BASE_URL}`,
  signOutRedirectURL: `${process.env.REACT_APP_BASE_URL}`,
  clientID: `${process.env.REACT_APP_ASGARDEO_CLIENT_ID}`,
  serverOrigin: `${process.env.REACT_APP_ASGARDEO_SERVER_ORIGIN}`,
  scope: ["openid", "FinanceMIS"],
};

export const APP_CONFIG = {
  PAGES: {
    APP: APP_CONTEXT,
    HOME: APP_CONTEXT + "/home",
    RECURRING: APP_CONTEXT + "/recurring",
    COLLECTIONS: APP_CONTEXT + "/collections",
    FAVOURITES: APP_CONTEXT + "/favourites",
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

export const OAUTH_CONFIG = {
  SKIP_TOKEN_EXCHANGE: false,
  BEARER_TOKEN: "TODO",
  TOKEN_APIS: {
    // ASGARDEO_TOKEN_EXCHANGE: "https://avishkaariyaratne.choreoapis.dev/tokenendpoint/1.0.0/tokenExchange",
    ASGARDEO_TOKEN_EXCHANGE:
      "https://staging-apps.private.wso2.com/oauth2/oauth2/token",
    AUTH_HEADER: "Basic TODO",
  },
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
