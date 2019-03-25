/**
 * 教育培训相关接口
 */
module.exports = [
  // 获取老师信息以及第一页的课程列表信息
  ['GET', '/edu/getTeacherInfo.json', 'edu.TeacherFacadeController', 'getTeacherInfoJson'],
  ['GET', '/edu/loadMoreCourse.json', 'edu.TeacherFacadeController', 'loadMoreCourseJson'],
];
