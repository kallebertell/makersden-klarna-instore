import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { ShoppingPage } from "./pages/ShoppingPage";
import { VerifyPurchasePage } from "./pages/VerifyPurchasePage";

function App() {
  return (
    <Router>
      <Route path="/" exact component={ShoppingPage} />
      <Route path="/verify/:orderId" exact component={VerifyPurchasePage} />
    </Router>
  );
}

export default App;
