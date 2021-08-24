const {
  override,
  fixBabelImports
} = require('customize-cra');

// 配置按需导入样式
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  }),
);