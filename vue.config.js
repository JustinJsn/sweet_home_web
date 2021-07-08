
// 导入compression-webpack-plugin模块
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

module.exports = {
  devServer: {
    proxy: {
      "/api/v1": {
        target: "http://api.justinjsn.cn/api/v1",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api/v1": ""
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
    // 使用：在 configureWebpack 中配置
    new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip', // 压缩算法
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), // 匹配的资源会被进行压缩
        threshold: 10240, // 仅处理大于该值的资源，单位为 bytes
        minRatio: 0.8 // 压缩后的大小 / 原始文件大小
    })
    ]
  }
};
