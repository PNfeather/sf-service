import storage from '@/tools/storage';
const template = {
  state: {
    resourceChoiceList: [],
    currentChooseImg: storage.get('currentChooseImg') || {},
    currentImageAdjustRotate: 0, // 图片调整时，当前旋转角度
    currentEditTemplate: storage.get('currentEditTemplate') || {},
    checkedQuestionList: [],
    questionScoreCatch: [],
    isMergeSort: {},
    defaultTemplateSortNum: storage.get('defaultTemplateSortNum') || '', // 模板默认页号
    templateHeight: 1166, // 模板宽
    templateWidth: 760, // 模板高
    markerAreaWidth: 300, // 识别区默认宽
    markerAreaHeight: 100, // 识别去默认高
    imgScale: 1.5 // 图片相对模板缩放比例
  },

  mutations: {
    SET_RESOURCECHOICELIST: (state, data) => {
      state.resourceChoiceList = data;
    },
    SET_CURRENTCHOOSEIMG: (state, data) => {
      state.currentChooseImg = data;
    },
    SET_CURRENTIMAGEADJUSTROTATE: (state, data) => {
      state.currentImageAdjustRotate = data;
    },
    SET_CURRENTEDITTEMPLATE: (state, data) => {
      state.currentEditTemplate = data;
    },
    SET_CHECKEDQUESTIONLIST: (state, data) => {
      state.checkedQuestionList = data;
    },
    SET_QUESTIONSCORECATCH: (state, data) => {
      state.questionScoreCatch = data;
    },
    SET_DEFAULTTEMPLATESORTNUM: (state, data) => {
      state.defaultTemplateSortNum = data;
    },
    SET_ISMERGESORT: (state, data) => {
      state.isMergeSort = data;
    }
  },

  actions: {
    changeResourceChoiceList ({ commit }, data) {
      commit('SET_RESOURCECHOICELIST', data);
    },
    passChooseImg ({ commit }, data) {
      storage.set('currentChooseImg', data);
      commit('SET_CURRENTCHOOSEIMG', data);
    },
    changeCurrentImageAdjustRotate ({ commit }, data) {
      commit('SET_CURRENTIMAGEADJUSTROTATE', data);
    },
    passTemplate ({ commit }, data) {
      storage.set('currentEditTemplate', data);
      commit('SET_CURRENTEDITTEMPLATE', data);
    },
    changeCheckedQuestionList ({ commit }, data) {
      commit('SET_CHECKEDQUESTIONLIST', data);
    },
    changeQuestionScoreCatch ({ commit }, data) {
      commit('SET_QUESTIONSCORECATCH', data);
    },
    changeDefaultTemplateSortNum ({ commit }, data) {
      storage.set('defaultTemplateSortNum', data);
      commit('SET_DEFAULTTEMPLATESORTNUM', data);
    },
    changeIsMergeSort ({ commit }, data) {
      commit('SET_ISMERGESORT', data);
    }
  }
};

export default template;
