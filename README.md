# MFE test


- `shell` is the host application.
- `app-dynamic` standalone app dynamically loaded by `app-subroutes` with nested routes
- `app-subroutes` standalone application which exposes `Widget` component.
- `app3` standalone application which exposes `Widget` component that requires
  `momentjs`.

# Running Demo

Run `yarn start` to build and serve all apps.

- [localhost:3000](http://localhost:3000/) (shell)
- [localhost:3001](http://localhost:3001/) (app-dynamic)
- [localhost:3002](http://localhost:3002/) (app-subroutes)
- [localhost:3003](http://localhost:3003/) (app3)
