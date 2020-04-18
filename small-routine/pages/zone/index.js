// pages/zone/index.js
import constants from '../../common/constants.js';
import { image } from '../../request/index.js';
import remote from '../../service/remote.js';
const app = getApp();
Page({
  data: {
    cuIconList: [
      { cuIcon: 'edit', color: 'orange', badge: 0, name: '编辑' },
      { cuIcon: 'post', color: 'yellow', badge: 0, name: '留言' },
      { cuIcon: 'goods', color: 'olive', badge: 0, name: '商品' },
      { cuIcon: 'community', color: 'cyan', badge: 0, name: '消息' },
      { cuIcon: 'group', color: 'blue', badge: 0, name: '客户' },
      { cuIcon: 'news', color: 'purple', badge: 0, name: '名片夹' },
      { cuIcon: 'rank', color: 'mauve', badge: 0, name: '雷达' },
      { cuIcon: 'peoplelist', color: 'purple', badge: 0, name: '管理' }
    ],
    gridCol: 4
  },
  onLoad: function (options) {
    app.watch('unreadcount', this.feedback);
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    this.setData({
      uniqueKey: uniqueKey
    })
  },
  onReady: function () {
    let cuIconList = this.data.cuIconList;
    cuIconList[3].badge = app.globalData.unreadcount;
    this.setData({
      cuIconList: cuIconList
    })
    this.initData();
  },
  onShow: function () {
    let wxUserInfo = wx.getStorageSync(constants.WX_USER_INFO);
    if (wxUserInfo) {
      this.setData({
        myInfo: wxUserInfo,
        avatar: image(wxUserInfo.HeadPortraitUrl)
      })
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  feedback(value) {
    let cuIconList = this.data.cuIconList;
    cuIconList[3].badge = value;
    this.setData({
      cuIconList: cuIconList
    })
  },
  // 后退
  back() {
    wx.navigateBack({})
  },
  // 点击tap
  clicktap(event) {
    console.log(event)
    let index = event.currentTarget.dataset.index;
    switch(index) {
      case 0:
        wx.navigateTo({
          url: './edit/index',
        })
        break;
      case 1:
        wx.navigateTo({
          url: './comments/index',
        })
        break;
      case 2:
        wx.navigateTo({
          url: './goods/index',
        })
        break;
      case 3:
        wx.navigateTo({
          url: './messages/index',
        })
        break;
      case 4:
        wx.navigateTo({
          url: './customers/index',
        })
        break;
      case 5:
        wx.navigateTo({
          url: './cards/index',
        })
        break;
      case 6:
        wx.navigateTo({
          url: './radar/index',
        })
        break;
      case 7:
        wx.navigateTo({
          url: './manage/index',
        })
        break;
    }
  },
  initData() {
    let uniqueKey = this.data.uniqueKey;
    this.getCollectionList(uniqueKey);
  },
  getCollectionList(id) {
    let that = this;
    remote.getCollectionList(id).then(res => {
      console.log(res);
      let list = res.data;
      for (let i = 0; i < list.length; i++) {
        list[i].HeadPortraitUrl = image(list[i].HeadPortraitUrl);
      }
      that.setData({
        cards: list
      })
    })
  }
})