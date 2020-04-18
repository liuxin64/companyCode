// pages/zone/edit/index.js
import constants from '../../../common/constants.js';
import { image } from '../../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customItems: [
      { index: 0, name: '基本信息', icon: 'profilefill', badge: 0, url: './profile/index' },
      { index: 1, name: '我的照片', icon: 'picfill', badge: 0, url: './profile/pic' },
      { index: 2, name: '我的视频', icon: 'videofill', badge: 0, url: './profile/video' },
      { index: 3, name: '我的标签', icon: 'tagfill', badge: 0, url: './profile/tags' },
      { index: 4, name: '我的公司', icon: 'servicefill', badge: 0, url: './profile/company' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    this.setData({
      uniqueKey: uniqueKey
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let myInfo = wx.getStorageSync(constants.USERINFO);
    if (myInfo) {
      this.setData({
        myInfo: myInfo,
        avatar: image(myInfo.HeadPortraitUrl)
      })
    }
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
  back() {
    wx.navigateBack({});
  }
})