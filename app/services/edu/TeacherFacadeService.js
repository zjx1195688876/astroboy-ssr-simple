const EduBaseService = require('./EduBaseService');

class TeacherFacadeService extends EduBaseService {
  get COURSER_TEACHERFACADE_SERVICES() {
    return 'com.youzan.owl.edu.api.course.TeacherFacade';
  }

  // 获取教师信息
  async getTeacherInfo(payload) {
    const result = await this.invoke(this.COURSER_TEACHERFACADE_SERVICES, 'listTeacher', [payload]);
    return result;
  }

  // 根据id获取教师的课程列表
  async listCourseByTeacherId(payload) {
    const result = await this.invoke(this.COURSER_TEACHERFACADE_SERVICES, 'listCourseByTeacherId', payload);
    return result;
  }
}

module.exports = TeacherFacadeService;
