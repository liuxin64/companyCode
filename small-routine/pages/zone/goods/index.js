import product from '../../../service/product.js';
import remote from '../../../service/remote.js';
import constants from '../../../common/constants.js';
import { image } from '../../../request/index.js';
let pageStart = 0;
Page({
  data: {
    setting: false,
    products: [],
    more: true,
    page: {
      pageSize: 12,
      currentPage: 1,
      sort: 'desc'
    },
    saling: 10,
    checked: [], // 选择数组
    sales: [], // 上下架数组
    deleted: [], // 删除数组
    hadChecked: 0,
    ranks: [],
    loading: false,
    checkall: false,
    requesting: false,
    end: false,
    emptyShow: false,
    pages: pageStart,
    hasTop: true,
    enableBackToTop: false,
    refreshSize: 90,
    bottomSize: 350,
    color: "#3F82FD",
    items: [
      { name: '蓝', value: '#3F82FD', checked: 'true' },
      { name: '红', value: '#ff4158' },
    ],
    empty: false
  },
  onLoad: function (options) {
    this.getHeight();
    let uniqueKey = wx.getStorageSync(constants.UNIQUE_KEY);
    this.setData({
      uniqueKey: uniqueKey,
      loading: true
    })
    this.initProducts(this.data.saling, this.data.page);
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  getHeight() {
    let res = wx.getSystemInfoSync();
    let windowHeight = (res.windowHeight * (750 / res.windowWidth));
    this.setData({
      screenHeight: windowHeight
    })
  },
  back(event) {
    wx.navigateBack({});
  },
  refresh() {
    console.log('刷新')
    this.setData({
      end: true,
      requesting: false,
      pages: 1,
      emptyShow: false
    })
  },
  search(event) {
    console.log(event)
  },
  manage() {
    let setting = this.data.setting;
    let products  = this.data.products;
    for (let i = 0; i < products.length; i++) {
      products[i]['checked'] = false;
      products[i]['hidden'] = false;
    }
    this.setData({
      setting: !setting,
      checked: [],
      deleted: [],
      sales: [],
      checkall: false,
      products: products
    })
  },
  setRank(event) {
    console.log(event)
    let sysno = event.currentTarget.dataset.index;
    let value = event.detail.value;
    let ranks = this.data.ranks;
    let flag = false; // 确定是否已经添加到排序数组中
    for (let i = 0; i < ranks.length; i++) {
      if (ranks[i].sysNo == sysno) {
        ranks[i].Priority = value;
        flag = true
      }
    }
    if (!flag) {
      ranks.push({
        sysNo: sysno,
        Priority: value
      })
    }
    this.setData({
      ranks: ranks
    })
  },
  // 展示中的产品方法
  initProducts(saling, page) {
    let uniqueKey = this.data.uniqueKey;
    let more = this.data.more;
    if (!more) {
      wx.showToast({
        title: '没有了',
        icon: 'none'
      })
      return ;
    }
    let that = this;
    product.getProductList(79, saling, 2, "", page).then(res => {
      let products = that.data.products;
      let newList = res.data;
      for (let i = 0; i < newList.length; i++) {
        newList[i].DefaultImage = image(newList[i].DefaultImage);
      }
      page.currentPage += 1;
      that.setData({
        products: products.concat(newList),
        more: newList.length < page.pageSize,
        page: page,
        loading: false
      })
    })
  },
  navigateToDetails(event) {
    console.log(event)
    let index = event.currentTarget.dataset.index;
    let products = this.data.products;
    let item = products[index];
    wx.navigateTo({
      url: `./details/index?goodsId=${item.SysNo}`,
    })
  },
  // 编辑商品
  edit(event) {
    console.log(event)
  },
  //置顶
  setTop(event) {
    console.log(event);
    let index = event.currentTarget.dataset.index;
    let products = this.data.products;
    let that = this;
    products[index].IsDisplayWebsite = (products[index].IsDisplayWebsite == 0 ? 1 : 0);
    product.updateIsTopic(products[index].SysNo, products[index].IsDisplayWebsite).then(res => {
      if (res.success) {
        that.setData({
          products: products
        }, () => {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
        })
      } else {
        wx.showToast({
          title: '置顶失败',
          icon: 'none'
        })
      }
      
    })
  },
  // 初始化下架商品
  initOffSale(event) {
    console.log("下架商品")
    let that = this;
    let saling = that.data.saling == 10 ? 20 : 10;
    that.setData({
      loading: true,
      saling: saling,
      products: [],
      deleted: [],
      hadChecked: 0,
      more: true,
      setting: false
    }, () => {
      let page = that.data.page;
      page.currentPage = 1;
      that.initProducts(saling, page);
    })
  },
  // 下架/上架/删除
  // 确定后再进行下架
  offsale(event) {
    console.log("下架")
    let products = this.data.products;
    let checked = this.data.checked;
    let sales = this.data.sales;
    let deleted = this.data.deleted;
    let target = event.currentTarget.dataset.target;
    for (let i = 0; i < checked.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (products[j].SysNo == parseInt(checked[i])) {
          products[i]['hidden'] = true;
          if (target == 'sale') {
            // 上下架
            sales.push(checked[i]);
          } else {
            // 删除
            deleted.push(checked[i]);
          }
        }
      }
    }
    this.setData({
      products: products,
      checked: [],
      deleted: deleted,
      sales: sales,
      hadChecked: 0
    })
  },
  // 提交
  submit(event) {
    console.log("确定");
    let ranks = this.data.ranks;
    let deleted = this.data.deleted;
    let sales = this.data.sales;
    if (ranks.length == 0 && deleted.length == 0 && sales.length == 0) {
      this.setData({
        setting: false
      })
      return ;
    }
    this.setData({
      loading: true
    })
    let saling = ( this.data.saling == 10 ? 20 : 10 );
    let that = this;
    new Promise((resolve, reject) => {
      // 不管现在处于什么状态，都调用所有方法进行操作；
      // 上下架
      if (sales.length > 0) {
        let temp = [];
        for (let i = 0; i < sales.length; i++) {
          temp.push({
            SysNo: sales[i],
            ProductStatus: saling
          })
        }
        product.offSale(temp).then(res => {
          resolve(res)
        })
      }
      if (deleted.length > 0) {
        let deletetemp = [];
        for (let i = 0; i < deleted.length; i++) {
          deletetemp.push({
            SysNo: deleted[i]
          })
        }
        product.deleteProductList(deletetemp).then(res => {
          resolve(res)
        });
      }
      if (ranks.length > 0) {
        product.updateRank(ranks).then(res => {
          resolve(res)
        });
      }
    }).then(res => {
      wx.showToast({
        title: '修改成功',
        icon: 'none'
      })
      that.setData({
        ranks: [],
        checked: [],
        deleted: [],
        sales: [],
        setting: false,
        loading: false,
        hadChecked: 0
      })
    })
  },
  // checkbox 
  checkboxChange(event) {
    let checked = event.detail.value;
    let products = this.data.products;
     this.setData({
       checked: checked,
       checkall: products.length == checked.length,
       hadChecked: checked.length
     })
  },
  // 全选
  checkAll(event) {
    let checkall = !this.data.checkall;
    let products = this.data.products;
    let temp = [];
    for (let i = 0; i < products.length; i++) {
      products[i]['checked'] = checkall; // 注意，这里仅仅适用于全选，后续操作中会出现不一致的情况，使用id来确认更准确
      if (checkall) {
        temp.push(products[i].SysNo.toString());
      }
    }
    this.setData({
      products: products,
      checkall: checkall,
      checked: temp,
      hadChecked: temp.length
    })
  }
})