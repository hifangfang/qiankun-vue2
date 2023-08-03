import FtPagination from "./index.vue";

FtPagination.install = function (Vue) {
  Vue.component(FtPagination.name, FtPagination);
};

export default FtPagination;