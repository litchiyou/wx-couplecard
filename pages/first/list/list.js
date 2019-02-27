// pages/list/list.js
var util = require('../../../utils/util.js')
var xiaojueding = require('../../../utils/xiaojueding.js');

var app = getApp()
Page({
   data: {
      xiaojueding: xiaojueding,
      myxiaojueding: [],
      tab_index: 2,
   },

  
   //删除
   personalQToDelete(e) {
      var that = this, index = e.currentTarget.dataset.index, myJuedin = wx.getStorageSync('myJuedin');
      for (let i in myJuedin) {
         if (index == i) {
            myJuedin.splice(i, 1);
            wx.showToast({
               title: '删除成功',
               icon: 'success',
               mask: false
            })
            break;
         }
      }
      that.setData({
         myxiaojueding: myJuedin
      })
      wx.setStorageSync('myJuedin', myJuedin);
   },

   onLoad: function (options) {

   },

   //热门、个人小决定
   tabSwitch(e) {
      var that = this, flg = e.currentTarget.dataset.flg, myJuedin = wx.getStorageSync('myJuedin');
      if (flg == 2) {
         that.setData({
            myxiaojueding: myJuedin
         })
      }
      that.setData({
         tab_index: flg == 1 ? '1' : '2'
      })
   },

   //添加个人小决定
   addPersonalQ(e) {
      wx.navigateTo({
         url: '/pages/first/game/edit/edit?flg=2',
      })
   },

   //个人编辑
   personalQToRevise(e) {
      var that = this, myJuedin = wx.getStorageSync('myJuedin'), index = e.currentTarget.dataset.index;
      for (let i in myJuedin) {
         if (i == index) {
            wx.navigateTo({
               url: '../edit/edit?item=' + JSON.stringify(myJuedin[i])
            })
            return;
         }
      }
   },

   //热门编辑
   officialQToRevise(e) {
      var that = this, xiaojueding = that.data.xiaojueding, index = e.currentTarget.dataset.index;
      for (let i in xiaojueding) {
         if (i == index) {
            wx.navigateTo({
               url: '../edit/edit?flg=1&item=' + JSON.stringify(xiaojueding[i])
            })
            return;
         }
      }
   },

   //个人决定右边的图片
   personalQToControl(e) {
      var that = this, index = e.currentTarget.dataset.index, idx, myxiaojueding = that.data.myxiaojueding;
      for (let x in myxiaojueding) {
         if (x == index) {
            idx = myxiaojueding[x].num1 == undefined ? index : undefined;
            myxiaojueding[x].num1 = idx;
         } else {
            myxiaojueding[x].num1 = undefined;
         }
      }
      that.setData({
         myxiaojueding: myxiaojueding
      })
   },

   //热门决定右边的图片
   officialQToControl(e) {
      var that = this, index = e.currentTarget.dataset.index, idx;
      for (let x in xiaojueding) {
         if (x == index) {
            idx = xiaojueding[x].num == undefined ? index : undefined;
            xiaojueding[x].num = idx;
         } else {
            xiaojueding[x].num = undefined;
         }
      }
      that.setData({
         xiaojueding: xiaojueding
      })
   },


   //热门决定的标题
   officialQToRun(e) {
      var that = this, id = e.currentTarget.dataset.id;
      app.globalData.defaultJueding = true;
      id = id == 0 ? '00' : id;
      wx.setStorageSync('switchTab', id);
      wx.navigateBack({
        delta: 1
      })
   },

   //个人决定的标题
   personalQToRun(e) {
      var that = this, id = e.currentTarget.dataset.id;
      app.globalData.myJueding = true;
      wx.setStorageSync('switchTab', id);
       wx.navigateBack({
        delta: 1
      })
   },

   onShow: function () {
      console.log('=========onShow============');
      var that = this, myJuedin = wx.getStorageSync('myJuedin');

      app.globalData.defaultJueding = false, app.globalData.myJueding = false;

      //创建的个人小决定
      if (!util.isNull(myJuedin)) {
         that.setData({
            myxiaojueding: myJuedin
         })
      }

      wx.removeStorageSync('switchTab')
   },
})