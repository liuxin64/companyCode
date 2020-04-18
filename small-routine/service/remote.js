import { get, post } from '../request/index.js';

const remote = {
  // 登录
  login(params) {
    return post('/WX_SmallProcedures/Login', params);
  },
  // 检查卡片是否存在
  checkCard(uniqueKey) {
    return post(`/WX_SmallProcedures/ExistBusinesscard?userSysNo=${uniqueKey}`);
  },
  // 获取名片信息
  getCardInfo(uniqueKey) {
    return get(`/WX_SmallProcedures/GetBusinessCardInfo?sysNo=${uniqueKey}`)
  },
  // 创建二维码
  /**
   * @type 类型 1 个人 2商品
   */
  createQr(uniqueKey, type, data) {
    return post(`/WX_SmallProcedures/CardApp_GetPageQRCodeUrl?sysNo=${uniqueKey}&type=${type}`, data);
  },
  // 获取电话
  getPhone(encryptedData, iV, userSysNo) {
    return post('/WX_SmallProcedures/GetPhoneNumber', {
      encryptedData: encryptedData,
      iV: iV,
      userSysNo: userSysNo
    })
  },
  // 获取浏览记录
  historyItems(uniqueKey, page) {
    return post(`/WX_SmallProcedures/GetCustomerRecordsHomePage?userSysNo=${uniqueKey}`, page);
  },
  // 获取名片点赞情况
  appreciateUserStatus(uniqueKey, targetUserId, type) {
    return post(`/WX_SmallProcedures/ExistPointPraise?visitorSysNo=${uniqueKey}&businessCardSysNo=${targetUserId}&type=${type}`);
  },
  // 名片点赞
  doAppreciateCard(targetUserId, uniqueKey, type) {
    return post(`/WX_SmallProcedures/UpdatePointRatio?touserSysNo=${targetUserId}&userSysNo=${uniqueKey}&type=${type}`);
  },
  // 是否收藏名片
  doCollectionStatus(targetUserId, uniqueKey, cardSysNo) {
    return post(`/WX_SmallProcedures/ExitsCollection?userSysNo=${targetUserId}&inUserSysNo=${uniqueKey}&cardSysNo=${cardSysNo}`)
  },
  // 收藏名片
  /**
   * UserSysNo: targetUserId,
      InUserSysNo: uniqueKey,
      BusinessCardSysNo: info.SysNo
   */
  doCollecteCard(data) {
    return post('/WX_SmallProcedures/InsertCollection', data);
  },
  // 获取原始微信的用户信息
  getOriginWxInfo(uniqueKey) {
    return get(`/WX_SmallProcedures/GetWXUserInfo?userSysNo=${uniqueKey}`);
  },
  // 查看是否为同乡
  checkSamePlace(targetUserId, uniqueKey, type) {
    return get(`/WX_SmallProcedures/getFriend?UserSysNo=${targetUserId}&InUserSysNo=${uniqueKey}&Type=${type}`);
  },
  // 添加是同乡/是校友
  createFrinds(data) {
    return post(`/WX_SmallProcedures/CreatFriend`, data);
  },
  // 删除是校友/是同乡
  deleteFriends(uniqueKey, targetUserId, type) {
    return post(`/WX_SmallProcedures/CancelFriend?userSysNo=${uniqueKey}&cardUserSysNo=${targetUserId}&type=${type}`);
  },
  // 获取当前名片的标签
  getLabels(uniqueKey, targetUserInfo) {
    return get(`/WX_SmallProcedures/GetLablesByUserSysNo?userSysNo=${uniqueKey}&cardUserSysNo=${targetUserInfo}`);
  },
  // 点赞标签
  likeLabel(data) {
    return post(`/WX_SmallProcedures/CreatLabelsandcompliments`, data);
  },
  // 获取留言列表
  getCommentsList(targetUserId, uniqueKey, page) {
    return post(`/WX_SmallProcedures/SelectCommentPointRatioList?userSysNo=${targetUserId}&touserSysNo=${uniqueKey}`, page)
  },
  // 评论点赞或者取消点赞
  // type: 0 点赞 1 取消
  updateLiked(uniqueKey, targetUserId, type) {
    return post(`/WX_SmallProcedures/UpdateCommentPointRatio?userSysNo=${uniqueKey}&touserSysNo=${targetUserId}&sysNo=${type}`);
  },
  // 浏览过的名片
  getSelfHistory(uniqueKey, page) {
    return post(`/WX_SmallProcedures/GetCustomerRecordsOthers?userSysNo=${uniqueKey}`, page)
  },
  // 修改用户
  updateWxUser(data) {
    return post('/WX_SmallProcedures/UpdateWXUser', data);
  },
  // 获取用户商品包
  getUserPackage(uniqueKey) {
    return get(`/WX_SmallProcedures/GetUserPackage?userSysNo=${uniqueKey}`)
  },
  // 创建照片
  createImages(data) {
    return post('/WX_SmallProcedures/CreatCoustomermedia', data);
  },
  // 删除照片
  deleteImages(data) {
    return post('/WX_SmallProcedures/DeleteCoustomermedia', data);
  },
  // 修改照片
  updateImages(data) {
    return post('/WX_SmallProcedures/UpdateCoustomermedia', data);
  },
  // 获取媒体
  getMedia(key, type) {
    return get('/WX_SmallProcedures/GetCoustomermedia', {
      coustomerSysNo: key,
      type: type
    });
  },
  // 新增批发商与使用用户关系联系
  insertRelationship(data) {
    return post(`/WX_SmallProcedures/InsertRelationship`, data);
  },
  // 获取公司信息
  getCompanyInfo(uniqueKey) {
    return get(`/WX_SmallProcedures/GetCompanyInformation?userSysNo=${uniqueKey}`);
  },
  // 修改公司信息
  updateCompany(data) {
    return post('/WX_SmallProcedures/UpdateCompanyInformation', data);
  },
  // 获取公司分类
  getCompanyCategory() {
    return get('/WX_SmallProcedures/GetIndustryType')
  },
  // 获取职位
  getPositions() {
    return get('/WX_SmallProcedures/GetPositon')
  },
  // 添加公司信息
  insertCompany(data) {
    return post(`/WX_SmallProcedures/InsertCompanyInformation`, data);
  },
  // 获取当前用户自己的标签
  getCurrentUserLabel(key) {
    return get(`/WX_SmallProcedures/GetCurrentUserLabelByUserSysNo?userSysNo=${key}`);
  },
  // 删除当前用户自己的标签
  deleteCurrentUserLabel(key) {
    return post(`/WX_SmallProcedures/DeleteCurrentUserLabelByUserSysNo?sysNo=${key}`);
  },
  // 添加标签
  createTags(data) {
    return post('/WX_SmallProcedures/InsertLables', data)
  },
  /**
   * 创建名片
   */
  createBusinessCard(data) {
    return post('/WX_SmallProcedures/CreatBusinesscard', data);
  },
  // 获取收藏列表
  getCollectionList(key) {
    return get('/WX_SmallProcedures/GetCollectionList', {
      userSysNo: key
    });
  },
  // 添加留言
  insertComment(data) {
    return post('/WX_SmallProcedures/CreatComment', data)
  },
}

export default remote;