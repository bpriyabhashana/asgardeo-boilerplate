import { useState, useEffect, useRef } from "react";
import useHttp from "../utils/http";
import { Route, Switch, Redirect } from "react-router-dom";
import { Button, experimentalStyled } from "@mui/material";
// import { Button } from "@material-ui/core";
import MainNavbar from "./MainNavbar";
import SideBar from "./Sidebar";
import NotFound from "../pages/NotFound";
import { APP_CONFIG } from "../Config.js";
import Snackbars from "./ui/Snackbars";
import { setUserAccessMap, getToken, getIdToken } from "../utils/oauth";
import ErrorDialog from "./dialog/ErrorDialog";

const MainLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const MainLayoutWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 64,
  // [theme.breakpoints.up('lg')]: {
  //   paddingLeft: 10
  // }
}));

const MainLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const MainLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

const MainLayout = (props) => {
  const { isLoading, data, error, sendRequest, reqExtra, isOpen } = useHttp();
  const [appInitialized, setAppInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(null);
  const [hoverActive, setHoverActive] = useState(true);
  const [errorDialog, setErrorDialog] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const sidebarTimer = useRef(true);

  const loadData = () => {
    sendRequest(
      APP_CONFIG.APIS.INITIALIZE_APP,
      "GET",
      null,
      APP_CONFIG.APIS.INITIALIZE_APP
    );
  };

  const handleDrawerToggle = () => {
    if (open) {
      handleDrawerClose();
    } else {
      handleDrawerOpen();
    }
  };

  const handleErrorDialog = (errorContent) => {
    setErrorDialog(errorContent ? errorContent : null);
  };

  const handleSnackbar = (message, severity) => {
    if (message) {
      setSnackbar({ message, severity });
    } else {
      setSnackbar(null);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    setHoverActive(false);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setHoverActive(false);
    setTimeout(() => {
      setHoverActive(true);
    }, 250);
  };

  const handleDrawerHoverOver = () => {
    sidebarTimer.current = true;
    if (hoverActive && !open) {
      setTimeout(() => {
        if (sidebarTimer.current) {
          setOpen(true);
        }
      }, 100);
    }
  };

  const handleDrawerHoverOut = () => {
    sidebarTimer.current = false;
    if (hoverActive && open) {
      setOpen(false);
    }
  };

  const handleSetIntializedApp = () => {
    setAppInitialized(true);
  };

  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  // useEffect(() => {
  //   switch (reqExtra) {
  //     case APP_CONFIG.APIS.INITIALIZE_APP:
  //       if (data && data.data) {
  //         if (data.data.rolesAccessMap) {
  //           setUserAccessMap(data.data.rolesAccessMap, handleSetIntializedApp);
  //         }
  //       } else if (error) {
  //         handleErrorDialog({
  //           message: "Failed to initialize application! Cannot reach services.",
  //         });
  //         handleSnackbar("App initialization failed", "error");
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }, [data, reqExtra, isOpen, isLoading, error]);

  // useEffect(() => {
  //   loadData();
  // }, []);

  return (
    <MainLayoutRoot>
      <MainNavbar
        open={open}
        hoverActive={hoverActive}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        handleDrawerHoverOver={handleDrawerHoverOver}
        handleDrawerHoverOut={handleDrawerHoverOut}
      />
      <div onMouseOver={handleDrawerHoverOver}>
        <SideBar open={open} hoverActive={hoverActive} page={page} />
      </div>
      <MainLayoutWrapper onMouseOver={handleDrawerHoverOut}>
        <MainLayoutContainer>
          <MainLayoutContent>
            <Switch>
              <Route
                exact
                path={APP_CONFIG.PAGES.HOME}
                render={({ match, location, history }) => {
                  return (
                    <>
                      {/* // add home page content here */}
                      <Button
                        onClick={() => {
                          console.log(getIdToken());
                          console.log(getToken());
                        }}
                      >
                        test
                      </Button>
                    </>
                  );
                }}
              />

              <Redirect
                exact
                from={APP_CONFIG.PAGES.APP}
                to={APP_CONFIG.PAGES.HOME}
              />
              <Route component={NotFound} />
            </Switch>
          </MainLayoutContent>

          {errorDialog && (
            <ErrorDialog
              open={Boolean(errorDialog)}
              message={errorDialog?.message}
              handleOpen={handleErrorDialog}
            />
          )}
          <Snackbars snackbar={snackbar} handleSnackbar={handleSnackbar} />
        </MainLayoutContainer>
      </MainLayoutWrapper>
    </MainLayoutRoot>
  );
};

export default MainLayout;
