module.exports = {
    productionSourceMap: false,
    publicPath: "",
    outputDir: './src-cordova/www',
    lintOnSave:false,
    css: {
        loaderOptions: {
          less: {
            modifyVars: {
              // 直接覆盖变量
              'green': '#2BE0B0',
            },
          },
        },
    },
}