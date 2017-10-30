/**
 * Author: zhin
 * Date: 2017/10/29 18:54
 */

'use strict';
var _mm = require('util/mm.js');

var _order = {
  // 获取商品列表
  getProductList : function (resolve, reject) {
    _mm.request({
      url : _mm.getServerUrl('/order/get_order_cart_product.do'),
      success : resolve,
      error : reject
    });
  },
  createOrder : function (orderInfo, resolve, reject) {
    _mm.request({
      url : _mm.getServerUrl('/order/create.do'),
      data : orderInfo,
      success : resolve,
      error : reject
    });
  },
  getOrderList : function (listParam, resolve, reject) {
    _mm.request({
      url : _mm.getServerUrl('/order/list.do'),
      data : listParam,
      success : resolve,
      error : reject
    });
  }
};

module.exports = _order;