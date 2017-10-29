/**
 * Author: zhin
 * Date: 2017/10/28 18:59
 */

'use strict';

require('./index.css');
require('page/common/header/index.js');
var nav = require('page/common/nav/index.js');
var _mm = require('util/mm.js');
var _cart = require('service/cart-service');
var templateIndex = require('./index.string');

var page = {
  data: {

  },
  init: function () {
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function () {
    this.loadCart();
  },
  bindEvent: function () {
    var _this = this;
    $(document).on('click', '.cart-select',function () {
      var $this = $(this),
          productId = $this.parents('.cart-table').data('product-id');
      if ($this.is(':checked')) {
        _cart.selectProduct(productId, function (res) {
          _this.renderCart(res);
        }, function (errMsg) {
          _this.showCartError();
        });
      } else {
        _cart.unselectProduct(productId, function (res) {
          _this.renderCart(res);
        }, function (errMsg) {
          _this.showCartError();
        });
      }
    } );

    $(document).on('click', '.cart-select-all',function () {
      var $this = $(this);
      if ($this.is(':checked')) {
        _cart.selectAllProduct(function (res) {
          _this.renderCart(res);
        }, function (errMsg) {
          _this.showCartError();
        });
      } else {
        _cart.unselectAllProduct(function (res) {
          _this.renderCart(res);
        }, function (errMsg) {
          _this.showCartError();
        });
      }
    } );

    $(document).on('click', '.count-btn',function () {
      var $this = $(this),
          $pCount = $this.siblings('.count-input'),
          currCount = parseInt($pCount.val()),
          type = $this.hasClass('plus') ? 'plus' : 'minus',
          productId = $this.parents('.cart-table').data('product-id'),
          minCount = 1,
          maxCount = parseInt($pCount.data('max')),
          newCount = 0;
      if (type === 'plus') {
        if (currCount >= maxCount) {
          _mm.errorTips('该商品数量已达到上限');
          return;
        }
        newCount = currCount + 1;
      } else if (type === 'minus'){
        if (currCount < minCount) {
          return;
        }
        newCount = currCount - 1;
      }
      _cart.updateProduct({
        productId : productId,
        count : newCount
      }, function (res) {
        _this.renderCart(res);
      }, function (errMsg) {
        _this.showCartError();
      });
    });

    $(document).on('click', '.cart-delete', function () {
      if (window.confirm('确认要删除该商品吗？')) {
        var productId = $(this).parents('.cart-table').data('product-id');
        _this.deleteCartProduct(productId);
      }
    });

    $(document).on('click', '.delete-selected', function () {
      if (window.confirm('确认要删除选中的商品吗？')) {
        var productId = $(this).parents('.cart-table').data('product-id');
        var arrProductIds = [],
            $selectedItem = $('.cart-select:checked');
        for (var i = 0, iLength = $selectedItem.length; i < iLength; i++) {
          arrProductIds
              .push($($selectedItem[i]).parents('.cart-table').data('product-id'));
        }
        if (arrProductIds.length) {
          _this.deleteCartProduct(arrProductIds.join(','));
        } else {
          _mm.errorTips("您还没有选择要删除的产品");
        }
      }
    });
    // 提交购物车
    $(document).on('click', '.btn-submit', function () {
      if (_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0) {
        window.location.href = './order-confirm.html';
      } else {
        _mm.errorTips("您还没有选择商品");
      }
    });
  },
  // 加载购物车的数据
  loadCart: function () {
    var _this = this;
    _cart.getCartList(function (res) {
      _this.renderCart(res);
    }, function (errMsg) {
      _this.showCartError();
    });

  },
  // 渲染购物车
  renderCart : function (data) {
    this.filter(data);
    // 缓存购物车信息
    this.data.cartInfo = data;
    var cartHtml = _mm.renderHtml(templateIndex, data);
    $('.page-wrap').html(cartHtml);
    // 通知导航的购物车更新数量
    nav.loadCartCount();
  },
  // 数据匹配
  filter: function (data) {
    data.notEmpty = !!data.cartProductVoList.length;
  },
  showCartError : function () {
    $('.page-wrap').html('<p class="err-tip">哪里不对了，请重新刷新一下!</p>');
  },
  // 删除商品
  deleteCartProduct : function (productIds) {
    var _this = this;
    _cart.deleteProduct(productIds, function (res) {
      _this.renderCart(res);
    }, function (errMsg) {
      _this.showCartError();
    })
  }


};

$(function () {
  page.init();
});













