import watermark from "./watermark-dom.js";
export class WaterMarkService {
  static _exist = false;

  static _loading = false;

  static _text = "";

  static shouldRemove = false;

  static get loading() {
    return this._loading;
  }

  static get exist() {
    return this._exist;
  }

  static async loadDefault() {
    if (this._loading) return;
    try {
      this._loading = true;
      this.create("水印内容");
      // eslint-disable-next-line no-empty
    } catch (e) {
    } finally {
      this._loading = false;
    }
  }

  static create(text, forceRefresh = false) {
    //shentx 水印显示时间改动：不再获取登陆时间 显示最新时间
    let currentTime = getCurrTime();
    let reg = /[\d]{4}[\/-]{1}[\d]{1,2}[\/-]{1}[\d]{1,2}\s[\d]{1,2}[:][\d]{1,2}[:][\d]{1,2}/g;
    text = JSON.parse(JSON.stringify(text).replace(reg, currentTime));
    if (this.shouldRemove) {
      this.shouldRemove = false;
      this._exist = false;
      return;
    }
    if (this.exist && !forceRefresh) return;
    watermark.load({
      watermark_txt: text,

      watermark_x_space: 100,
      watermark_y_space: 80,
      watermark_alpha: 0.1,
      watermark_width: 200,
      monitor: false,
      watermark_height: 150,
    });

    window.addEventListener("resize", this.onReSize);
    this._text = text;
    this._exist = true;
  }

  static remove() {
    if (this.exist) {
      watermark.remove();
      window.removeEventListener("resize", this.onReSize);
      this._text = "";
      this._exist = false;
    } else if (this.loading) {
      this.shouldRemove = true;
    }
  }

  static onReSize = throttle(() => {
    if (WaterMarkService._exist) {
      const text = WaterMarkService._text;
      watermark.remove();
      watermark.load({
        watermark_txt: text,
        watermark_x_space: 100,
        watermark_y_space: 80,
        watermark_alpha: 0.1,
        watermark_width: 200,
        monitor: false,
        watermark_height: 150,
      });
    }
  }, 1000);
}
function getCurrTime() {
  var myDate = new Date();
  var year = myDate.getFullYear(); //获取当前年
  var mon = myDate.getMonth() + 1; //获取当前月
  var date = myDate.getDate(); //获取当前日
  var hours = myDate.getHours(); //获取当前小时
  var minutes = myDate.getMinutes(); //获取当前分钟
  var seconds = myDate.getSeconds(); //获取当前秒
  // 以自己需要的方式拼接
  var now =
    year +
    "-" +
    getZero(mon) +
    "-" +
    getZero(date) +
    " " +
    getZero(hours) +
    ":" +
    getZero(minutes) +
    ":" +
    getZero(seconds);
  return now;
}
//个位数补0
function getZero(num) {
  // 单数前面加0
  if (parseInt(num) < 10) {
    num = "0" + num;
  }
  return num;
}
//节流
function throttle(fn, t) {
  let timer;
  return function () {
    if (!timer) {
      timer = setTimeout(function () {
        fn();
        // 清空定时器
        timer = null;
      }, t);
    }
  };
}
export default WaterMarkService;
