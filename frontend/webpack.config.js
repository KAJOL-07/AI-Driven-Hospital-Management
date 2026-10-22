const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Optional local .env loading for frontend development
const possibleEnvFiles = [
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, ".env.local"),
  path.resolve(__dirname, ".env.production.local"),
  path.resolve(__dirname, ".vercel/.env.production.local")
];

for (const envFile of possibleEnvFiles) {
  if (fs.existsSync(envFile)) {
    try {
      const content = fs.readFileSync(envFile, "utf8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const idx = trimmed.indexOf("=");
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            let val = trimmed.slice(idx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    } catch (err) {
      // Non-fatal if .env reading fails
    }
  }
}

const isProduction =
  process.env.NODE_ENV === "production" ||
  process.argv.includes("production") ||
  process.argv.includes("--mode=production");

if (isProduction) {
  process.env.NODE_ENV = "production";
}

const apiUrl =
  process.env.REACT_APP_API_URL ||
  process.env.API_URL ||
  "https://mediflow-hospital-api.vercel.app/api";

module.exports = {
  entry: "./src/index.jsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        type: "javascript/auto",
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                  development: !isProduction,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_URL": JSON.stringify(apiUrl),
      "process.env.API_URL": JSON.stringify(apiUrl),
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    open: false,
    historyApiFallback: true,
    hot: true,
  },

  mode: isProduction ? "production" : "development",
};
