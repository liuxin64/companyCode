import constants from '../../../../common/constants.js';
import { messages, createMessage, sendText, setMessageRead } from '../../../../utils/imUtils.js';
import { parseTime } from '../../../../utils/util.js';
import { image } from '../../../../request/index.js';
import TIM from 'tim-wx-sdk';
const app = getApp();
Page({
  data: {
    uniqueKey: -1,
    conversation: {},
    userInfo: {},
    messageList: [],
    text: '',
    hadMore: true
  },
  onLoad: function (options) {
    app.watch('messageList', this.feedback);
    let conversation = JSON.parse(options.conversation);
    this.getHeight();
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    let userInfo = wx.getStorageSync(constants.USERINFO);
    this.setData({
      conversation: conversation,
      uniqueKey: uniqueKey,
      userInfo: userInfo
    }, () => {
      this.getMessages();
    })
  },
  onReady: function () {
    this.hadRead();
  },
  onShow: function () {

  },
  onHide: function () {

  },
  back(event) {
    wx.navigateBack({});
  },
  feedback(value) {
    console.log(value)
    let conversation = this.data.conversation;
    let messageList = this.data.messageList;
    for (let i = 0; i < value.length; i++) {
      if ((value[i].conversationID == conversation.conversationID) && (parseInt(value[i].lastMessage.fromAccount) != this.data.uniqueKey)) {
        let message = createMessage({
          to: conversation.userProfile.userID,
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            text: value[i].lastMessage.payload.text
          }
        })
        message['avatar'] = conversation.userProfile.avatar;
        if (!(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(message.time))) {
          message.time = parseTime(message.time);
        }
        messageList.push(message);
        this.setData({
          messageList: messageList
        })
      }
    }
  },
  hadRead() {
    let conversation = this.data.conversation;
    setMessageRead(conversation.conversationID).then(res => {
      app.globalData.unreadcount = app.globalData.unreadcount - conversation.unreadCount;
    }).catch(err => {
      console.log(err)
    });
  },
  getHeight() {
    let res = wx.getSystemInfoSync();
    let windowHeight = (res.windowHeight * (750 / res.windowWidth));
    this.setData({
      screenHeight: windowHeight
    })
  },
  getMessages() {
    let hadMore = this.data.hadMore;
    if (!hadMore) {
      wx.showToast({
        title: '到顶了',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let next = this.data.next;
    let conversation = this.data.conversation;
    let userInfo = this.data.userInfo;
    messages({
      conversationID: conversation.conversationID,
      nextReqMessageID: next,
      count: 15
    }).then(res => {
      let oldList = that.data.messageList;
      let response = res.data;
      let isComplated = response.isCompleted;
      let list = response.messageList;
      if (list.length < 15) {
        hadMore = false
      }
      let nextReqMessageID = response.nextReqMessageID;
      for (let i = 0; i < list.length;  i++) {
        if (!(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(list[i].time))) {
          list[i].time = parseTime(list[i].time);
        }
        if (list[i].flow == 'in') {
          list[i]['avatar'] = image(conversation.userProfile.avatar);
        } else {
          list[i]['avatar'] = image(userInfo.HeadPortraitUrl);
        }
      }
      list = list.concat(oldList);
      that.setData({
        messageList: list,
        next: nextReqMessageID,
        isComplated: isComplated,
        hadMore: hadMore,
        scrollBottom: next ? 0 : list.length - 1
      }, () => {
        wx.hideLoading();
      })
    })
  },
  inputText(event) {
    let text = event.detail.value;
    this.setData({
      text: text
    })
  },
  send(event) {
    let text = this.data.text;
    let conversation = this.data.conversation;
    let message = createMessage({
      to: conversation.userProfile.userID,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        text: text
      }
    });
    let messageList = this.data.messageList;
    let userInfo = this.data.userInfo;
    let temp = message;
    if (!(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(temp.time))) {
      temp.time = parseTime(temp.time);
    }
    temp.flow = 'out';
    temp['avatar'] = userInfo.HeadPortraitUrl;
    messageList.push(temp);
    let that = this;
    this.setData({
      messageList: messageList,
      sending: true,
      scrollBottom: messageList.length - 1,
      text: ''
    }, () => {
      sendText(message).then(res => {
        if (res.success) {
          that.setData({
            sending: false
          })
          wx.showToast({
            title: '时间这还有bug',
            icon: 'none'
          })
        }
      })
    })
  },
  pullRefresh(event) {
    this.setData({
      scrollBottom: 0
    })
    this.getMessages();
  },
  showDetail(event) {
    wx.showToast({
      title: '转为客户',
      icon: 'none'
    })
  }
})