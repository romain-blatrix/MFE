import React, {Suspense} from "react";

const Widget = React.lazy(() => import('./Widget'))

const routes = [
  {
    path: 'page1',
    label: 'app-subroutes page 1 - widget',
    exact: true,
    content: <Suspense fallback="loading loading"><Widget/></Suspense>
  },
  {
    path: 'page2',
    label: 'app-subroutes page 2',
    exact: true,
    content: <div>content page 2</div>
  }
]

export default routes;
