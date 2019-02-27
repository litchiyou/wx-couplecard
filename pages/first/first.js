// pages/weather/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    city: [],
    weather: '',
    daily:[],
    weatherDetailType: "weather_desc_type_hourly",
  },

  //页面跳转
  navigateToXin: function () {
    wx.navigateTo({
      url: '/pages/first/xin/xin',
    })
  },
  navigateToCitys: function() {
    wx.navigateTo({
      url: '/pages/first/citys/citys',
    })
  },
  navigateTo:function(){
    wx.navigateTo({
      url: '/pages/first/game/game',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation();
    },

  getUserLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.queryWeather(res);
      },
    })
  },

  cityWeather:function(res){
    var that = this;
    wx.request({
      url: 'https://ali-weather.showapi.com/area-to-weather',
      header: {
        "Authorization": "APPCODE b859bab9090348bcabe04c2eb37bba6b"
      },
      data: {
        'area': app.globalData.cityName,
        'need3HourForcast': 1,
      },
      method: "GET",
      success: function (resRequest) {

        console.info("HTTP - GET")
        console.info(resRequest)

        if (resRequest.statusCode == 200) {
          var result = resRequest.data.showapi_res_body;
          var arr = []
          arr.push(result)
          for (var i = 0, m = arr.length; i < m; i++) {
            for (var key in arr[i]) {
              if (key == "f1" || key == "f2" || key == "f3") {
                that.setData({
                  daily: arr[i][key]
                })
              }
            }
          }
          that.setData({
            weather: result
          });
          wx.setStorageSync("weather", result);
        }
      }
    })
  },

  queryWeather: function (res) {
    var that = this;
    wx.request({
      url: 'https://ali-weather.showapi.com/gps-to-weather',
      header: {
        "Authorization": "APPCODE b859bab9090348bcabe04c2eb37bba6b"
      },
      data: {
        'from': 3,
        'lat': res.latitude,
        'lng': res.longitude,
        'need3HourForcast': 1,
      },
      method: "GET",
      success: function (resRequest) {

        console.info("HTTP - GET")
        console.info(resRequest)

        if (resRequest.statusCode == 200) {
          var result = resRequest.data.showapi_res_body;
          var arr = []
          arr.push(result)
          for(var i=0,m=arr.length;i<m;i++){
            for(var key in arr[i]){
              if (key == "f1" || key == "f2" || key == "f3"){
                that.setData({
                  daily: arr[i][key]
                })
              }
            }
          }
          that.setData({
            weather: result
          });
          wx.setStorageSync("weather", result);
        }
      }
    })
  },

  //切换小时/天
  weatherDetailTypeClick: function (e) {
    var daily = this.data.daily;
    console.log(daily)
    console.info(e.currentTarget.id);
    const index = e.currentTarget.id;
    this.setData({
      weatherDetailType: index
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.cityName != null){
      this.cityWeather()
    }
  },
})