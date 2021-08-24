import React, { Component } from 'react';
// 导入axios实例
import request from '../../network'
// 导入utils中获取当前定位的方法
import { getCurrentCity, formatCityData, formatCityIndex } from '../../utils'
// 导入List组件
import { List, AutoSizer } from 'react-virtualized';
import './index.css'
import { Toast } from 'antd-mobile';
// 导入NavHeader顶部导航栏组件
import NavHeader from '../../components/NavHeader';

// 索引 (A、B等) 的高度
const TITLE_HEIGHT = 36;
// 每个撑死名称的高度
const NAME_HEIGHT = 50;

// 有房源的城市
const HOUSE_CITY = ['北京','上海','广州','深圳']

class CityList extends Component {
  state = {
    cityList: {},
    cityIndex: [],
    // 指定右侧字母索引列表高亮的索引号
    activeIndex:0
  }

  // 获取城市列表数据的方法
  getCityList = async () => {
    const { data: res } = await request({
      url: '/area/city?level=1',
      method: 'get'
    })
    const { cityList, cityIndex } = formatCityData(res.body)
    // 获取热门城市信息
    const { data: hotRes } = await request({
      url: '/area/hot',
      method: 'get'
    })
    // 将热门城市添加到cityList中
    cityList['hot'] = hotRes.body;
    // 将 hot 索引添加到 cityIndex中
    cityIndex.unshift('hot');
    // 异步获取到当前定位城市
    const currentCity = await getCurrentCity();
    // 将当前定位城市添加到 cityList 中
    cityList['#'] = [currentCity];
    // 将 # 索引添加到 cityIndex中
    cityIndex.unshift('#');
    // console.log(cityList, cityIndex, currentCity);
    this.setState({
      cityList,
      cityIndex
    })
  }

  async componentDidMount() {
    // 调用获取城市数据列表
    await this.getCityList();

    // 调用measureAllRows, 提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
    // 注意：调用这个方法的时候，需要保证 List 组件中已经有数据了！如果 List 组件中的数据为空，就会导致该用方法报错！
    // 解决：只要保证这个方法时在 获取到数据之后 调用的即可。
    this.cityListComponent.measureAllRows();
  }

  // 更改城市信息的回调函数
  changeCity = ({label, value}) => {
    if(HOUSE_CITY.indexOf(label) > -1){
      // 有房源
      // 将房源信息保存到本地仓库中
      localStorage.setItem('hkzf_city', JSON.stringify({label,value}));
      // 返回上一页
      this.props.history.go(-1)
    }else{
      // 没有房源信息
      Toast.info("该城市暂无房源数据", 1, null, false)
    }
  }

  // 渲染列表每一行数据的函数
  // 函数的返回值就表示最终渲染到页面中的每行的内容
  rowRenderer = ({
    key, // 每一行唯一的键值
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在 List 中是可见的
    style, // 注意：重点属性，一定要给每一行数据加该样式！作用：指定每一行的位置
  }) => {
    // 获取每一行的索引
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index]
    // console.log(letter);
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {
          cityList[letter].map(item => (
            <div className="name" key={item.value} onClick={() => this.changeCity(item)}>{item.label}</div>
          ))
        }
      </div>
    );
  }

  // 用于获取List组件中渲染行的信息
  onRowsRendered = ({ startIndex, stopIndex }) => {
    // console.log("startIndex",startIndex, stopIndex);
    if(this.state.activeIndex !== startIndex){
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    // 索引标题高度 + 城市数量 * 城市名称的高度
    // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];

    return TITLE_HEIGHT + cityList[letter].length * NAME_HEIGHT;
  }

  // 封装渲染右侧索引列表的方法
  renderCityIndex = () => {
    // 获取到cityIndex，并遍历其，实现渲染
    const { cityIndex,activeIndex } = this.state;
    return cityIndex.map((item, index) => (
      <li className="cityindex-item" key={item} onClick={() => {
        this.cityListComponent.scrollToRow(index)
      }}>
        <span className={activeIndex === index ? "index-active" : ""}>{item === 'hot' ? "热":item.toUpperCase()}</span>
      </li>
    ))
  }

  render() {
    return (
      <div className="citylist">
        {/* 顶部导航栏 */}
        {/* <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => { this.props.history.go(-1) }}
        >城市选择</NavBar> */}
        <NavHeader>城市选择</NavHeader>

        {/* 城市列表 */}
        <AutoSizer>
          {
            ({ height, width }) => (
              <List
                height={height}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                width={width}
                scrollToAlignment="start"
                ref={c => {this.cityListComponent = c}}
              />
            )
          }
        </AutoSizer>

        {/* 右侧索引列表 */}
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>
    );
  }
}

export default CityList;