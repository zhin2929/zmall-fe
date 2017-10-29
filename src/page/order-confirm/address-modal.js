/**
 * Author: zhin
 * Date: 2017/10/29 20:51
 */

'use strict';

var _mm = require('util/mm.js');
var _address = require('service/address-service.js');
var _cities = require('util/cities/index.js');
var templateAddressModal = require('./address-modal.string');

var addressModal = {

  show : function (option) {
    this.option = option;
    this.option.data = option.data || {};
    this.$modalWrap = $('.modal-wrap');
    this.loadModal();
    this.bindEvent();
  },
  bindEvent : function () {
    var _this = this;
    // 省市二级联动
    this.$modalWrap.find('#receiver-province').change(function () {
      var selectProvince = $(this).val();
      _this.loadCities(selectProvince);
    });
    // 提交收货地址
    this.$modalWrap.find('.address-btn').click(function () {
      var receiverInfo = _this.getReceiverInfo(),
          isUpdate = _this.option.isUpdate;
      // 使用新地址且验证通过
      if (!isUpdate && receiverInfo.status) {
        _address.save(receiverInfo.data, function (res) {
          _mm.successTips('地址添加成功!');
          _this.hide();
          typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
        }, function (errMsg) {
          _mm.errorTips(errMsg);
        })
      }
      // 更新地址且验证通过
      else if (isUpdate && receiverInfo.status) {
        _address.update(receiverInfo.data, function (res) {
          _mm.successTips('地址修改成功!');
          _this.hide();
          typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
        }, function (errMsg) {
          _mm.errorTips(errMsg);
        })
      }
      // 验证不通过
      else {
        _mm.errorTips(receiverInfo.errMsg || "好像哪里不对了~");
      }
    });
    // 防止事件冒泡
    this.$modalWrap.find('.modal-container').click(function (e) {
      e.stopPropagation();
    });
    // 点击右上角x号或蒙版区其他位置，关闭弹窗
    this.$modalWrap.find('.close').click(function () {
      _this.hide();
    })


  },
  loadModal : function () {
    var addressModalHtml = _mm.renderHtml(templateAddressModal, {
      isUpdate : this.option.isUpdate,
      data : this.option.data
    });
    this.$modalWrap.html(addressModalHtml);
    this.loadProvince();
  },
  // 加载省份信息
  loadProvince : function () {
    var provinces = _cities.getProvinces() || [],
        $provinceSelect = this.$modalWrap.find('#receiver-province');
    $provinceSelect.html(this.getSelectOption(provinces));
    // 如果是更新地址，做省份回填
    if (this.option.isUpdate && this.option.data.receiverProvince) {
      $provinceSelect.val(this.option.data.receiverProvince);
      this.loadCities(this.option.data.receiverProvince);
    }
  },
  // 加载城市信息
  loadCities : function (provinceName) {
    var cities = _cities.getCities(provinceName) || [],
        $citySelect = this.$modalWrap.find('#receiver-city');
    $citySelect.html(this.getSelectOption(cities));
    // 如果是更新地址，做城市回填
    if (this.option.isUpdate && this.option.data.receiverCity) {
      $citySelect.val(this.option.data.receiverCity);
    }
  },
  // 获取表单里收件人信息，并做表单的验证
  getReceiverInfo : function () {
    var receiverInfo = {},
        result = {
          status : false
        };
    receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val());
    receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
    receiverInfo.receiverCity = this.$modalWrap.find('#receiver-city').val();
    receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val());
    receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val());
    receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val());

    if (this.option.isUpdate) {
      receiverInfo.id = this.$modalWrap.find('#receiver-id').val();
    }
    if (!receiverInfo.receiverName) {
      result.errMsg = '请输入收件人姓名';
    } else if (!receiverInfo.receiverProvince) {
      result.errMsg = '请输入收件人所在省份';
    } else if (!receiverInfo.receiverCity) {
      result.errMsg = '请输入收件人所在城市';
    } else if (!receiverInfo.receiverAddress) {
      result.errMsg = '请输入收件人详细地址';
    } else if (!receiverInfo.receiverPhone) {
      result.errMsg = '请输入收件人手机号';
    } else {
      // 所有验证都通过了
      result.status = true;
      result.data = receiverInfo;
    }
    return result;
  },
  getSelectOption : function (optionArray) {
    var html = '<option value="">请选择</option>';
    for (var i = 0, length = optionArray.length; i < length; i++) {
      html += '<option value="'+ optionArray[i] +'">'+ optionArray[i] +'</option>';
    }
    return html;
  },
  // 关闭弹窗
  hide : function () {
    this.$modalWrap.empty();
  }
};


module.exports = addressModal;













