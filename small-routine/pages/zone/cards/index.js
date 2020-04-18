import { image } from '../../../request/index.js';
import remote from '../../../service/remote.js';
import constants from '../../../common/constants.js';
Page({
  data: {
    cards: []
  },
  onLoad: function (options) {
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    this.setData({
      uniqueKey: uniqueKey
    })
  },
  onReady: function () {
    this.initData();
  },
  onShow: function () {

  },
  back(event) {
    wx.navigateBack({});
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