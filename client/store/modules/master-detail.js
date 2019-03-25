import axios from 'axios';

// const origin = 'http://h5-ssr.youzan.com';
const origin = 'http://127.0.0.1:8201';

const getTeacher = (data) => {
  let opts = {
    method: 'GET',
    url: `${origin}/edu/getTeacherInfo.json`,
    timeout: 5000
  };
  return axios(opts);
};

const loadMoreCourse = (data) => {
  let opts = {
    method: 'GET',
    url: `${origin}/edu/loadMoreCourse.json`,
    timeout: 5000,
    params: Object.assign(data, {
      kdtId: 42095703
    })
  };
  return axios(opts);
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
      return getTeacher(data)
        .then(res => {
          if (res.data && res.data.code === 0) {
            commit('GET_TEACHER_INFO', res.data.data)
          }
        })
    },
    getCourseList ({ commit }, data = {}) {
      return loadMoreCourse(data)
        .then(res => {
          if (res.data && res.data.code === 0) {
            commit('GET_COURSE_LIST', res.data.data)
          }
      })
    }
    // getTeacherInfo ({ commit }, data = {}) {
    //   return getTeacher(data)
    //     .then(res => {
    //       if (res) {
    //         commit('GET_TEACHER_INFO', res)
    //       }
    //     })
    // },
    // getCourseList ({ commit }, data = {}) {
    //   return loadMoreCourse(data)
    //     .then(res => {
    //       if (res) {
    //         commit('GET_COURSE_LIST', res)
    //       }
    //   })
    // }
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