import _ajax from 'captain-ajax';

const baseUrl = 'https://h5-ssr.youzan.com';

// const { kdt_id: kdtId } = window._global;

// 对ajax进行包裹
function ajax(options) {
  const { url, method, data } = options;
  return _ajax({
    method,
    data,
    withCredentials: true,
    url: options.absolutePath ? url : `${baseUrl}${url}`
  });
}

const getTeacherInfo = (data) => {
  return ajax({
    url: '/edu/getTeacherInfo.json',
    method: 'GET',
    data: Object.assign(data, {
      kdtId: 42095703,
      test: 111
    })
  });
};

const loadMoreCourse = (data) => {
  return ajax({
    url: '/edu/loadMoreCourse.json',
    method: 'GET',
    data: Object.assign(data, {
      kdtId: 42095703
    })
  });
};

export default {
  namespaced: true,
  // 要注意, state 一定要用函数返回值来初始化 state, 不然会导致所有用户共用 state
  state: () => ({
    teacherInfo: {},
    courseInfo: {}
  }),
  actions: {
    getTeacherInfo ({ commit }, data = {}) {
      return getTeacherInfo(data)
        .then(({ res }) => {
          console.log('res: ', res);
          if (res) {
            commit('GET_TEACHER_INFO', res)
          }
        })
    },
    getCourseList ({ commit }, data = {}) {
      return loadMoreCourse(data)
        .then(({ res }) => {
        if (res) {
          commit('GET_COURSE_LIST', res)
        }
      })
    }
  },
  mutations: {
    GET_TEACHER_INFO (state, res) {
      state.teacherInfo = res;
    },
    GET_COURSE_LIST (state, res) {
      state.courseInfo = res;
    }
  }
}