import watermark from './watermark-dom.js';
import _ from "lodash";

export class WaterMarkService {
  private static _exist = false;

  private static _loading = false;

  private static _text = '';

  private static shouldRemove = false;

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
      this.create('水印内容');
    } catch (e) {

    } finally {
      this._loading = false;
    }
  }

  static create(text: string, forceRefresh = false) {
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

    window.addEventListener('resize', this.onReSize)
    this._text = text;
    this._exist = true;
  }

  static remove() {
    if (this.exist) {
      watermark.remove();
      window.removeEventListener('resize', this.onReSize)
      this._text = '';
      this._exist = false;
    } else if (this.loading) {
      this.shouldRemove = true;
    }
  }

  static onReSize = _.throttle(() => {
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
  }, 1000)

}