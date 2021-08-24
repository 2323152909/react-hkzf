import React, { Component } from 'react';
// 导入样式
import './index.css'

// 导入axios实例
import request from '../../network'

// 导入utils中获取当前定位的方法
import { getCurrentCity } from '../../utils'

// 导入轮播图组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

// 导入导航菜单图片
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/home/list'
  },
]

// 获取地理位置信息
// navigator.geolocation.getCurrentPosition(position => {
//   console.log("当前位置信息", position);
// })

class Index extends Component {
  state = {
    imgHeight: 212,
    swipers: [],
    baseUrl: 'http://localhost:8080',
    isSwiperLoaded: false,
    groups: [],
    news: [],
    // 当前城市名称
    address: '上海'
  }

  // 请求轮播图数据
  getSwipers = async () => {
    // 异步请求数据
    const { data: res } = await request({
      url: '/home/swiper',
      method: 'get'
    })
    this.setState({
      swipers: res.body,
      isSwiperLoaded: true
    })
  }

  // 获取租房小组数据
  getGroups = async () => {
    // 获取城市id
    const { value } = localStorage.getItem('hkzf_city')

    const { data: res } = await request({
      url: '/home/groups',
      method: 'get',
      params: {
        area: value
      }
    })
    this.setState({
      groups: res.body,
      isSwiperLoaded: true
    })
  }

  // 获取资讯数据
  getNews = async () => {
    // 获取城市id
    const { value } = localStorage.getItem('hkzf_city')

    const { data: res } = await request({
      url: '/home/news',
      method: 'get',
      params: {
        area: value
      }
    });
    this.setState({
      news: res.body
    })
  }

  // 当页面挂载完成时，开启轮播图
  async componentDidMount() {
    // 当页面挂载完成是，获取轮播图数据
    this.getSwipers();
    // 获取小组数据
    this.getGroups();
    // 获取首页资讯数据
    this.getNews()

    // 2.通过 IP 定位获取到当前城市名称
    const res = await getCurrentCity();
    // console.log(res);
    this.setState({
      address: res.label
    })
  }

  // 渲染轮播图结构
  renderSwipers = () => {
    // 获取到轮播图数据
    const { baseUrl, swipers } = this.state;

    // 渲染轮播图
    return swipers.map(item => (
      <img key={item.id} src={`${baseUrl}${item.imgSrc}`} alt="" style={{ width: '100%', verticalAlign: 'top', height: 212 }} />
    ))
  }

  // 渲染导航菜单
  renderNavs = () => {
    return navs.map(item => (
      <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
        <img src={item.img} alt="" />
        <p>{item.title}</p>
      </Flex.Item>
    ))
  }

  // 渲染首页资讯
  renderNews = () => {
    const { news, baseUrl } = this.state;
    return news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={baseUrl + item.imgSrc} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          {
            this.state.isSwiperLoaded ?
              <Carousel autoplay infinite autoplayInterval={2000}>
                {this.renderSwipers()}
              </Carousel> : ''
          }

          {/* 搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div className="location" onClick={() => this.props.history.push('/citylist')}>
                <span className="name">{this.state.address}</span>
                <i className="iconfont icon-arrow" />
              </div>

              {/* 搜索表单 */}
              <div className="form" onClick={() => this.props.history.push('/search')} >
                <i className="iconfont icon-seach"></i>
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')} />
          </Flex>
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组<span className="more">更多</span>
          </h3>

          {/* 宫格区域 */}
          <Grid data={this.state.groups} hasLine={false} square={false} activeStyle={false} columnNum={2} renderItem={(item) => (
            <Flex className="group-item" justify="around">
              <div className="desc">
                <p className="title">{item.title}</p>
                <span className="info">{item.desc}</span>
              </div>
              <img src={`${this.state.baseUrl}${item.imgSrc}`} alt="" />
            </Flex>
          )} />
        </div>

        {/* 首页资讯区域 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">
            {this.renderNews()}
          </WingBlank>
        </div>

      </div>
    );
  }
}

export default Index;