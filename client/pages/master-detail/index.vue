<template>
  <div>
    <div class="master-info">
      <div class="avatar-container pos-center">
        <img v-if="avatar" :src="avatar | formatImage" width="70" height="70">
      </div>
      <div class="master-info-baseInfo pos-center">
        <div class="master-info-name">{{ masterName }}</div>
        <div v-if="title" class="master-info-title">{{ title }}</div>
      </div>
      <div :class="['master-info-des', isOverWrite && clipDes ? 'master-info-des-clip' : '' ]">
        {{ description }}
        <template v-if="isOverWrite">
          <div class="master-info-des-more" v-if="clipDes"  @click="toggleMoreOrHide">...更多</div>
          <div class="master-info-des-hide" v-else @click="toggleMoreOrHide">收起</div>
        </template>
      </div>
    </div>
    <course-list v-if="courseList.length > 0" :sourceData="courseList" />
    <div v-if="pageable" class="master-info-load-more" @click="loadMore">点击加载更多</div>
  </div>
</template>
<script>
// import { Toast } from 'vant';
// import { setShareData } from '@youzan/wxsdk';
import masterDetailStoreModule from '@client/store/modules/master-detail';
import titleMixin from '@client/mixin/title-mixin';
import { get, fullfillImage } from '@client/utils';
import CourseList from './components/course-list.vue';
import axios from 'axios';

export default {
  name: 'master-detail',
  mixins: [titleMixin],
  components: {
    [CourseList.name]: CourseList
  },
  title () {
    return '老师主页';
  },
  asyncData ({ store, url }) {
    // 注意写法
    return this.methods.dispatch(store, url);
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed () {
    this.$store.unregisterModule('masterDetail')
  },
  data() {
    return {
      avatar: null,
      masterName: null,
      title: null,
      description: null,
      isOverWrite: false,
      clipDes: false,
      courseList: [],
      pageNumber: 1,
      pageable: false,
      teacherId: null,
      teacherInfo: {},
      courseInfo: {}
    };
  },
  created() {
    this.getState();
  },
  mounted() {
    // 降级处理
    if (!window.__INITIAL_STATE__) {
      this.dispatch(this.$store, location.href).then(() => {
        this.getState();
      });
    }
    // wxsdk中有window对象，因此需要在mounted的时候动态import
    import('@youzan/wxsdk').then(res => {
      this.setShareConfig(res.setShareData);
    })
  },
  methods: {
    dispatch(store, url) {
      const teacherId = get('teacherId', url);
      store.registerModule('masterDetail', masterDetailStoreModule);
      return Promise.all([
        store.dispatch('masterDetail/getTeacherInfo', { teacherId }),
        store.dispatch('masterDetail/getCourseList', { teacherId, pageNumber: 1 })
      ]);
    },
    getState() {
      if (this.$store.state.masterDetail) {
        this.teacherInfo = this.$store.state.masterDetail.teacherInfo;
        this.courseInfo = this.$store.state.masterDetail.courseInfo;
        this.parseTeacherInfo();
        this.parseCourseInfo();
      }
    },
    // 处理老师信息
    parseTeacherInfo() {
      const { duty, description, icon, teacherName, staffName, pageable, list } = this.teacherInfo;
      this.avatar = icon;
      this.masterName = teacherName || staffName;
      this.title = duty;
      this.description = description;
      this.pageable = pageable;
      if (list) this.courseList = list;
    },
    // 处理课程信息
    parseCourseInfo() {
      const { list, pageable } = this.courseInfo;
      this.courseList = this.courseList.concat(list);
      this.pageable = pageable;
    },
    // 显示更多
    toggleMoreOrHide() {
      this.clipDes = !this.clipDes;
    },
    // 点击加载更多
    getCourseList() {
      let opts = {
        method: 'GET',
        url: 'http://127.0.0.1:8201/edu/loadMoreCourse.json',
        timeout: 5000,
        params: {
          kdtId: 42095703
        }
      };
      return axios(opts);
    },
    loadMore() {
      console.log(234);
      this.pageNumber += 1;
      this.getCourseList()
        .then((res) => {
          if (res.data && res.data.code === 0) {
            this.courseInfo = res.data.data;
            const { list, pageable } = this.courseInfo;
            this.courseList = this.courseList.concat(list);
            this.pageable = pageable;
          }
        });
    },
    // 设置分享
    setShareConfig(setShareData) {
      setShareData({
        notShare: false,
        // link: window.location.href,
        desc: this.description || '',
        title: `你的好友将${this.masterName}老师分享给你`,
        cover: this.avatar
      });
    },
  },
  filters: {
    formatImage: function(src, ext) {
      return fullfillImage(src, ext || '!140x140.jpg');
    },
  },
};
</script>
<style lang="scss" scoped>
.master-info {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
}

.pos-center {
  align-self: center;
}

.avatar-container {
  height: 70px;
  width: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px 0;
  background-color: #f8f8f9;
}

.master-info-baseInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #969696;
}

.master-info-name {
  font-size: 20px;
  line-height: 24px;
  color: #111;
  margin-bottom: 5px;
  font-weight: 600;
}

.master-info-title {
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 15px;
}

.master-info-des,
.master-info-des-more,
.master-info-des-hide {
  font-size: 13px;
  line-height: 1.5;
}

.master-info-des {
  text-align: center;
  position: relative;
  margin: 0 20px;
  color: #969696;
  width: inherit;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
}

.master-info-des-clip {
  height: 58.5px;
  overflow: hidden;
}

.master-info-des-more {
  position: absolute;
  bottom: 2px;
  right: 0;
  color: #1989fa;
  background-color: #fff;
}

.master-info-des-hide {
  position: relative;
  width: 100%;
  text-align: center;
  color: #1989fa;
}

.master-info-load-more {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #898989;
  font-size: 14px;
}
</style>


