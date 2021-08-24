import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import News from '../News';
import Index from '../Index';
import HouseList from '../HouseList';
import Profile from '../Profile';
import './index.css'
import { TabBar } from 'antd-mobile'

// TabBar.Item数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  },
]

class Home extends Component {
  state = {
    // 控制默认选中的tab菜单
    selectedTab: this.props.location.pathname,
  };

  componentDidUpdate(preProps) {
    // 判断上一次的路径与本次路径是否相同，如果不相同，则切换当前选中的tab菜单
    if (preProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  // 渲染 TabBar.Item
  renderTabBarItem = () => {
    return tabItems.map(item => (
      <TabBar.Item title={item.title} key={item.title} icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path
          });
          // 路由切换
          this.props.history.push(item.path)
        }}>
      </TabBar.Item>
    ))
  }

  render() {
    return (
      <div className="home">
        {/* 渲染子路由 */}
        <Route path="/home/list" component={HouseList} />
        <Route exact path="/home" component={Index} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />

        {/* tabbar区域 */}
        <TabBar tintColor="skyblue" noRenderContent={true} barTintColor="white" style={{position:"fiexd"}}>
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    );
  }
}

export default Home;