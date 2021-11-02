import React, {useState, useEffect} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");

    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const useDynamicScript = (args) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement("script");

    element.src = args.url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

function System(props) {
  const { ready, failed } = useDynamicScript({
    url: props.system && props.system.url,
  });

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.system.url}</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.system.url}</h2>;
  }

  const Component = React.lazy(
    loadComponent(props.system.scope, props.system.module)
  );

  return (
    <React.Suspense fallback="Loading System">
      <Component />
    </React.Suspense>
  );
}

function App() {

  const [routes, setRoutes] = useState()

  const { ready } = useDynamicScript({
    url: "http://localhost:3002/remoteEntry.js",
  });

  useEffect(() => {
    const loadData = async () => {
      const [getAppTwoRoutes] = await Promise.all([
        loadComponent('app2','./routes'),
      ]);
      
      const appTwoRoutes = await getAppTwoRoutes();
      setRoutes(appTwoRoutes.default);
    }
    if (ready) {
      loadData();
    }
  }, [ready])
  
  
  console.log('========================================');
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
            <System system={{
              url: "http://localhost:3002/remoteEntry.js",
              scope: "app2",
              module: "./Widget",
            }} />
          </Route>
          <Route path="/app3">
            <System system={{
              url: "http://localhost:3003/remoteEntry.js",
              scope: "app3",
              module: "./Widget",
            }} />
          </Route>
          <Route path="/" exact={true}>
            <div>home page</div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
