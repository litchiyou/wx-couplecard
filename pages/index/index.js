const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    windowWidth: "",//窗口宽度
    windowHeigh: "",//窗口高度
    packetList: [{}],//红包队列
    packetNum: 50,//总共红包的数量
    showInter: '',//  循环动画定时器
    srcMusic:'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glmHmJHGKBvvzB3.mp3',
    isMusicPlay:true,
    swiperItems: [{ "id": 1, 'imgUrls': 'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glUAHd8IUVRL654.JPG', 'story':"这世上所有温柔的事，都会让我想起你"}, 
      { "id": 2, 'imgUrls': 'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glUAHPnvUYoW5oa.JPG', 'story': "这应该是第一张合照,我还没露脸～"},
      { "id": 3, 'imgUrls': 'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glUAH7Z3BTK6Cor.JPG', 'story': "明明心里小鹿乱撞,却还要装作漫不经心的样子"},
      { "id": 4, 'imgUrls': 'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glUAHmUZrhXzxoM.jpg', 'story': "眼前人是心上人"},
      { "id": 5, 'imgUrls': 'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glUAHwps1Wc9rri.JPG', 'story': "你贯穿我山河，似暮色沉溺，若暗燃星火"},
      { "id": 6, 'imgUrls': 'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glUAHfTKr2B6RmS.JPG', 'story': "每张你好看的照片我都很丑,很无奈"},
      { "id": 7, 'imgUrls': 'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glUAHbSP5gbDxqE.JPG', 'story': "想用喃喃的声音在你耳边轻轻唤一声宝贝"},
      { "id": 8, 'imgUrls': 'https://cloud-minapp-23784.cloud.ifanrusercontent.com/1glUAHpPPOOy05gF.JPG', 'story': "你的意中人是眼里只有你的盖世英雄"}],
    indcatorDots: false,//滑块是否需要指示点
    autoPlay: false,//自动播放
    duration: 300,//动画时长
    vertical: true,//是否纵向
    imgheights: [],//图片高度
    current: 0,
    imgwidth: 750,
    rippleStyle: ''
  },
  
  submit: function (e) {
    wx.BaaS.wxReportTicket(e.detail.formId)
    console.log(e.detail.formId)
  },
  
  //登录授权
  userInfoHandler(data) {
    var that = this
    var uid = wx.BaaS.storage.get('uid')
    if (!uid) {
      wx.BaaS.login(false).then(res => {
        that.getUserInfo(res.id)
      })
    } else {
      this.getUserInfo(uid)
    }
  },
  getUserInfo: function (uid) {
    let MyUser = new wx.BaaS.User()
    MyUser.get(uid).then(res => {
      var userInfo = res.data
      console.log(userInfo.loginStatus)
      if (userInfo.name && userInfo.phone && userInfo.company) {
        this.setData({
          userInfo: userInfo,
          isProfileComplete: true,
        })
        app.globalData.userInfo = userInfo
      } else {
        this.setData({
          userInfo: userInfo,
        })
        app.globalData.userInfo = userInfo
      }
      if(userInfo.loginStatus == true){
        wx.switchTab({
          url: '../first/first',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
      else{
        wx.showToast({
          title: '请找小程序管理员获取登录权限',
          icon: 'none',
          duration: 1500,
        })
      }
      wx.setStorageSync('userInfo', userInfo)
    })
  },

  //控制音乐暂停和播放
  controlMusic: function(){
    this.audioCtx = wx.createAudioContext('myAudio')
    if(this.data.isMusicPlay){
      this.audioCtx.pause()
      this.setData({
        isMusicPlay: false
      })
    }
    else{
      this.audioCtx.play()
      this.setData({
        isMusicPlay: true
      })
    }
  },

  //自动获取图片高度
  imageLoad: function (e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      src = [],
      //宽高比
      ratio = imgwidth / imgheight;
    src.push(e.target.dataset['src'])
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
    })
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    // 获取手机屏幕宽高
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeigh: res.windowHeight,
          top: res.windowHeight//设置红包初始位置
        })
      }
    })

    //建立临时红包列表
    var packetList = [];
    //建立临时红包图片数组
    var srcList = ["../../image/ai.png", "../../image/ai.png","../../image/ai.png", "../../image/ai.png", "../../image/ai.png"];
    //生成初始化红包
    for (var i = 0; i < that.data.packetNum; i++) {
      // 生成随机位置（水平位置）
      var left = Math.random() * that.data.windowWidth - 20;
      // 优化位置，防止红包越界现象，保证每个红包都在屏幕之内
      if (left < 0) {
        left += 20;
      } else if (left > that.data.windowWidth) {
        left -= 20;
      }
      // 建立临时单个红包
      var packet = {
        src: srcList[Math.ceil(Math.random() * 2) - 1],
        top: -30,
        left: left,
        speed: Math.random() * 2500 + 3000     //生成随机掉落时间，保证每个掉落时间保持在3秒到5.5秒之间
      }
      // 将单个红包装入临时红包列表
      packetList.push(packet);
      // 将生成的临时红包列表更新至页面数据，页面内进行渲染
      that.setData({
        packetList: packetList
      })
    }

    // 初始化动画执行当前索引
    var tempIndex = 0;
    // 开始定时器，每隔1秒掉落一次红包
    that.data.showInter = setInterval(function () {    
      // 生成当前掉落红包的个数，1-3个
      var showNum = Math.ceil(Math.random() * 3);
      // 防止数组越界
      if (tempIndex * showNum >= that.data.packetNum) {
        // 如果所有预生成的红包已经掉落完，清除定时器
        clearInterval(that.data.showInter);
      } else {
        switch (showNum) {
          case 1:
            //设置临时红包列表当前索引下的top值，此处top值为动画运动的最终top值 
            packetList[tempIndex].top = that.data.windowHeigh;
            // 当前次掉落几个红包，索引值就加几
            tempIndex += 1;
            break;
          case 2:
            packetList[tempIndex].top = that.data.windowHeigh;
            packetList[tempIndex + 1].top = that.data.windowHeigh;
            tempIndex += 2;
            break;
          case 3:
            packetList[tempIndex].top = that.data.windowHeigh;
            packetList[tempIndex + 1].top = that.data.windowHeigh;
            packetList[tempIndex + 2].top = that.data.windowHeigh;
            tempIndex += 3;
            break;
          default:
            console.log();
        }
        // 更新红包列表数据
        that.setData({
          packetList: packetList
        })
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function(options) {
    if (this.data.isMusicPlay){
      this.audioCtx = wx.createAudioContext('myAudio')
      this.audioCtx.play()
    }
  },
})
