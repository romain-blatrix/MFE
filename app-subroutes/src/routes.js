import React, {Suspense} from "react";

const Widget = React.lazy(() => import('./Widget'))

const routes = [
  {
    path: 'page1',
    label: 'loaded subroutes - widget',
    exact: true,
    content: <Suspense fallback="loading loading"><Widget/></Suspense>
  },
  {
    path: 'page2',
    label: 'loaded subroutes - otherx',
    exact: true,
    content: <div>content page 2</div>
  }
]

export default routes;
