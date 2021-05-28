import path from "path";
import { Configuration, DefinePlugin } from "webpack";
const DEV = process.env.NODE_ENV !== "production";

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// plugins.push(new BundleAnalyzerPlugin());

const nodeModulesPath = path.resolve(__dirname, "node_modules");
const targets = DEV ? { chrome: "79", firefox: "72" } : "> 0.25%, not dead";

const config: Configuration = {
  mode: DEV ? "development" : "production",
  devtool: DEV ? "inline-source-map" : false,
  entry: {
    index: "./src/index",
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: `[name].js`,
    publicPath: "/public/",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  optimization: {
    minimize: !DEV,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
        },
        material: {
          test: /[\\/]node_modules[\\/]@material-ui[\\/]/,
          name: "material-ui",
          chunks: "all",
          priority: 20,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, nodeModulesPath],
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/env", { modules: false, targets }], "@babel/react", "@babel/typescript"],
            plugins: [
              "@babel/proposal-numeric-separator",
              "@babel/plugin-transform-runtime",
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "@babel/plugin-proposal-object-rest-spread",
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
        use: "url-loader?limit=10000",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  devServer: {
    port: 8080,
    open: DEV,
    openPage: `http://localhost:8080/public/index.html`,
  },
};

export default config;
