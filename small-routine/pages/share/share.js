// pages/share/share.js
import remote from '../../service/remote.js';
import { image } from '../../request/index.js';
import {userSetting } from '../../common/version.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    duration: 500,
    timingFunction: 'linear',
    _animation: {},
    details: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = options.details;
    console.log(info)
    if (info && info.uniqueKey != -1) {
      this.setData({
        details: JSON.parse(info)
      })
    }
    this._rotate = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: this.data.timingFunction
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getQRImage({
      path: `/pages/index?targetKey=${this.data.details.uniqueKey}`,
      width: 430,
      auto_color: false,
      line_color: { r: 1, g: 1, b: 1 },
      is_hyaline: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  back(res) {
    console.log(res)
    wx.navigateBack()
  },
  startRotate() {
    this._rotate.rotate(180).step();
    this.setData({
      _animation: this._rotate
    })
  },
  getQRImage(data) {
    let that = this
    remote.createQr(this.data.details.uniqueKey, 1, data).then(res => {
      wx.getImageInfo({
        src: image(res.data),
        success: function (res) {
          that.setData({
            qrPath: res.path
          }, () => {
            that.startRotate()
          })
        } 
      })
    })
  },
  saveToAlbum() {
    console.log('存入手机')
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.qrPath,
      success: function () {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
      },
      fail: function () {
        userSetting('scope.writePhotosAlbum', true).then(res => {
          console.log(res)
        })
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  }
})