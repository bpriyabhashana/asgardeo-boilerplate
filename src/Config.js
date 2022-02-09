export const authConfig = {
  signInRedirectURL: `${process.env.REACT_APP_BASE_URL}`,
  signOutRedirectURL: `${process.env.REACT_APP_BASE_URL}`,
  clientID: `${process.env.REACT_APP_ASGARDEO_CLIENT_ID}`,
  serverOrigin: `${process.env.REACT_APP_ASGARDEO_SERVER_ORIGIN}`,
  scope: ["openid"],
};
