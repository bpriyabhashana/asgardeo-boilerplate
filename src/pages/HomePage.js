import { Fragment } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Helmet } from "react-helmet";
import {
  setIdToken,
  setUserName,
  getUserName,
  setUserRoles,
  getUserRoles,
  setRefreshTokenFunction,
  getNewAPIToken,
  getToken,
  getAuthError,
} from "../utils/oauth";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { APP_NAME, APP_CONFIG, AUTH_CONFIG, OAUTH_CONFIG } from "../Config";
import MainLayout from "../components/MainLayout";
import UserContext from "../context/user-context";
import NotFound from "./NotFound";

const HomePage = () => {
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
    refreshAccessToken,
  } = useAuthContext();
  const [loggedOutStatus, setLoggedOutStatus] = useState("");
  const [loadApp, setLoadApp] = useState(false);
  const [authenticateState, setAuthenticateState] = useState(null);
  const [authenticationError, setAuthenticationError] = useState(false);

  useEffect(() => {
    if (getIsInitLogin()) {
      signIn().catch((error) => {
        setAuthenticationError(true);
        setLoggedOutStatus("Error while logging in!");
      });
    }
  }, []);

  const getIsInitLogin = () => {
    if (sessionStorage.getItem("isInitLogin") === "true") {
      return true;
    } else {
      return false;
    }
  };

  const getLogInStatus = () => {
    return state.isAuthenticated && loadApp;
  };

  const timedOutLogoutListener = () => {
    setTimeout(function () {
      let logInStatus = getLogInStatus();
      if (!logInStatus) {
        handleLogout();
      }
    }, 10000);
  };

  const setIsInitLogin = (value) => {
    sessionStorage.setItem("isInitLogin", value);
  };

  const handleLogin = () => {
    setIsInitLogin("true");
    setLoggedOutStatus("Redirecting to Asgardeo...");
    signIn();
  };

  const handleLogout = () => {
    signOut();
    setIsInitLogin("false");
  };

  const handleRefreshToken = () => {
    return refreshAccessToken()
      .then(async (e) => {
        const idToken = await getIDToken();
        return idToken;
      })
      .catch((err) => {
        if (err) {
          let expirationJWT = authenticateState?.decodedIDTokenPayload?.exp;
          if (!expirationJWT || Date.now() >= expirationJWT * 1000) {
            handleLogout();
          }
        }
      });
  };

  useEffect(() => {
    if (state?.isAuthenticated) {
      setRefreshTokenFunction(handleRefreshToken);
      const getData = async () => {
        const basicUserInfo = await getBasicUserInfo();
        const idToken = await getIDToken();
        const decodedIDToken = await getDecodedIDToken();

        const authState = {
          authenticateResponse: basicUserInfo,
          idToken: idToken.split("."),
          decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
          decodedIDTokenPayload: decodedIDToken,
        };
        setIdToken(idToken);
        if (idToken) {
          if (OAUTH_CONFIG.SKIP_TOKEN_EXCHANGE) {
            setLoadApp(true);
          } else {
            getNewAPIToken(() => {
              setLoadApp(true);
            });
          }
        }

        if (basicUserInfo?.email) {
          setUserName(basicUserInfo.email);
        }
        if (basicUserInfo?.groups) {
          setUserRoles(basicUserInfo.groups);
        }
        setAuthenticateState(authState);
      };
      getData();
    }
  }, [state.isAuthenticated]);

  useEffect(() => {
    // timedOutLogoutListener();
    if (state?.isAuthenticated) {
      const getData = async () => {
        const basicUserInfo = await getBasicUserInfo();
        const idToken = await getIDToken();
        const decodedIDToken = await getDecodedIDToken();

        const authState = {
          authenticateResponse: basicUserInfo,
          idToken: idToken.split("."),
          decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
          decodedIDTokenPayload: decodedIDToken,
        };
        setIdToken(idToken);
        if (idToken) {
          setLoadApp(true);
        }
        if (basicUserInfo?.email) {
          setUserName(basicUserInfo.email);
        }
        if (basicUserInfo?.groups) {
          setUserRoles(basicUserInfo.groups);
        }
        setAuthenticateState(authState);
      };
      getData();
    } else {
      if (!getToken()) {
        setIdToken(handleRefreshToken());
      }
    }
  }, []);

  return (
    <Fragment>
      {AUTH_CONFIG.clientID === "" ? (
        <div className="content">
          <h2>You need to update the Client ID to proceed.</h2>
          <p>
            Please open "src/config.json" file using an editor, and update the{" "}
            <code>clientID</code> value with the registered application's client
            ID.
          </p>
          <p>
            Visit repo{" "}
            <a href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-app">
              README
            </a>{" "}
            for more details.
          </p>
        </div>
      ) : state.isAuthenticated && loadApp ? (
        <UserContext.Provider
          value={{
            userName: getUserName(),
            userRoles: getUserRoles(),
            handleLogin,
            handleLogout,
            handleRefreshToken,
          }}
        >
          <BrowserRouter>
            <Switch>
              <Route
                path={APP_CONFIG.PAGES.APP}
                render={({ match, location, history }) => {
                  return <MainLayout page={location.pathname} />;
                }}
              />
              <Redirect exact from="/" to={APP_CONFIG.PAGES.APP} />
              <Route component={NotFound} />
            </Switch>
          </BrowserRouter>
        </UserContext.Provider>
      ) : (
        <>
          {/* <Helmet> */}
          <title>Login | {APP_NAME}</title>
          {/* </Helmet> */}
          <Box
            sx={{
              backgroundColor: "background.default",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Container maxWidth="md">
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      p: 2,
                    }}
                  >
                    <Grid
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={12}>
                        <img
                          alt="logo"
                          width="150"
                          height="auto"
                          src="https://wso2.cachefly.net/wso2/sites/images/brand/downloads/wso2-logo.png"
                        ></img>
                      </Grid>
                      <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="h2">{APP_NAME}</Typography>
                      </Grid>
                      {/* Handle Error authenticationError */}
                      {console.log(getAuthError())}
                      {getAuthError() ? (
                        <Grid item xs={12}>
                          <LoadingButton
                            id="login"
                            onClick={() => {
                              handleLogout();
                            }}
                            variant="outlined"
                            color="secondary"
                          >
                            Retry
                          </LoadingButton>
                        </Grid>
                      ) : (
                        <>
                          <Grid item xs={12}>
                            <LoadingButton
                              id="login"
                              onClick={() => {
                                handleLogin();
                              }}
                              variant="contained"
                              color="secondary"
                              loading={getIsInitLogin()}
                              loadingPosition="center"
                            >
                              Log In
                            </LoadingButton>
                          </Grid>
                          {getIsInitLogin() ? (
                            <Grid item xs={12}>
                              <Typography variant="caption">
                                Redirecting to Asgardeo...
                              </Typography>
                            </Grid>
                          ) : (
                            <Grid item xs={12}>
                              <Typography variant="caption">
                                {loggedOutStatus}
                              </Typography>
                            </Grid>
                          )}
                        </>
                      )}
                    </Grid>
                  </Box>
                </CardContent>
                <Divider />
              </Card>
            </Container>
          </Box>
        </>
      )}
    </Fragment>
  );
};

export default HomePage;
