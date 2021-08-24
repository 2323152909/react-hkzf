import request from '../network'

// 通过 IP 定位获取到当前城市名称
// 1.创建并导出获取定位城市的函数 getCurrentCity
export const getCurrentCity = () => {
  // 2.判断 localStorage 中是否有定位城市
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'));

  if (!localCity) {
    // 3.如果没有，就使用首页中获取定位城市的代码来获取，并且存储到本地存储中，然后返回该城市数据
    return new Promise((resolve, reject) => {
      const currentCity = new window.BMapGL.LocalCity();
      currentCity.get(async res => {
        try {
          // console.log(res);
          const { data: result } = await request({
            url: `/area/info`,
            method: 'get',
            params: {
              name: res.name
            }
          })
          // console.log(result);

          // 存储到本地仓库中
          localStorage.setItem('hkzf_city', JSON.stringify(result.body));

          // 返回JSON数据
          resolve(result.body)
        } catch (error) {
          // 获取定位城市失败
          reject(error)
        }
      })
    })
  }

  // 4.如果有，直接返回本地存储中的城市数据
  // 注意：因为上面为了处理异步操作，使用了 Promise ，因此该函数返回值的统一，此处，也应该使用Promise
  // 以为此处的 Promise 不会失败，所以，此处，只要返回一个成功的 Promise 即可
  return Promise.resolve(localCity)
}

// 数据格式化方法
// list:[{},{}]
export const formatCityData = (list) => {
  const cityList = {};
  // 1.遍历list数组
  list.forEach(item => {
    // 2.获取每个城市的首字母
    const first = item.short.substr(0, 1);
    // 3.判断 cityList 中是否有该分类
    if (cityList[first]) {
      // 4.如果有，直接往该分类中push 数据
      cityList[first].push(item)
    } else {
      // 5.如果没有,就先创建一个数组，然后把当前城市信息添加到数组中
      cityList[first] = [];
      cityList[first].push(item)
    }
  })
  // 获取索引数据
  const cityIndex = Object.keys(cityList).sort();
  return {
    cityList,
    cityIndex
  }
}

// 格式化城市索引
export const formatCityIndex = (index) =>{
  switch (index) {
    case '#':
      return "当前定位"
    case 'hot':
      return "热门城市"
    default:
      return index.toUpperCase()
  }
}