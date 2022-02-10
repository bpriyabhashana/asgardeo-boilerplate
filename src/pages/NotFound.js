import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import FOOTER_LOGOS from "../images/footer.png";
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
    width: "90vw",
    height: "90vh",
    display: "table-cell",
    textAlign: "center",
    verticalAlign: "middle",
    // backgroundColor: "rgb(244, 246, 248)",
    padding: 20,
  },
}));

const NotFound = () => {
  const classes = useStyle();
  const history = useHistory();
  return (
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
                <Typography align="center" color="textPrimary" variant="h1">
                  404: The page you are looking for isn’t here
                </Typography>
                <Typography
                  align="center"
                  color="textPrimary"
                  variant="subtitle2"
                  gutterBottom
                >
                  You either tried a questionable route or you came here by
                  mistake. Whichever it is, try using the navigation or click
                  the button below.
                </Typography>
              </Grid>
              <Button
                size="small"
                variant="outlined"
                className="btn primary"
                onClick={() => {
                  history.push("/");
                }}
              >
                Go back to home
              </Button>
            </Grid>
          </Box>
        </Container>
      </Box>

      <img width="60" src={FOOTER_LOGOS} className="footer-image" />
    </div>
  );
};

export default NotFound;
