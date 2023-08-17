// 前端生成GUID  chenlj3
/* eslint-disable */
function newGuid() {
  var s = [],
   hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';
  var uuid = s.join('');
  return uuid;
}
// 获取当前时间   可传递datefmt参数  返回指定格式的时间  chenlj3
function nowDate(datefmt) {
  var date = new Date();
  return date.pattern(datefmt || 'yyyy-MM-dd hh:mm:ss');
}
// 将时间数据转换成指定格式返回  chenlj3
function dateTimeFormatter(val, datefmt) {
  if (val == null || val == '') {
  return '';
  }
  var date = new Date(val);
  return date.pattern(datefmt || 'yyyy-MM-dd HH:mm:ss');
}
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.toMSJSON = function () {
  // eslint-disable-next-line
  var date = '\/Date(' + this.getTime() + ')\/';
  return date;
};

Date.prototype.pattern = function (fmt) {
  if (fmt == undefined) {
    return '';
  }
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours() / 12 > 1 ? 12 + (this.getHours() % 12 == 0 ? 12 : this.getHours() % 12) : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds() //毫秒
  },
   week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, String(this.getFullYear()).substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468' : '') + week[String(this.getDay())]);
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
    }
  }
  return fmt;
};
function getCode() {
  return "PlatForm" + Math.random().toString().substr(3, 2) + S4() + S4();
}
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function isJSON(str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}
export  default {
  newGuid,// 生成uuid
  nowDate,// 获取当前时间 默认格式yyyy-MM-dd hh:mm:ss
  dateTimeFormatter,// 时间转换成指定格式 默认yyyy-MM-dd hh:mm:ss
  getCode,
  isJSON
};
