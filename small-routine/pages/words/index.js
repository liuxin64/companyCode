import remote from '../../service/remote.js';
import { image } from '../../request/index.js';
import constants from '../../common/constants.js';
Page({
  data: {
    uniqueKey: -1,
    page: {
      currentPage: 1,
      pageSize: 12,
      sort:'desc'
    },
    targetUserId: 79,
    form: {
      text: ''
    },
    comments: [],
    more: true
  },
  onLoad: function (options) {
    let width = wx.getSystemInfoSync().screenWidth;
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    let targetUserId = options.targetUserId;
    console.log(options)
    if (uniqueKey) {
      this.setData({
        uniqueKey: uniqueKey,
        targetUserId: targetUserId,
        screenWidth: width
      })
    }
  },
  onReady: function () {
    this.getComments();
  },
  onShow: function () {

  },
  back(event) {
    wx.navigateBack();
  },
  getComments() {
    let key = this.data.uniqueKey == -1 ? 0 : this.data.uniqueKey;
    let that = this;
    let page = this.data.page;
    let comments = this.data.comments;
    return remote.getCommentsList(this.data.targetUserId, key, page).then(res => {
      let result = res.data.commentPointRatioList;
      console.log(result)
      if (result.length > 0) {
        page.currentPage += 1;
        for (let i = 0; i < result.length; i++) {
          // 看到这段是不是想笑，评论只给内容，不给用户基本信息的
          remote.getOriginWxInfo(result[i].UserSysNo).then(res => {
            let info = res.data;
            if (info) {
              result[i]['avatar'] = image(info.HeadPortraitUrl);
              result[i]['name'] = info.Name;
              comments.push(result[i]);
            }
            that.setData({
              comments: comments,
              page: page,
              more: true
            })
          })
        }
      } else {
        that.setData({
          comments: comments,
          more: false
        })
      }
    })
  },
  likeCurComment(res) {
    let index = res.currentTarget.dataset.index;
    let comments = this.data.comments;
    let cur = comments[index];
    if (cur.PointRatioStatus != 1 && !this.data.homeLoading) {
      let that = this;
      that.loading()
      remote.updateLiked(this.data.uniqueKey, this.data.targetUserId, cur.SysNo).then(res => {
        if (res.success) {
          cur.PointRatio += 1;
          cur.PointRatioStatus = 1;
          comments[index] = cur;
          that.setData({
            comments: comments
          }, () => {
            that.loading();
          })
        }
      })
    } else {
      wx.showToast({
        title: '已点赞',
        icon: 'none'
      }, () => {
        that.loading();
      })
    }
  },
  formSubmit(event) {
    console.log(event)
    let that = this;
    let text = event.detail.value.text;
    let uniqueKey = this.data.uniqueKey;
    let targetUserId = this.data.targetUserId;
    remote.insertComment({
      Content: text,
      InUserSysNo: uniqueKey,
      TouserSysNo: targetUserId,
      UserSysNo: uniqueKey
    }).then(res => {
      wx.showToast({
        title: '留言成功,审核后显示',
        icon: 'none'
      })
    })
  },
  onReachBottom: function () {
    let that = this;
    if (!this.data.more) {
      return;
    }
    if (!this.data.loading) {
      this.setData({
        loading: true
      }, () => {
        this.getComments().then(res => {
          that.setData({
            loading: false
          })
        })
      })
      
    }
  }
})