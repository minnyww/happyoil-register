import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoadingIcon from "./components/LoadingIcon";

const RegisterResult = lazy(() => import("./page/RegisterResult"));
const Register = lazy(() => import("./page/Register"));

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
