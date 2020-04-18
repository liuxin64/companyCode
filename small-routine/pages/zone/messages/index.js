import constants from '../../../common/constants.js';
import { messageList, addblockList, removeConversation } from '../../../utils/imUtils.js';
import { parseTime } from '../../../utils/util.js';
const app = getApp();

Page({
  data: {
    modalName: null,
    listTouchStart: 0,
    listTouchDirection: null,
    messageList: []
  },
  onLoad: function (options) {
    app.watch('messageList', this.feedback);
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    let that = this;
    messageList().then(res => {
      console.log(res)
      that.setData({
        messageList: res.messageList
      })
    })
    this.setData({
      uniqueKey: uniqueKey
    })
  },
  onReady: function () {

  },
  onShow: function () {
    wx.showToast({
      title: '时间有bug',
      icon: 'none'
    })
  },
  onHide: function () {

  },
  feedback(list) {
    console.log(list)
    for (let i = 0; i < list.length; i++) {
      if (!(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(list[i].lastMessage.laastTime))) {
        list[i].lastMessage.laastTime = parseTime(list[i].lastMessage.laastTime);
      }
    }
    this.setData({
      messageList: list
    })
  },
  back(event) {
    wx.navigateBack({});
  },
  ListTouchStart(e) {
    this.setData({
      listTouchStart: e.touches[0].pageX
    })
  },
  // ListTouch计算方向，
  ListTouchMove(e) {
    this.setData({
      listTouchDirection: e.touches[0].pageX - this.data.listTouchStart > 0 ? 'right' : 'left'
    })
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.listTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      listTouchDirection: null
    })
  },
  navigateToBoard(event) {
    let that = this;
    let target = event.currentTarget.dataset.target;
    let messageList = this.data.messageList;
    let item = messageList[target];
    wx.navigateTo({
      url: `./board/index?conversation=${JSON.stringify(item)}`,
      success: function() {
        item.unreadCount = 0;
        messageList[target] = item;
        that.setData({
          messageList: messageList
        })
      }
    })
  },
  addBlock(event) {
    let index = event.currentTarget.dataset.index;
    let messageList = this.data.messageList;
    let item = messageList[index];
    addblockList([item.userProfile.userID]);
    this.deleteConversation(event);
  },
  deleteConversation(event) {
    let index = event.currentTarget.dataset.index;
    let messageList = this.data.messageList;
    let item = messageList[index];
    app.globalData.unreadCount = app.globalData.unreadCount - item.unreadCount;
    removeConversation(item.conversationID);
  }
})