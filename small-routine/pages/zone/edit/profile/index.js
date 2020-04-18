// pages/zone/edit/profile/index.js
import constants from '../../../../common/constants.js';
import WxValidate from '../../../../utils/WxValidate.js';
import remote from '../../../../service/remote.js';
import { uploadFiles } from '../../../../service/upload.js';
import { image } from '../../../../request/index.js';
const app = getApp();
Page({
  data: {
    region: [],
    showAction: false,
    groups: [
      { text: '查看大图', value: 1 },
      { text: '从相册中选择', value: 2 }
    ],
    form: {}
  },
  onLoad: function (options) {
    this.initData();
  },
  onReady: function () {
    this.initValidate();
  },
  onShow: function () {
    let avatar = app.globalData['cropperImage'];
    if (avatar) {
      this.setData({
        avatar: avatar
      })
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  back(event) {
    wx.navigateBack({});
  },
  submit(event) {
    console.log(event)
  },
  showAction(event) {
    this.setData({
      showAction: true
    })
  },
  actiontapClick:function(event) {
    console.log(event)
    let index = event.detail.index;
    let that = this;
    switch(index) {
      case 0:
        wx.previewImage({
          urls: [this.data.avatar],
          current: this.data.avatar
        })
        break;
      case 1:
        wx.chooseImage({
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          count: 1,
          success: function(res) {
            console.log(res)
            let avatar = res.tempFilePaths[0];
            app.globalData['cropperImage'] = avatar;
            console.log(res.tempFilePaths[0])
            wx.navigateTo({
              url: `../../../copper/copper?path=${avatar}`,
              success: function() {
                that.setData({
                  showAction: false,
                  actionImage: true
                })
              }
            })
          },
          fail: function (err) {
            wx.showToast({
              title: '拍照失败',
              icon: 'none',
              success: function () {
                that.setData({
                  showAction: false
                })
              }
            })
          }
        })
        break;
    }
  },
  initData:function() {
    let info = this.data.myInfo;
    let we = wx.getStorageSync(constants.WX_USER_INFO);
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    if (we) {
      let { 
        HeadPortraitUrl: avatar,
        Name: name,
        Phone: phone,
        PersonalProfile: desc,
        WX: wechat,
        School: school,
        Hometown: hometown,
        Email: email
        } = we;
      this.setData({
        form: {
          name: name,
          phone: phone,
          school: school,
          desc: desc,
          wechat: wechat,
          email: email
        },
        avatar: image(avatar),
        wxUserInfo: we,
        hometown: hometown,
        uniqueKey: uniqueKey
      })
    }
  },
  // 初始化验证规则
  initValidate: function() {
    const rules = {
      name: {
        required: true,
        minlength: 2
      },
      phone: {
        required: true,
        minlength: 11,
        tel: true
      }
    }
    const messages = {
      name: {
        required: '请填写姓名',
        minlength: '姓名至少两个字'
      },
      phone: {
        required: '请填写手机号码',
        tel: '请正确填写手机号码'
      },
      email: {
        email: ''
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    const params = e.detail.value
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      wx.showToast({
        title: error.msg,
        icon: 'none'
      })
      return false
    }
    this.setData({
      loading: true
    }, () => {
      this.updateInfo(params);
    })
  },
  updateInfo: function(form) {
    let that = this;
    console.log(form)
    let wxUserInfo = this.data.wxUserInfo;
    wxUserInfo.Name = form.name;
    wxUserInfo.Phone = form.phone;
    wxUserInfo.WX = form.wechat;
    wxUserInfo.Hometown = this.data.hometown;
    wxUserInfo.School = form.school;
    wxUserInfo.PersonalProfile = form.desc;
    wxUserInfo.Email = form.email;
    console.log(this.data.avatar)
    if (this.data.actionImage) {
      uploadFiles(wxUserInfo.UserSysNo, 1, [{ path: this.data.avatar }]).then(res => {
        console.log(res[0].path)
        wxUserInfo.HeadPortraitUrl = res[0].path;
        remote.updateWxUser(wxUserInfo).then(res => {
          console.log(res)
          wx.setStorageSync(constants.WX_USER_INFO, wxUserInfo);
          remote.getCardInfo(this.data.uniqueKey).then(res => {
            wx.setStorageSync(constants.USERINFO, res.data);
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              success: function () {
                that.setData({
                  loading: false
                })
              }
            })
          })
        })
      })
    } else {
      remote.updateWxUser(wxUserInfo).then(res => {
        console.log(res)
        wx.setStorageSync(constants.WX_USER_INFO, wxUserInfo);
        remote.getCardInfo(this.data.uniqueKey).then(res => {
          wx.setStorageSync(constants.USERINFO, res.data);
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            success: function () {
              that.setData({
                loading: false
              })
            }
          })
        })
      })
    }
  },
  bindRegionChange: function (event) {
    console.log(event)
    let hometown = event.detail.value;
    this.setData({
      hometown: hometown[0] + " " + hometown[1] + " " + hometown[2]
    })
  }
})