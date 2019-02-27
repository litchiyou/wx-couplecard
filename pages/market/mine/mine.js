// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currtab: 0,
    swipertab: [{ name: '已完成', index: 0 }, { name: '待处理', index: 1 }],
    orderItems: [],
    order: [],
  },


  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
  * @Explain：选项卡点击切换
  */
  tabSwitch: function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },

  tabChange: function (e) {
    this.setData({
      currtab: e.detail.current
    })
    this.getShow()
  },

  //单击转换已完成
  clickOrder: function(e){
    var that = this
    var index = parseInt(e.currentTarget.dataset.index);
    var order = this.data.orderItems[index];
    console.log(order)
    let tableName = 'order'
    let Product = new wx.BaaS.TableObject(tableName)
    let product = Product.getWithoutData(order.id)
    product.set('status', "已完成")
    product.update().then(res => {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000//持续的时间
      })
      this.onLoad();
    })
  },
 
  getShow:function(){
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.alreadyShow()
        break
      case 1:
        that.waitPayShow()
        break
    }
  },

  alreadyShow: function () {
    var that = this
    let tableName = 'order'
    wx.BaaS.login().then(res =>{
      let orderItems = new wx.BaaS.TableObject(tableName)
      let query1 = new wx.BaaS.Query()
      query1.contains('status', '已完成')
      let query2 = new wx.BaaS.Query()
      query2.compare('created_by','=', res.id)
      let andQuery = wx.BaaS.Query.and(query1, query2)
      orderItems.setQuery(andQuery).find().then(res => {
        that.setData({
          orderItems: res.data.objects
        })
      })
    })
  },

  waitPayShow: function () {
    var that = this
    let tableName = 'order'
    wx.BaaS.login().then(res => {
      let orderItems = new wx.BaaS.TableObject(tableName)
      let query1 = new wx.BaaS.Query()
      query1.contains('status', '待处理')
      let query2 = new wx.BaaS.Query()
      query2.compare('created_by', '=', res.id)
      let andQuery = wx.BaaS.Query.and(query1, query2)
      console.log(res.id)
      orderItems.setQuery(andQuery).find().then(res => {
        that.setData({
          orderItems: res.data.objects
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderTableName = 'order'
    let orderItems = new wx.BaaS.TableObject(orderTableName)
    orderItems.find().then(res => {
      this.setData({
        orderItems: res.data.objects
      })
      this.getShow()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
  },
  onShow:function() {
    this.getShow()
  }
})