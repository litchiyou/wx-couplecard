var util = require('../../../utils/util');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.BaaS.login().then(res => {
      let tableName = 'letter'
      let that = this
      let product = new wx.BaaS.TableObject(tableName)
      let query1 = new wx.BaaS.Query()
      query1.compare('created_by', '=', res.id)
      let query2 = new wx.BaaS.Query()
      query2.compare('created_by', '=', 7965188501935)
      let query3 = new wx.BaaS.Query()
      query3.compare('created_by', '=', 75037975)
      let orQuery = wx.BaaS.Query.or(query1, query2, query3)
      product.setQuery(orQuery).find().then(res => {
        for (var i = 0; i < res.data.objects.length; i++) {
          var time = util.formatDate(new Date(res.data.objects[i].date))
          console.log(time)
          res.data.objects[i].date = time
        }
        this.setData({
          lists: res.data.objects
        })
        console.log(this.data.lists)
      })
    })
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.onLoad()
  },

  /**
   * 添加事件
   */
  add() {
    wx.navigateTo({
      url: '/pages/first/xin/add/add',
    })
  }
})
