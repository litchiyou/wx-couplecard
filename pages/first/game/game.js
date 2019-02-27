// pages/index/index.js
var util = require('../../../utils/util.js')
var app = getApp();

var xiaojuedingArr = require('../../../utils/xiaojueding.js')
wx.setStorageSync('all', xiaojuedingArr);
wx.setStorageSync('num', 100);

function randomsort(a, b) {
  return Math.random() > .5 ? -1 : 1;
}

var page = {
  data: {
    size: { //转盘大小可配置
      w: 599,
      h: 600
    },
    musicflg: true,
    fastJuedin: false,
    repeat: false,
    xiaojuedingArr: xiaojuedingArr.sort(randomsort),
    myxiaojueding: [],
    tab_index: 2,

    s_awards: '？',//结果
    share: true,


    //画布--------------------------------
    canvasWidth: 400,
    canvasHeight: 650,
    showCanvasFlag: false,

    colorArr: [
      '#EE534F',
      '#FF7F50',
      '#FFC928',
      '#66BB6A',
      '#42A5F6',
      '#5C6BC0',
      '#AA47BC',
      '#EC407A',
      '#FFB6C1',
      '#FFA827'
    ],
    fontArr: ['italic', 'oblique', 'normal'],
    sizeArr: [12, 14, 16, 18, 20, 22, 24, 26, 28],

    shengchengUrl: '',

    saveFrameFlag: false,

  },

  /*导航栏的点击事件 */
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  //接收当前转盘初始化时传来的参数
  getData(e) {
    this.setData({
      awardsConfig: e.detail,
    })
  },

  //接收当前转盘结束后的答案选项
  getAwards(e) {
    this.setData({
      s_awards: e.detail.end ? "？" : e.detail.s_awards,
      share: e.detail.end ? true : false,
    })
  },

  //开始转
  startZhuan(e) {
    this.setData({
      zhuanflg: e.detail ? true : false
    })
  },

  onLoad: function (options) {
    console.log('=========onload============');
    this.zhuanpan = this.selectComponent("#zhuanpan");
  },

  //点击切换转盘选项
  xiaojueding(e) {
    var that = this, idx = e.currentTarget.dataset.idx, xiaojuedingArr = that.data.xiaojuedingArr;

    if (!that.data.zhuanflg) {
      for (let x in xiaojuedingArr) {
        if (idx == x && xiaojuedingArr[x].option != that.data.awardsConfig.option) {
          that.zhuanpan.switchZhuanpan(xiaojuedingArr[x]);//切换当前转盘数据选项 
          return;
        }
      }
    }
  },

  onShow: function (e) {
    console.log('============onShow============');
    var that = this, switchTab = wx.getStorageSync('switchTab'), all = wx.getStorageSync('all'), xiaojuedingArr = that.data.xiaojuedingArr;

    //判断从热门小决定 还是个人小决定跳转过来的 还是编辑页面跳过来的
    all = app.globalData.defaultJueding ? xiaojuedingArr : app.globalData.myJueding ? all : xiaojuedingArr;

    console.log(app.globalData.defaultJueding)
    
    that.setData({
      musicflg: !app.globalData.musicflg ? true : false,
      fastJuedin: app.globalData.juedin ? true : false,
      repeat: app.globalData.repeat ? true : false,
    })

    //跳转过来的
    if (!util.isNull(switchTab)) {

      wx.showLoading({
        title: '加载中',
      })
      switchTab = switchTab == '00' ? '0' : switchTab;
      setTimeout(function () {
        for (let i in all) {
          if (all[i].id == switchTab) {
            that.zhuanpan.switchZhuanpan(all[i], true);//切换当前转盘数据选项 
            that.setData({
              zhuanflg: false
            })
            break;
          }
        }
        wx.hideLoading();
      }, 500)
    }
  },

  //关闭保存图片的框
  closeSaveFrame: function () {
    var that = this;
    that.zhuanpan.reset();
    that.setData({
      saveFrameFlag: false,
    });
  },

  //保存图片
  saveImage: function () {
    var that = this;
    var filePath = that.data.shengchengUrl;

    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: function (res) {
        wx.showToast({
          title: '保存图片成功！',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }
    })
  },

  //数组随机取出一个数
  arrayRandomTakeOne: function (array) {
    var index = Math.floor((Math.random() * array.length + 1) - 1);
    return array[index];
  },

}
Page(page);