/**
 * Author: zhin
 * Date: 2017/10/27 23:57
 */

'use strict';

var _mm = require('util/mm.js');

var _user = {
  // 登出
  logout : function(resolve, reject){
    _mm.request({
      url     : _mm.getServerUrl('/user/logout.do'),
      method  : 'POST',
      success : resolve,
      error   : reject
    });
  }
};
module.exports = _user;