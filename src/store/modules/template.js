import storage from '@/tools/storage';
const template = {
  state: {
    currentChooseImg: storage.get('currentChooseImg') || {},
    currentEditTemplate: storage.get('currentEditTemplate') || {},
    checkedQuestionList: [],
    questionScoreCatch: [],
    defaultTemplateSortNum: '', // 模板默认页号
    templateHeight: 1166, // 模板宽
    templateWidth: 760, // 模板高
    imgScale: 1.5 // 图片相对模板缩放比例
  },

  mutations: {
    SET_CURRENTCHOOSEIMG: (state, data) => {
      state.currentChooseImg = data;
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
    }
  },

  actions: {
    passChooseImg ({ commit }, data) {
      storage.set('currentChooseImg', data);
      commit('SET_CURRENTCHOOSEIMG', data);
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
      commit('SET_DEFAULTTEMPLATESORTNUM', data);
    }
  }
};

export default template;
