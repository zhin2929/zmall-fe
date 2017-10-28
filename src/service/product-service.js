/**
 * Author: zhin
 * Date: 2017/10/28 13:47
 */

'use strict';

var _mm = require('util/mm.js');

var _product = {
  // 获取商品列表信息
  getProductList : function (listParam, resolve, reject) {
    _mm.request({
      url : _mm.getServerUrl('/product/list.do'),
      data : listParam,
      success : resolve,
      error : reject
    });
  }
};

module.exports = _product;