;(function (global, factory) {
  // 确保函数能够正确地暴露给模块化环境，即使使用了不同的模块化方法。在多种不同的JavaScript环境中使用函数
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(global);
  }
  if (typeof define === 'function' && define.amd) {
    define(function () { return factory(global) })
  }
  else {
    factory(global)
  }
})(typeof global !== 'undefined' ? global : this, function (global) {
  /**
   * 获取链接中参数拼接位对象
   * @param {String} url 默认获取当前页面链接，可以传入自定义链接
   * @returns 返回一个链接参数组成的对象
   */
  function getUrlParams(url){
    var url = url || window.location.href;
    var params = {}, queries, temp, i, l;
    queries = url.split('?');
    if (/=+/.test(queries[1])) {
      temp = queries[1].split('&');
      for (i = 0, l = temp.length; i < l; i++) {
        var pair = temp[i].split('=');
        params[pair[0]] = pair[1] || '';
      }
    } else {
      params = undefined;
    }
    return params
  }

  // 
  /**
   * 柯里化函数 把函数传入完成柯里化
   * @param {Function} fn 
   * @returns 返回一个新的函数 接收参数，判断参数是否接收完
   */
  function curry(fn) {
    return function curryAdd(...args) {
      // 返回一个新的函数 接收参数，判断参数是否接收完t
      if (args.length >= fn.length) {
        return fn.apply(this, args);
      } else {
        return function (...newArgs) {
          return curryAdd.apply(this, args.concat(newArgs))
        }
      }
    }
  }

  /**
   * 移动端计算全屏缩小倍数
   * @param {*} designWidth 设计稿的宽度
   * @param {*} designHeight 设计稿的高度
   * @returns 返回移动端计算全屏缩小比列
   */
  function getScreenScale(designWidth, designHeight) {
    // 获取屏幕的宽度和高度
    var deviceWidth = document.documentElement.clientWidth;
    var deviceHeight = document.documentElement.clientHeight;
    // 如果设计尺寸的宽度大于屏幕的宽度,则返回缩放比例
    if (designHeight / designWidth > deviceHeight / deviceWidth) {
      return (deviceHeight / deviceWidth) / (designHeight / designWidth);
    } else {
      return 1
    }
  }

  /** 
   * 文字出现函数
   * @author 蒋维佳
   * @returns Promise 该函数返回promise 当所有文字显示完成返回
   * @param {String} contentClass 添加文案的盒子 类或者ID （".类"或者"#id"）
   * @param {Array<String>} textArray 接受一个文案数组，数组每个元素生成一个p元素
   * @param {Object} option 可配置参数
   * @param {Boolean} option.hasCursor textArray字符显示是否显示后面的闪烁光标,默认true 显示光标
   * @param {Number | Function} option.textInterval 接受一个文案现实的间隔时间或者函数，函数需返回一个Number类型的间隔时间。 
   * @example 
      option.textInterval函数的参数例子函数的text参数
      text = {
          list, 当前文字字符串
          listIndex:, 当前字符串在字符串数组中的索引
          index:,当前字符在字符串的索引
          node:,当前字符
          nextIndex 下一个字符在字符串中的索引
      }
      function textInterval(text){
          var time = 3000;
          if(text.node==="。"){
              time = 300
          } else{
              time = 20
          }
          if(text.nextIndex === 0){
              time = 3000
          }
          return time
      }
      textShowAlong(text2,".content",{
        textInterval:textInterval
      }) 
  **/
  function textShowAlong(textArray, contentClass, option) {
    let options = option || {}
    let defaultOpt = {
      textInterval:options.textInterval || 50,
      hasCursor:options.hasCursor===false? false: true
    }
    let {textInterval,hasCursor} = defaultOpt
    return new Promise((resole) => {
      var content = document.querySelector(contentClass);
      var newTextArr = textArray.map(item => item.split(''))
      var newTextArrIdx = 0
      var newTextArrItemIdx = 0
      var style = document.createElement('style');
      var styleS = `${contentClass} p span.show{opacity:1;content:'';height:1em; margin-left:4px; vertical-align: middle;border-left:2px solid;display:inline-block;}`;
      var styleS2 = `${contentClass} p span.hide{opacity:0;height:1em; margin-left:4px; vertical-align: middle;border-left:2px solid;display:inline-block;}`
      document.head.appendChild(style);
      style.innerHTML = styleS + styleS2;
      var s = true;
      var gbTime = null;
      var itemP = textArray.map(item => document.createElement('p'))
      content.appendChild(itemP[newTextArrIdx]);
      function _showItem() {
        style.innerHTML = styleS
        s = true
        var text = newTextArr[newTextArrIdx][newTextArrItemIdx];
        var textNode = document.createTextNode(text)
        var textIndex = newTextArrItemIdx
        var textArrayIndex = newTextArrIdx
        if(hasCursor){
          itemP[newTextArrIdx].insertBefore(textNode, itemP[newTextArrIdx].querySelector('span'))
        }else{
          itemP[newTextArrIdx].appendChild(textNode);
        }
        newTextArrItemIdx++
        if (newTextArrItemIdx === newTextArr[newTextArrIdx].length) {
          // time = 8000
          hasCursor && itemP[newTextArrIdx].removeChild(itemP[newTextArrIdx].querySelector('span'));
          newTextArrIdx++
          newTextArrItemIdx = 0
          if (itemP[newTextArrIdx]) {
            hasCursor && _addGb()
            content.appendChild(itemP[newTextArrIdx]);
          }
        }
        if (newTextArrIdx < newTextArr.length) {
          var text = {
            list: newTextArr[newTextArrIdx],
            listIndex: textArrayIndex,
            index: textIndex,
            node: text,
            nextIndex: newTextArrItemIdx
          }
          var time = typeof textInterval === 'function'? textInterval(text) : textInterval ;
          setTimeout(() => {
            // requestAnimationFrame(_showItem)
            _showItem()
          }, time)
        } else {
          _clearGbTime()
          resole()
        }
      }
      function _gb() {
        _addGb();
        gbTime = setInterval(() => {
          document.querySelector(`${contentClass} p:last-child span`).className = s ? 'show' : 'hide'
          s = !s
        }, 500)
      }
      function _clearGbTime() {
        document.head.removeChild(style);
        clearInterval(gbTime)
      }
      function _addGb() { 
        var span = document.createElement('span')
        span.classList.add('show');
        itemP[newTextArrIdx].appendChild(span)
      }
      hasCursor && _gb()
      _showItem()
    })
  }

  /** 
   * 图片懒加载，使用Intersection Observer API 
   * 此函数不适合IE，因为IntersectionObserver API 不支持IE浏览器
   * @param {String} imgClass  类或者ID （".类"或者"#id"）
   * @param {Number} threshold 图片与 视口交叉的百分比，范围是 数字0-1.0
  **/
  function lazyLoadImg(imgClass, threshold) {
    if(typeof IntersectionObserver !== 'function'){
      throw new Error('浏览器不支持的IntersectionObserver API');
    }
    const imgList = document.querySelectorAll(imgClass)
    if(imgList.length === 0){
      throw new Error('没有找到图片');
    }
    let observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        let { isIntersecting } = entry
        if (isIntersecting) {
          observer.unobserve(entry.target)
          entry.target.src = entry.target.getAttribute('data-url')
          entry.target.removeAttribute('data-url');
        }
      }
    }, {
      threshold: threshold || 1, //介于 ​​0​​ 和 ​​1​​ 之间的数字，指示触发前应可见的百分比。也可以是一个数字数组，以创建多个触发点，也被称之为 阈值。如果构造器未传入值, 则默认值为 ​​0​​ 。
    });
    for (let i = 0; i < imgList.length; i++) {
      const imgRealSrc = imgList[i].getAttribute('data-url');
      observer.observe(imgList[i]);
    }
    
  }

  // 简单检测图片以加载完成
  function checkImgCatch(imgSrc) {
    const img = new Image();
    img.src = imgSrc; // 图片原地址
    return img.complete
  }
  
  var utils = {
    getUrlParams,
    curry,
    getScreenScale,
    textShowAlong,
    lazyLoadImg,
    checkImgCatch
  }, $UTILS;

  global.$UTILS = $UTILS = utils
  return $UTILS
})