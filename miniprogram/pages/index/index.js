// pages/index/index.js
var app = getApp();
Page({
  data: {
    list: [],
    showToolbar:false,
    n:0
  },
  dealData: function (list, callback) {
    var fileList = [];
    list.forEach(function (item) {
      fileList.push(item.img);
    })
    wx.cloud.getTempFileURL({
      fileList: fileList,
      success: function (res) {
        var fileList = res.fileList;
        list.forEach(function (item, index) {
          list[index].img = fileList[index].tempFileURL;
        })
        callback(list); //执行传进来的function（）
      }
    })
  },
  getCard: function () {
    var db = wx.cloud.database();
    var that = this;
    db.collection('cards').get({
      success: function (res) {
        that.dealData(res.data, function () {
          that.setData({
            list: res.data
          });
        });
      }
    })
  },
  onLoad: function () {
    this.getCard();
    this.setData({
      n: 0
    })
    app.globalData.n = this.data.n;
  },
  edit:function() {
    app.globalData.currentCard = this.data.list;
    wx.navigateTo({
      url: '../updateCard/updateCard',
    })
  },
  
  onToggle:function() {
    this.setData({
      showToolbar:!this.data.showToolbar
    });
  },

  onShareAppMessage:function() {
    return {
      title:"随机卡片"
    }
  },

  onAdd:function() {
    wx.navigateTo({
      url: '../addCard/addCard',
    })
  },

  delcard:function() {
    var db = wx.cloud.database();
    db.collection('cards').doc(this.data.list[0]._id).remove({
      success(res) {
        wx.showToast({
          title: '保存成功',
          duration: 1000,
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../index/index',
          })
        }, 1000)
      }
    })
  },

  nextcard:function() {
    this.setData({
      n:this.randnum(0,this.data.list.length-1)
    })
    app.globalData.n = this.data.n;
    console.log(this.data.n);
  },

  randnum:function (minNum, maxNum){
    switch(arguments.length) { 
    case 1:
    return parseInt(Math.random() * minNum + 1, 10);
    break;
    case 2:
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    break;
    default: 
    return 0;
    break;
  } 
}
})