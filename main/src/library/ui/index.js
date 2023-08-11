
import FtContainer from "./ft-container/";
import FtContextmenu from "./ft-contextmenu/";
import FtTable from "./ft-table/";
import FtScroll from "./ft-scroll/";
import FtFadein from "./ft-fadein/";
import FtTableReport from "./ft-table-report/";
import FtInput from "./ft-input/";
import FtVatable from "./ft-vatable/";
import FtPagination from "./pagination/";
const components = [FtContainer, FtContextmenu, FtTable, FtScroll, FtFadein, FtTableReport, FtInput, FtVatable,FtPagination];


const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  FtContainer,
  FtContextmenu,
  FtTable,
  FtScroll,
  FtFadein,
  FtTableReport,
  FtInput,
  FtVatable,
  FtPagination
};