import React, {useState, useEffect} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useRouteMatch
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

function App({basePath = ''}) {

    return (
    <div>
      <h1>APP 2 title</h1>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to={`${basePath}`}>App 2 Home</Link>
            </li>
            <li>
              <Link to={`${basePath}/other`}>other route</Link>
            </li>
            <li>
              <Link to={`${basePath}/dynamic`}>get dynamic</Link>
            </li>

          </ul>
        </nav>
        <Switch>
          <Route path={`${basePath}/dynamic`}>
            <System system={{
              url: "http://localhost:3001/remoteEntry.js",
              scope: "app_dynamic",
              module: "./App",
            }} />
          </Route>
          <Route path={`${basePath}/other`}>
            <div>other really cool route</div>
          </Route>
          <Route path={`${basePath}`}>
            <div>home page of app 2</div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
