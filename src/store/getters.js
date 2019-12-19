const getters = {
  userInfo: state => state.user.userInfo,
  serviceList: state => state.user.serviceList,
  resourceChoiceList: state => state.template.resourceChoiceList,
  currentChooseImg: state => state.template.currentChooseImg,
  currentImageAdjustRotate: state => state.template.currentImageAdjustRotate,
  currentEditTemplate: state => state.template.currentEditTemplate,
  checkedQuestionList: state => state.template.checkedQuestionList,
  questionScoreCatch: state => state.template.questionScoreCatch,
  templateHeight: state => state.template.templateHeight,
  templateWidth: state => state.template.templateWidth,
  markerAreaWidth: state => state.template.markerAreaWidth,
  markerAreaHeight: state => state.template.markerAreaHeight,
  imgScale: state => state.template.imgScale,
  lastActive: state => state.manage.lastActive,
  defaultTemplateSortNum: state => state.template.defaultTemplateSortNum,
  isMergeSort: state => state.template.isMergeSort
};
export default getters;
