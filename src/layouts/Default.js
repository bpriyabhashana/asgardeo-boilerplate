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

import LoadingScreen from "../components/LoadingScreen";

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
        <LoadingScreen message={"Loading..."} />
      ) : hasErrors ? (
        <AuthError />
      ) : (
        children
      )}
    </div>
  );
};

export default Default;
