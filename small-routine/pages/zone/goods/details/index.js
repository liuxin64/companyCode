import product from '../../../../service/product.js';
import { image } from '../../../../request/index.js';
import constants from '../../../../common/constants.js';
import { userSetting } from '../../../../common/version.js';
import remote from '../../../../service/remote.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dotStyle: true,
    cardCur: 0,
    goodsId: 1402095,
    swipers: [],
    images: [],
    video: '',
    info: {},
    count: 0,
    cur: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsId = options.goodsId;
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    let userInfo = wx.getStorageSync(constants.USERINFO);
    this.setData({
      goodsId: goodsId,
      uniqueKey: uniqueKey,
      userInfo: userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let that = this;
    // let time = setTimeout((callback) => {
    //   that.setData({
    //     loading: false
    //   }, () => {
    //     callback();
    //   })
    // }, 10000, () => {
    //   clearTimeout(time)
    // })
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
  back(event) {
    let page = getCurrentPages();
    if (page.length <= 1) {
      let info = this.data.info;
      let targetUserId = info.MerchantSysNo;
      wx.redirectTo({
        url: `../../../index?targetKey=${targetUserId}`,
      })
    } else {
      wx.navigateBack({});
    }
  },
  cardSwiper(e) {
    console.log(e)
    let cardCur = e.detail.current;
    this.setData({
      cardCur: cardCur
    })
  },
  initData() {
    this.setData({
      loading: true
    })
    let that = this;
    product.getDetail(this.data.goodsId).then(res => {
      console.log(res)
      let images = res.data.DefaultImageList;
      let video = image(res.data.VideoImage);
      let swipers = [], detailImage = [], details = [];
      for (let i = 0; i < images.length; i++) {
        if (images[i].ShufflingfigureType == 1) {
          swipers.push(image(images[i].ImageDefaultUrl));
        } else {
          details.push(image(images[i].ImageDefaultUrl));
          detailImage.push({
            path: image(image(images[i].ImageDefaultUrl)),
            desc: images[i].ImageTips
          })
        }
      }
      console.log(swipers)
      that.setData({
        info: res.data,
        swipers: swipers,
        images: detailImage,
        video: video,
        count: images.length - 1,
        details: details
      })
    })
  },
  loadImage(event) {
    console.log(event)
    let count = this.data.count;
    let cur = this.data.cur;
    console.log(count)
    console.log(cur)
    if (cur == count) {
      this.setData({
        loading: false
      })
    } else {
      cur += 1;
      this.setData({
        cur: cur
      })
    }
  },
  previewSwiper() {
    let cardCur = this.data.cardCur;
    let swipers = this.data.swipers;
    wx.previewImage({
      urls: swipers,
      current: swipers[cardCur]
    })
  },
  previewDetails(event) {
    let index = event.currentTarget.dataset.index;
    let details = this.data.details;
    wx.previewImage({
      urls: details,
      current: details[index]
    })
  },
  share(res) {
    console.log(res);
    let userInfoWechat = res;
    let that = this;
    if (this.data.uniqueKey == -1) {
      // 用户授权
      userSetting('scope.userInfo', true).then(res => {
        console.log(res);
        // 微信登录
        login(res.userInfo).then(res => {
          console.log(res);
          let avatar = res.HeadPortraitUrl,
            name = res.WX;
          // 后台登录
          remote.login(res).then(res => {
            console.log(res);
            wx.setStorageSync(constants.UNIQUE_KEY, res.data);
            let uniqueKey = res.data
            let app = getApp();
            app.globalData.uniqueKey = uniqueKey;
            // 验证用户是否有名片
            remote.checkCard(res.data).then(res => {
              console.log(res)
              if (res.success) {
                that.remotegetInfo(uniqueKey);
              } else {
                console.log('创建名片')
                let iscreated = that.data.iscreated;
                if (!iscreated) {
                  that.createCard(uniqueKey, avatar, name).then(res => {
                    if (res.success) {
                      wx.showToast({
                        title: '登录成功',
                        icon: 'none'
                      })
                    }
                  });
                }
              }
            })
          })
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        title: '去生成海报',
        icon: 'none'
      })
    }
  }
})