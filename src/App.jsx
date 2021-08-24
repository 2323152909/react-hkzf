import React from 'react'
import { Route, Redirect } from 'react-router-dom'
// 导入路由组件
import Home from './pages/Home'
import CityList from './pages/CityList'
// 导入Map组件
import Map from './pages/Map'

export default function App() {
  return (
    <div className="app">
      {/* 配置路由 */}
      {/* 默认路由重定向到home首页 */}
      <Route exact path="/" render={() => (<Redirect to="/home"/>)} />
      {/* Home父路由的内容 */}
      <Route path="/home" component={Home} />
      <Route path="/citylist" component={CityList} />
      <Route path="/map" component={Map} />
    </div>
  )
}
