import React from "react";
import { makeStyles } from "@mui/styles";
import FOOTER_LOGOS from "../images/footer.png";
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

const LoadingScreen = (props) => {
  const classes = useStyle();
  return (
    <div className={classes.loadingpageStyle}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        {props.message}
      </Box>
      <img width="60" src={FOOTER_LOGOS} className="footer-image" />
    </div>
  );
};

export default LoadingScreen;
