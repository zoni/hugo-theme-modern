const browsers = require("browserslist");
const cssnano = require("cssnano");
const imports = require("postcss-import");
const mixins = require("postcss-mixins");
const nested = require("postcss-nested");
const postCSSPresetEnv = require("postcss-preset-env");
const postcssSVG = require('postcss-svg');
const url = require("postcss-url");

module.exports = () => ({
  plugins: [
    url,
    imports,
    mixins,
    nested,
    postcssSVG({
      dirs: ["assets/icons"]
    }),
    postCSSPresetEnv({
      stage: 1,
    }),
    cssnano({
      preset: "default",
    }),
  ],
});
