const getters = {
  userInfo: state => state.user.userInfo,
  serviceList: state => state.user.serviceList,
  currentEditTemplate: state => state.template.currentEditTemplate
};
export default getters;
