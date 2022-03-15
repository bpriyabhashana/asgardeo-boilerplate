import { useAuthContext } from "@asgardeo/auth-react";
import React, { useEffect, useState, useContext } from "react";
import { authConfig, APP_NAME } from "../Config";
import Main from "../components/Main";
import Default from "../layouts/Default";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";

import { PAGES } from "../Config";
import NotFound from "./NotFound";
import { Context } from "../store/ApimTokenStore";
import LoadingScreen from "../components/LoadingScreen";

import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

const useStyle = makeStyles(() => ({
  pageStyle: {
    width: "100vw",
    height: "100vh",
    display: "table-cell",
    textAlign: "center",
    verticalAlign: "middle",
    backgroundColor: "rgb(244, 246, 248)",
  },
  loadingpageStyle: {
    width: "100vw",
    height: "95vh",
    display: "table-cell",
    textAlign: "center",
    verticalAlign: "middle",
    // backgroundColor: "rgb(244, 246, 248)",
  },
}));

const HomePage = () => {
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
  } = useAuthContext();

  const classes = useStyle();

  const [derivedAuthenticationState, setDerivedAuthenticationState] =
    useState(null);
  const [hasAuthenticationErrors, setHasAuthenticationErrors] = useState(false);
  const [apimTokenObj, setApimTokenObj] = useContext(Context);
  const [apimReq, setapimReq] = useState(false);

  useEffect(() => {
    if (!state?.isAuthenticated) {
      return;
    }

    (async () => {
      const basicUserInfo = await getBasicUserInfo();
      const idToken = await getIDToken();
      const decodedIDToken = await getDecodedIDToken();

      const derivedState = {
        authenticateResponse: basicUserInfo,
        idToken: idToken.split("."),
        decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
        decodedIDTokenPayload: decodedIDToken,
      };

      setDerivedAuthenticationState(derivedState);

      // setTimeout(() => {
      //   getAPIMToken(idToken);
      // }, 5000);
      getAPIMToken(idToken);
    })();
  }, [state.isAuthenticated]);

  const getAPIMToken = async (idToken) => {
    let headers = {
      Authorization:
        "Basic " +
        btoa(
          `${process.env.REACT_APP_APIM_IDP_CLIENT_ID}:${process.env.REACT_APP_APIM_IDP_CLIENT_SECRET}`
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    };
    let grantType =
      encodeURIComponent("grant_type") +
      "=" +
      encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer");
    let assertion =
      encodeURIComponent("assertion") + "=" + encodeURIComponent(idToken);

    let formBody = [grantType, assertion];

    await axios({
      method: "post",
      url: process.env.REACT_APP_APIM_TOKEN_ENDPOINT,
      headers: headers,
      data: formBody.join("&"),
    })
      .then((response) => {
        setApimTokenObj(response.data);
        setapimReq(true);
      })
      .catch((e) => {
        console.error(e);
        setHasAuthenticationErrors(true);
      });
  };

  const handleLogin = () => {
    signIn().catch(() => setHasAuthenticationErrors(true));
  };

  const handleLogout = () => {
    setapimReq();
    signOut();
  };

  if (!authConfig?.clientID) {
    return (
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
    );
  }
  return (
    <>
      <Default
        isLoading={state.isLoading}
        isApimToken={apimReq}
        hasErrors={hasAuthenticationErrors}
      >
        {state.isAuthenticated ? (
          <div className="content">
            <BrowserRouter>
              <Switch>
                <Route
                  path={PAGES.CHILD_COMPONENT}
                  render={({ match, location, history }) => {
                    return (
                      <>
                        {apimTokenObj ? (
                          <Main
                            page={location.pathname}
                            derivedResponse={derivedAuthenticationState}
                          />
                        ) : (
                          <LoadingScreen
                            message={"Waiting for APIM token ..."}
                          />
                        )}
                      </>
                    );
                  }}
                />
                <Redirect exact from="/" to={PAGES.CHILD_COMPONENT} />
                <Route component={NotFound} />
              </Switch>
            </BrowserRouter>
          </div>
        ) : (
          <div className={classes.pageStyle}>
            <Box
              sx={{
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
                          <Typography variant="h4">{APP_NAME}</Typography>
                        </Grid>
                        {/* Handle Error authenticationError */}
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              handleLogin();
                            }}
                          >
                            Login
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                  <Divider />
                </Card>
              </Container>
            </Box>
          </div>
        )}
      </Default>
    </>
  );
};

export default HomePage;
