const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        debug: true,
        source: "options",
        baseUrl: "./src",
        aliases: {
          "@/": "./*",
        }
      }
    }
  ]
};
