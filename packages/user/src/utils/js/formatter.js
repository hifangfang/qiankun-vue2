export default {
  //date转年月日
  'DateFormatter': function formatDate(row, column, cellvalue) {
    if ($.isEmptyObject(cellvalue)) {
      return '';
    }
    let date = new Date(cellvalue),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return year + '-' + month + '-' + day;
  },
  //date转年月日时分秒
  'DateTimeFormatter': function formatDateTime(row, column, cellvalue) {
    if ($.isEmptyObject(cellvalue)) {
      return '';
    }
    let date = new Date(cellvalue),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  },
  //时间戳转换年月日时分秒
  'LongTimeFormatter': function formatDateTime(row, column, cellvalue) {
    if (!cellvalue) {
      return '';
    }
    let date = new Date(cellvalue),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  },
  //date转时分秒
  'TimeFormatter': function formatDateTime(row, column, cellvalue) {
    if ($.isEmptyObject(cellvalue)) {
      return '';
    }
    let date = new Date(cellvalue),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  },
  /**
   * int 类型的布尔值渲染
   * @param row
   * @param column
   * @param cellvalue
   * @returns {string}
   * @constructor
   */
  'IntBooleanFormatter': function (row, column, cellvalue) {
    if (cellvalue !== 0 && cellvalue !== 1) {
      return '';
    }
    if (cellvalue === 1) {
      return '是';
    }
    if (cellvalue === 0) {
      return '否';
    }
  },

  /**
   * 流程状态转换中文(对于整个流程)
   */
  'ProcInstStateChange': function (row, column, cellvalue) {
    var data = row;//获取流程结束时间

    if (!data) {
      layer.alert('获取数据失败!', { 'icon': 0 });
    }
    let endTime = data.endTime,
      c = '';

    if (endTime === '' || endTime === null) {
      c = '正在办理';
    } else if (endTime !== '') {
      c = '办理完成';
    }
    return c;
  }


};
