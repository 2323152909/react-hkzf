import React from 'react';
import { withRouter } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
// 导入props 校验包 
import PropTypes from 'prop-types'

// 引入样式
import './index.css'

function NavHeader({ children, history, onLeftClick }) {
  // 默认点击行为
  const defaultHandler = () => history.go(-1);

  // 添加props校验
  NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
  }

  return (
    <>
      {/* 顶部导航栏 */ }
      <NavBar 
        className="navBar"  
        mode ="light" 
        icon ={< i className="iconfont icon-back" />} 
        onLeftClick={ onLeftClick || defaultHandler }>
          { children }
      </NavBar >
    </>
  )
}

export default withRouter(NavHeader)