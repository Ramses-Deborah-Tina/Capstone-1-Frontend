const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: "./src/App.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "/", // Ensure this matches your deployment root path
    clean: true,    // Clean old files in dist on build (Webpack 5 feature)
  },
  devtool: process.env.NODE_ENV === "production" ? false : "source-map", // Disable source maps in prod for smaller builds
  plugins: [
    new Dotenv(), // Loads .env variables
    new webpack.EnvironmentPlugin({
      API_URL: "http://localhost:8080", // fallback if .env doesn't provide it
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]", // Place images in assets folder with hashed names for cache busting
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
  },
};
