const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// prettier-ignore
const PATHS = {
    html:    path.resolve("html", "index.html"),
    index: path.resolve("src", "index.ts"),
    dist:    path.resolve("dist"),
};

module.exports = () => {
  return {
    entry: {
      app: {
        import: [PATHS.index],
        dependOn: "modules",
      },
      modules: ["phaser"],
    },

    output: {
      publicPath: "",
      path: PATHS.dist,
      filename: "[name].[contenthash].js",
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: "Flappy bird implementation by Birdman",
        template: PATHS.html,
      }),
      new CopyWebpackPlugin({
        patterns: [
          // TODO
          { from: "./src/assets", to: "src/assets" },
          // { from: "./src/assets/audio", to: "assets/audio" },
          // { from: "./src/assets/uncompressed", to: "assets/uncompressed" },
          // { from: "./src/assets/spriteSheets", to: "assets/spriteSheets" },
          // PLEASE UNCOMMENT THESE, IF YOU NEED THEM
          // { from: "./src/assets/spines", to: "assets/spines" },
          // { from: "./src/assets/shaders", to: "assets/shaders" },
          // { from: "./src/assets/video", to: "assets/video" },
        ],
      }),
    ],
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.(ts|js)x?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
            },
          },
        },
      ],
    },
  };
};
