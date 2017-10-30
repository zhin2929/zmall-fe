/**
 * Author: zhin
 * Date: 2017/10/30 13:40
 */

'use strict';


require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _mm = require('util/mm.js');
var _order = require('service/order-service.js');

var templateIndex = require('./index.string');

var page = {
  data : {
    orderNumber : _mm.getUrlParam('orderNumber')
  },
  init : function () {
    this.onLoad();
    this.bindEvent();
  },
  bindEvent : function () {
    var _this = this;
    $(document).on('click', '.order-cancel', function () {
      if (window.confirm('确定要取消该订单吗？')) {
        _order.cancelOrder(_this.data.orderNumber, function (res) {
          _mm.successTips('该订单取消成功');
          _this.loadDetail();
        }, function (errMsg) {
          _mm.errorTips(errMsg);
        });
      }

    });
  },
  onLoad : function () {
    //初始化左侧菜单
    navSide.init({
      name : 'order-list'
    });
    // 加载数据
    this.loadDetail();
  },
  // 加载订单列表
  loadDetail : function () {
    var _this = this,
        orderDetailHtml = '',
        $content = $('.content');
    $content.html('<div class="loading"></div>');
    _order.getOrderDetail(this.data.orderNumber, function (res) {
      _this.dataFilter(res);
      // 渲染订单列表html
      orderDetailHtml = _mm.renderHtml(templateIndex, res);
      $content.html(orderDetailHtml);

    }, function (errMsg) {
      $content.html('<p class="err-tip">'+ errMsg +'</p>')
    });
  },
  // 数据适配
  dataFilter : function (data) {
    data.needPay = data.status === 10;
    data.isCancelable = data.isCancelable === 10;
  }
};

$(function () {
  page.init();
});