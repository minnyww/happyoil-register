import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoadingIcon from "./components/LoadingIcon";

const RegisterResult = lazy(() => import("./page/RegisterResult"));
const Register = lazy(() => import("./page/Register"));

//sendgridkey = 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
function App() {
   return (
      <div style={{ margin: "1rem" }}>
         <Router>
            <Switch>
               <Suspense fallback={<LoadingIcon />}>
                  <Route path="/" exact>
                     <Register />
                  </Route>
                  <Route path="/register-result">
                     <RegisterResult />
                  </Route>
                  <Route path="/register">
                     <Register />
                  </Route>
               </Suspense>
            </Switch>
         </Router>
      </div>
   );
}

export default App;
