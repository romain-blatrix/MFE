const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index",
  mode: "development",
  target: "web",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        "app-subroutes": "app_subroutes@http://localhost:3002/remoteEntry.js",
        "app3": "app3@http://localhost:3003/remoteEntry.js",
      },
      // adds react as shared module
      // version is inferred from package.json
      // there is no version check for the required version
      // so it will always use the higher version found
      shared: {
        react: {
          import: "react", // the "react" package will be used a provided and fallback module
          shareKey: "react", // under this name the shared module will be placed in the share scope
          shareScope: "default", // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
        },
        "react-dom": {
          requiredVersion: deps["react-dom"],
          singleton: true, // only a single version of the shared module is allowed
        },
        "react-router-dom": {
          requiredVersion: deps["react-router-dom"],
          singleton: true, // only a single version of the shared module is allowed
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
