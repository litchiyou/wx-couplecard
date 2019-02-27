// pages/add/add.js
var util = require('../../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var today = util.formatDate(new Date())
    //console.log(today)
    this.setData({
      date: today
    })

    var id = e.id;
    if (id) {
      this.getData(id, this);
    } else {
      this.setData({
        date: today
      })
    }
  },

  //转换时间
  bindDateChange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * input change事件
   */
  change(e) {
    var val = e.detail.value;
    this.setData({
      content: val
    });
  },

  /**
   * cancel 事件
   */
  cancel() {
    wx.navigateBack();
  },

  sure() {
    var reg = /^\s*$/g;
    var date = this.data.date
    if (!this.data.content || reg.test(this.data.content)) {
      console.log('不能为空');
      return;
    }
    let tableName = 'letter'
    let Product = new wx.BaaS.TableObject(tableName)
    let product = Product.create()
    let letter = {
      text: this.data.content,
      date: this.data.date,
      sender: app.globalData.userInfo.nickname,
    }
    product.set(letter).save().then(res => {
      console.log(res)
    })
    this.setValue(this);
    wx.navigateBack();
  },

  /**
   * 根据跳转的url中的id获取编辑信息回填
   */
getData: function(id, page) {
  var arr = wx.getStorageSync('txt');
  if (arr.length) {
    arr.forEach((item) => {
      if (item.id == id) {
        page.setData({
          id: item.id,
          content: item.content
        })
      }
    })
  }
},

/**
 * 设置填写的信息，分编辑、新增
 */
setValue: function (page) {
  var arr = wx.getStorageSync('txt');
  var data = [], flag = true;
  var date = this.data.date
  if (arr.length) {
    arr.forEach(item => {
      if (item.id == page.data.id) {
        item.time = date;
        item.content = page.data.content;
        flag = false;
      }
      data.push(item);
    })
  }
  if (flag) {
    data.push(page.data);
  }
  wx.setStorageSync('txt', data);
},
})