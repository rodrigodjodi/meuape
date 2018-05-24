const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
module.exports = {
  configureWebpack: {
    //use the full build of vue, useful if some component have HTML templates
    /*
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js"
      }
    }
    */
    plugins: [new BundleAnalyzerPlugin()]
  }
};
