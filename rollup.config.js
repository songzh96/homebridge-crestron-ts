import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

const extensions = [".ts", ".js"];

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  external: [ 'net' ],
  plugins: [
    resolve({
      jsnext: true,
      extensions,
    }),
    babel({
      extensions,
      exclude: "node_modules/**", // only transpile our source code
    }),
    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/lodash/index.js': [ 'lodash' ]
      }
    }),
  ],
};
