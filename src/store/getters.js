const getters = {
  userInfo: state => state.user.userInfo,
  serviceList: state => state.user.serviceList,
  currentChooseImg: state => state.template.currentChooseImg,
  currentEditTemplate: state => state.template.currentEditTemplate,
  checkedQuestionList: state => state.template.checkedQuestionList,
  questionScoreCatch: state => state.template.questionScoreCatch,
  templateHeight: state => state.template.templateHeight,
  templateWidth: state => state.template.templateWidth,
  imgScale: state => state.template.imgScale,
  lastActive: state => state.manage.lastActive
};
export default getters;
