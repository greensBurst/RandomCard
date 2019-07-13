var app = getApp();

Page({

  data: {
    ishow: true,
    card: {
      img: '',
      title: '',
      msg: ''
    },
    currentCard:[],
    n:0,
  },
  onLoad:function() {
    this.setData({
      currentCard:app.globalData.currentCard,
      n:app.globalData.n
    })
  },
  uploadImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          'ishow': false,
          'card.img': res.tempFilePaths[0],
        })
      }
    })
  },

  onInput: function (e) {
    this.setData({
      'card.title': e.detail.value,
    })
  },

  onText: function (e) {
    this.setData({
      'card.msg': e.detail.value,
    })
  },

  updateDB:function (fileID) {
    var db = wx.cloud.database();
    var card =this.data.card;
    var n = this.data.n;
    db.collection('cards').doc(this.data.currentCard[n]._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        title:card.title,
        msg:card.msg,
        img:fileID
      },
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
        // wx.redirectTo({
        //   url: '../index/index',
        // })
      }
    })
  },

  onSave: function () {
    var card = this.data.card;
    var that = this;
    if (!card.img || !card.title || !card.msg) {
      wx.showToast({
        title: '表单不能为空',
        icon: 'none'
      })
      return;
    }
    var cloudPath = this.uuid(8, 16) + card.img.match(/\.[^.]+?$/)[0];
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: card.img, // 文件路径
      success: function (res) {
        // get resource ID
        that.updateDB(res.fileID);
      },
      fail: function () {
        // handle error
      }
    })
  },

  uuid: function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  }

})