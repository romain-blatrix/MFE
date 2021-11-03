import React, {useState, useEffect, Suspense} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

const App2Widget = React.lazy(() => import('app2/Widget'))
const App2Full = React.lazy(() => import('app2/App'))
const App3Widget = React.lazy(() => import('app3/Widget'))

function App() {

  const [routes, setRoutes] = useState()

  useEffect(() => {
    const loadData = async () => {      
      const appTwoRoutes = await import('app2/routes');
      setRoutes(appTwoRoutes.default);
    }
    loadData();
  }, [])
  
  
  console.log(routes);

  return (
    <div>
      <h1>Shell title</h1>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {routes &&
              <li>
                <Link to="/app2">app2</Link>
              </li>
            }
            <li>
              <Link to="/app3">app3</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/app2">
            <Suspense fallback="loading...">
              <App2Widget />
              <App2Full />
            </Suspense>
          </Route>
          <Route path="/app3">
            <Suspense fallback="loading...">
              <App3Widget />
            </Suspense>
          </Route>
          <Route path="/" exact>
            <div>home page</div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
