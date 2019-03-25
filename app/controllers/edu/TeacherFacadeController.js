const BaseController = require('./EduBaseController');
const TeacherFacadeService = require('../../services/edu/TeacherFacadeService');

class TeacherFacadeController extends BaseController {
  /**
   * 获取老师的资料以及老师的课程列表
   * @param {object} ctx
   * @param {number} ctx.query.teacherId 老师id，需要根据老师id来查询其相关信息
   * @memberof TeacherFacadeController
   */
  async getTeacherInfoJson(ctx) {
    const { query, kdtId } = ctx;
    const { teacherId } = query;
    const payload = {
      kdtId,
      teacherIds: [Number(teacherId)]
    };

    // 老师信息
    const info = await new TeacherFacadeService(ctx).getTeacherInfo(payload);
    ctx.json(0, 'ok', info[0]);
  }

  /**
   * 获得更多的该教师的课程列表
   * @param {object} ctx
   * @param {number} ctx.query.teacherId 老师的id信息
   * @param {number} ctx.query.pageNumber 请求的页数
   * @memberof TeacherFacadeController
   */
  async loadMoreCourseJson(ctx) {
    const { query, kdtId } = ctx;
    const { teacherId, pageNumber } = query;

    const response = await new TeacherFacadeService(ctx).listCourseByTeacherId([
      {
        kdtId,
        teacherId: Number(teacherId),
      },
      {
        pageNumber: Number(pageNumber),
        pageSize: 20,
        sort: null,
      },
    ]);

    const list = (response && response.content) || [];
    const pageable = true;

    ctx.json(0, 'ok', { list, pageable });
  }
}

module.exports = TeacherFacadeController;
