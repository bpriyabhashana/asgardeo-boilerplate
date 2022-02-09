import logo from "./logo.svg";
import "./App.css";
import { AuthProvider } from "@asgardeo/auth-react";
import { authConfig } from "./Config";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider config={authConfig}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
