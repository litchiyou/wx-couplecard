Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    orderItems:[],
    curNav: 1,
    curIndex: 0,
    selectAllStatus: false,
  },
  //表单提交
  submit: function (e) {
    wx.BaaS.wxReportTicket(e.detail.formId)
    console.log(e.detail.formId)
  },

  onLoad: function () {
    // 加载的使用进行网络访问，把左右侧边栏的数据设置到data数据对象
    wx.BaaS = requirePlugin('sdkPlugin')
    var that = this
    let leftTableName = 'factory'
    let rightTableName= 'goods'
    let leftItems = new wx.BaaS.TableObject(leftTableName)
    let rightItems = new wx.BaaS.TableObject(rightTableName)
    let query = new wx.BaaS.Query()
    query.contains('leftID','1')
    leftItems.orderBy('created_at').find().then(res => {
      this.setData({
        navLeftItems: res.data.objects
      })
    })
    rightItems.setQuery(query).find().then(res => {
      this.setData({
        navRightItems: res.data.objects
      })
    })
  },

  //事件处理函数
  //左侧边栏的点击事件
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值
    let id = e.target.dataset.id;
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id
    })
    let rightTableName = 'goods'
    let rightItems = new wx.BaaS.TableObject(rightTableName)
    let query = new wx.BaaS.Query()
    query.contains('leftID',id)
    rightItems.setQuery(query).find().then(res => {
      this.setData({
        navRightItems: res.data.objects
      })
    })
  },

  // 增加数量
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let navRightItems = this.data.navRightItems;
    let num = navRightItems[index].num;
    num = num + 1;
    navRightItems[index].num = num;
    this.setData({
      navRightItems: navRightItems
    });
  },
  // 减少数量
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let navRightItems = this.data.navRightItems;
    let num = navRightItems[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    navRightItems[index].num = num;
    this.setData({
      navRightItems: navRightItems
    });
  },
  //点击选择按钮时候的事件
  selectList:function(e) {
    let navRightItems = this.data.navRightItems
    let orderItems = this.data.orderItems
    let index = e.currentTarget.dataset.index;
    const selected = navRightItems[index].selected;
    navRightItems[index].selected = !selected;
    if (navRightItems[index].selected == true){
      orderItems.push(navRightItems[index])
      console.log(orderItems)
      this.setData({
        navRightItems: navRightItems,
        orderItems: orderItems
      })
    }
    if(navRightItems[index].selected == false) {
      for(var i=0;i<orderItems.length;i++){
        if(orderItems[i].id == navRightItems[index].id){
          orderItems.splice(i,1)
        }
      }
      console.log(orderItems)
      this.setData({
        navRightItems: navRightItems,
        orderItems: orderItems
      })
    }
  },
  //点击购买按钮时
  buyTap:function() {
    let orderItems = this.data.orderItems
    let tableName = 'order'
    let order = new wx.BaaS.TableObject(tableName)
    let list = [{
      name:[],
      num:[],
      image:[],
      order_id:[],
    }]
    console.log(orderItems)
    for(var i=0;i<orderItems.length;i++){
      if(orderItems[i].selected == true){
        list[0].name.push(orderItems[i].name)
        list[0].num.push(orderItems[i].num)
        list[0].image.push(orderItems[i].image.path)
        list[0].order_id.push(orderItems[i].id)
      }
    }
    if (orderItems.length > 0){
      order.createMany(list).then(res => {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000//持续的时间
        })
      })
    }
    else{
      wx.showToast({
        title: "请添加购买商品",
        image: "../../image/icon-fail.png",
        duration: 2000
      })
    }
  },

  //我的按钮点击事件
  mingTap:function(){
    wx.navigateTo({
      url: '/pages/market/mine/mine',
    })
  }

})