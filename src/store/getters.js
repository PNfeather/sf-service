const getters = {
  userInfo: state => state.user.userInfo,
  serviceList: state => state.user.serviceList,
  imgBaseUrl: state => state.user.imgBaseUrl,
  currentChooseImg: state => state.template.currentChooseImg,
  currentEditTemplate: state => state.template.currentEditTemplate,
  checkedQuestionList: state => state.template.checkedQuestionList,
  questionScoreCatch: state => state.template.questionScoreCatch
};
export default getters;
