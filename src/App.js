import logo from "./logo.svg";
import "./App.css";
import { AuthProvider } from "@asgardeo/auth-react";
import { authConfig } from "./Config";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import ApimTokenStore from "./store/ApimTokenStore";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider config={authConfig}>
        <ApimTokenStore>
          <BrowserRouter>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route component={NotFound} />
            </Switch>
          </BrowserRouter>
        </ApimTokenStore>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
