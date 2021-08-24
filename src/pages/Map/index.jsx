import React, { Component } from 'react';
// 引入样式
import './index.css'
// 导入顶部导航栏 NavHeader
import NavHeader from '../../components/NavHeader';

class Map extends Component {
  componentDidMount() {
    // 创建地图实例
    // 注意，在react脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
    const map = new window.BMapGL.Map("container")
    // 设置中心点坐标
    const point = new window.BMapGL.Point(116.404, 39.915)
    // 地图初始化，并设置展示级别
    map.centerAndZoom(point, 15);
    var scaleCtrl = new window.BMapGL.ScaleControl();  // 添加比例尺控件
    map.addControl(scaleCtrl);
    var zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
    map.addControl(zoomCtrl);
    var cityCtrl = new window.BMapGL.CityListControl();  // 添加城市列表控件
    map.addControl(cityCtrl);

    // function myFun(result) {
    //   var cityName = result.name;
    //   map.setCenter(cityName);
    //   alert("当前定位城市:" + cityName);
    // }
    // var myCity = new window.BMapGL.LocalCity();
    // myCity.get(myFun);
  }

  render() {
    return (
      <div className="map">
        {/* 顶部导航栏组件 */}
        <NavHeader>地图找房</NavHeader>
        {/* 地图容器 */}
        <div id="container"></div>
      </div>
    );
  }
}

export default Map;