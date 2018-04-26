import { progressBarColorSets as _progressBarColorSets} from '../mock/RC-progressBar.mock.js';
import { plans } from '../mock/RC-user.mock';
import { UserService, RecordService } from '../service/index';

const app = getApp();

Page({

  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    progressBarColorSets: _progressBarColorSets,
    weeklyReords: [],
    showBackdrop: 'none',
    dialogEvent: '',
    plan: 5,
    plans: plans
  },

  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          console.debug(res.userInfo);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.loadData();
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  loadData: function() {
    let that = this;
    return RecordService
      .getInstance()
      .getWeeklyRecordByUserId(app.globalData.userInfo.userId, 1)
      .then(res => {
        that.setData({
          weeklyReords: {
            range: res.data.data.timeRange,
            record: res.data.data.userRecords
          }
        });
        return new Promise((resolve) => resolve());
      });
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  backdropMgt: function () {
    let _showBackdrop = this.data.showBackdrop;
    if (_showBackdrop == 'none') {
      this.setData({
        showBackdrop: 'block'
      });
    } else {
      this.setData({
        showBackdrop: 'none'
      });
    }
  },
  goToPlan: function (e) {
    this.setData({
      dialogEvent: 'plan'
    });
    this.backdropMgt();
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      plan: plans[val[0]]
    })
  },
  submitTarget: function (e) {
    const plan = this.data.plan;
    const userInfo = this.data.userInfo;
    UserService
      .getInstance()
      .submitTarget(userInfo.userId, userInfo.userGroupId, plan, 1)
      .then(res => wx.showToast({ title: 'submit!' }));;
  },
  onPullDownRefresh: function () {
    this
      .loadData()
      .then(() => wx.stopPullDownRefresh());
  }
})