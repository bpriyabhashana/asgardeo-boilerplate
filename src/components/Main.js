import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Popover,
  MenuList,
  MenuItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { ChevronLeft, AccountCircle } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { PowerSettingsNew } from "@mui/icons-material";
import { useAuthContext } from "@asgardeo/auth-react";

import logo from "../images/logo.png";
import { APP_NAME, PAGES } from "../Config";
import NavigationDrawer from "./NavigationDrawer";

const Main = (props) => {
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
  } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [hoverActive, setHoverActive] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [page, setPage] = useState(PAGES.FLASH_URL);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "popover" : undefined;

  const handleDrawerToggle = () => {
    if (open) {
      handleDrawerClose();
    } else {
      handleDrawerOpen();
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
    }, 500);
  };

  const handleDrawerHoverOver = () => {
    if (hoverActive) {
      setOpen(true);
    }
  };
  const handleDrawerHoverOut = () => {
    if (hoverActive) {
      setOpen(false);
    }
  };
  return (
    <div>
      <AppBar position="fixed" style={{ zIndex: "1300" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            {open && !hoverActive ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <span>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "80px", marginTop: 4, paddingRight: 10 }}
            />
          </span>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h4" noWrap style={{ flexGrow: 1 }}>
                {APP_NAME}
              </Typography>
            </Grid>
            <Grid item></Grid>
            <Grid item>
              <Grid
                container
                direction="row"
                spacing={1}
                justify="flex-end"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="body2" display="block">
                    {props.derivedResponse?.decodedIDTokenPayload.email}
                  </Typography>
                </Grid>
                <Grid item onClick={handleClick} style={{ cursor: "pointer" }}>
                  {props.authData ? (
                    <Avatar
                      title={props.derivedResponse?.decodedIDTokenPayload.email}
                      src={props.derivedResponse?.decodedIDTokenPayload.email}
                    />
                  ) : (
                    <Avatar
                      title={props.derivedResponse?.decodedIDTokenPayload.email}
                    >
                      <PersonIcon />
                    </Avatar>
                  )}
                </Grid>
                <Popover
                  id={id}
                  open={openPopover}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuList>
                    <MenuItem>
                      <ListItemAvatar>
                        {props.authData ? (
                          <Avatar
                            title={
                              props.derivedResponse?.decodedIDTokenPayload.email
                            }
                            src={
                              props.derivedResponse?.decodedIDTokenPayload.email
                            }
                          />
                        ) : (
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          props.derivedResponse?.decodedIDTokenPayload.email
                        }
                      />
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      <ListItemIcon>
                        <PowerSettingsNew color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </MenuList>
                </Popover>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div
        onMouseOver={handleDrawerHoverOver}
        onMouseOut={handleDrawerHoverOut}
      >
        <NavigationDrawer open={open} handleDrawerClose={handleDrawerClose} />
      </div>
    </div>
  );
};

export default Main;
