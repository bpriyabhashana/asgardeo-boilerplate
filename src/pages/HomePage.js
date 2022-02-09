import { useAuthContext } from "@asgardeo/auth-react";
import React, { useEffect, useState } from "react";
import { authConfig } from "../Config";
import Main from "../components/Main";
import Default from "../layouts/Default";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
    })();
  }, [state.isAuthenticated]);

  const handleLogin = () => {
    signIn().catch(() => setHasAuthenticationErrors(true));
  };

  const handleLogout = () => {
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
      <Default isLoading={state.isLoading} hasErrors={hasAuthenticationErrors}>
        {state.isAuthenticated ? (
          <div className="content">
            <Main derivedResponse={derivedAuthenticationState} />
            <button
              className="btn primary mt-4"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
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
                          <Typography variant="h4">Asgardeo Auth</Typography>
                        </Grid>
                        {/* Handle Error authenticationError */}
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
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
