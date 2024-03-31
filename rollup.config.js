import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import nodePolyfills from "rollup-plugin-polyfill-node";
import stripExports from "rollup-plugin-strip-exports";

const NODE_ENV = "production";

/** @type {import('rollup').RollupOptions} */
const options = {
  input: "src/index.tsx",
  output: {
    dir: "dist",
    format: "es",
    // esModule: true,
    exports: "none",
    // preserveModules: true,
  },
  treeshake: "smallest",
  plugins: [
    replace({
      // TODO: Replace package version
      values: { "process.env.NODE_ENV": JSON.stringify(NODE_ENV) },
      preventAssignment: true,
    }),
    nodePolyfills({}),
    nodeResolve(),
    typescript({
      // target: "ES2015",
    }),
    json({ compact: true }),
    commonjs({
      include: /node_modules/,
      exclude: [
        "node_modules/sequelize/lib/dialects/postgres/**/*",
        "node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js",
      ],
      transformMixedEsModules: true,
      strictRequires: true,
      // dynamicRequireTargets: [
      // "node_modules/sequelize-typescript/**/*"
      // "node_modules/sequelize/lib/dialects/**/*",
      // "node_modules/@mapbox/node-pre-gyp/**/*.js",
      // "node_modules/node-gtk/**/*.js",
      // ],
      // exclude: ["node_modules/sequelize-typescript/**/*"],
    }),
    stripExports(),
    babel({
      babelHelpers: "bundled",
      // plugins: [["import", { libraryName: "sequelize-typescript" }]],
      // sourceType: "script",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              esmodules: true,
              node: "18",
            },
          },
        ],
        [
          "@babel/preset-react",
          {
            runtime: "automatic",
            pure: true,
            modules: false,
          },
        ],
      ],
    }),
    // terser({
    //   ecma: "6",
    //   module: true,
    //   toplevel: true,
    //   compress: {
    //     defaults: false,
    //     passes: 2,
    //   },
    //   mangle: false,
    //   maxWorkers: 4,
    // }),
  ],
};

export default options;
