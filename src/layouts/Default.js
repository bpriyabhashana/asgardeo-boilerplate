import React from "react";
import { makeStyles } from "@mui/styles";
import FOOTER_LOGOS from "../images/footer.png";
import AuthError from "../pages/AuthError";
import {
  Box,
  Button,
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
    height: "95vh",
    display: "table-cell",
    textAlign: "center",
    verticalAlign: "middle",
    // backgroundColor: "rgb(244, 246, 248)",
    padding: 20,
  },
}));

const Default = (props) => {
  const classes = useStyle();
  const { children, isLoading, isApimToken, hasErrors } = props;
  return (
    <div>
      {isLoading ? (
        <div className={classes.pageStyle}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
            }}
          >
            Loading ...
          </Box>
          <img width="60" src={FOOTER_LOGOS} className="footer-image" />
        </div>
      ) : hasErrors ? (
        <AuthError />
      ) : (
        children
      )}
    </div>
  );
};

export default Default;
