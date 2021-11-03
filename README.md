# MFE test


- `shell` is the host application.
- `app-dynamic` standalone app dynamically loaded by `app2` with nested routes
- `app2` standalone application which exposes `Widget` component.
- `app3` standalone application which exposes `Widget` component that requires
  `momentjs`.

# Running Demo

Run `yarn start` to build and serve all apps.

- [localhost:3000](http://localhost:3000/) (shell)
- [localhost:3001](http://localhost:3001/) (app-dynamic)
- [localhost:3002](http://localhost:3002/) (app2)
- [localhost:3003](http://localhost:3003/) (app3)
