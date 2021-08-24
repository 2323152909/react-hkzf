import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// 导入 react-virtualized 组件样式
import 'react-virtualized/styles.css'
// 导入全局样式
import './index.css'
// 导入字体图标库样式
import './assets/fonts/iconfont.css'
// 导入路由包裹配置
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>,document.getElementById('root'));
