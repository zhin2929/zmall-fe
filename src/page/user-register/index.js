/**
 * Author: zhin
 * Date: 2017/10/28 9:08
 */

'use strict';

require('./index.css');
require('page/common/nav-simple/index.js');
var _user = require('service/user-service.js');
var _mm   = require('util/mm.js');


// 表单里的错误提示
var formError = {
  show : function(errMsg) {
    $('.error-item').show().find('.err-msg').text(errMsg);
  },
  hide : function() {
    $('.error-item').show().find('.err-msg').text('');
  }
};

var page = {
  init : function () {
    this.bindEvent();
  },
  bindEvent : function() {
    var _this = this;
    // 验证username
    $('#username').blur(function () {
      var username = $.trim($(this).val());
      if (!username) {
        return;
      }
      // 异步验证用户名是否存在
      _user.checkUsername(username, function (res) {
        formError.hide();
      }, function(errMsg) {
        formError.show(errMsg);
      });
    });
    // 注册按钮点击
    $('#submit').click(function() {
      _this.submit();
    });
    // 按回车点击提交
    $('.user-content').keyup(function(e) {
      if (e.keyCode === 13) {
        _this.submit();
      }
    });
  },
  // 提交表单
  submit : function() {
    var formData = {
          username : $.trim($('#username').val()),
          password : $.trim($('#password').val()),
          passwordConfirm : $.trim($('#password-confirm').val()),
          phone    : $.trim($('#phone').val()),
          email    : $.trim($('#email').val()),
          question : $.trim($('#question').val()),
          answer   : $.trim($('#answer').val())
        },
        // 表单验证结果
        validateResult = this.formValidate(formData);
    if (validateResult.status) {
      _user.register(formData, function(res) {
        window.location.href = './result.html?type=register';
      }, function(errMsg) {
        formError.show(errMsg);
      });
    } else {
      formError.show(validateResult.msg);
    }

  },
  // 表单字段的验证
  formValidate : function(formData) {
    var result = {
      status : false,
      msg    : ''
    };
    if (!_mm.validate(formData.username, 'require')) {
      result.msg = '用户名不能为空';
      return result;
    }
    if (!_mm.validate(formData.password, 'require')) {
      result.msg = '密码不能为空';
      return result;
    }
    if (formData.password.length < 6) {
      result.msg = '密码长度不能少于6位';
      return result;
    }
    if (formData.password !== formData.passwordConfirm) {
      result.msg = '两次输入密码不一致';
      return result;
    }
    if (!_mm.validate(formData.phone, 'phone')) {
      result.msg = '手机号格式不正确';
      return result;
    }
    if (!_mm.validate(formData.email, 'email')) {
      result.msg = '邮箱格式不正确';
      return result;
    }
    if (!_mm.validate(formData.question, 'require')) {
      result.msg = '密码提示问题不能为空';
      return result;
    }
    if (!_mm.validate(formData.answer, 'require')) {
      result.msg = '密码提示问题答案不能为空';
      return result;
    }

    // 通过验证
    result.status = true;
    result.msg = "验证通过";
    return result;
  }
};

$(function() {
  page.init();
});