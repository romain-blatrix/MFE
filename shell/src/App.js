import React, {useState, useEffect, Suspense} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

const AppSubroutesWidget = React.lazy(() => import('app-subroutes/Widget'))
const AppSubroutesFull = React.lazy(() => import('app-subroutes/App'))
const App3Widget = React.lazy(() => import('app3/Widget'))

function App() {

  const subRoutesPath = 'app-subroutes';

  const [routes, setRoutes] = useState()

  useEffect(() => {
    const loadData = async () => {      
      const appTwoRoutes = await import(`app-subroutes/routes`);
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
            {routes && (
              <>
                <li>
                  <Link to={`/${subRoutesPath}/full`}>app-subroutes full app</Link>
                </li>
                <li>
                  <Link to={`/${subRoutesPath}/widget`}>app-subroutes widget</Link>
                </li>
                {routes.map(({label, path}) => (
                  <li>
                    <Link to={`/${subRoutesPath}/${path}`} key={`${subRoutesPath}/${path}`}>{label}</Link> 
                  </li>
                ))}
            </>
            )}
            <li>
              <Link to="/app3">app3</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          {routes && [
            <Route path={`/${subRoutesPath}/full`}>
              <Suspense fallback="loading...">
            
                Full app :
                <AppSubroutesFull basePath={`/${subRoutesPath}/full`}/>
              </Suspense>
            </Route>,
            <Route path={`/${subRoutesPath}/widget`}>
              <Suspense fallback="loading...">
                widget :
                <AppSubroutesWidget />
              </Suspense>
            </Route>, 
            ...routes.map(({exact, content, path}) => (
              <Route path={`/${subRoutesPath}/${path}`} exact={exact} key={`${subRoutesPath}/${path}`}>
                  {content}
              </Route>
            ))
          ]}
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
