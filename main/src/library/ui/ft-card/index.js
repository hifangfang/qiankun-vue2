import FtCard from "./index.vue";

FtCard.install = function (Vue) {
  Vue.component(FtContainer.name, FtCard);
};

export default FtCard;
