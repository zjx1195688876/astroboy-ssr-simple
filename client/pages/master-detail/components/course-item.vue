<template>
  <div class="course-item-container" @click="pathToCourse">
    <div class="course-item-headImg">
      <div class="img-box">
        <vis-tag
          v-if="tagText"
          size="mini"
          extend-class="vis-tag-theme vis-tab-position-absolute">
          {{ tagText }}
        </vis-tag>
        <img
          v-if="headImg"
          :src="headImg | formatImage"
          alt="课程头图">
        <!-- <van-icon
          v-else
          name="photo"
          size="40px"
          color="#888"
        /> -->
      </div>
    </div>
    <div class="course-item-info">
      <div class="course-item-text course-item-title">
        {{ title }}
      </div>
      <div v-if="learntNum" class="course-item-text course-item-learnt">
        {{ totalNum }}人学过
      </div>
    </div>
  </div>
</template>
<script>
// import { Icon } from 'vant';
import { formatSalesNum } from '../utils';
import { fullfillImage } from '@client/utils';
import Tag from '@client/components/tag.vue';

export default {
  name: 'course-item',
  components: {
    // 'van-icon': Icon,
    'vis-tag': Tag,
  },
  props: {
    alias: String,
    id: Number,
    headImg: String,
    title: String,
    learntNum: Number,
    coursePrice: Number,
    shortenUrl: String,
    courseType: {
      type: Number,
      default: 2,
    },
  },
  serverCacheKey: props => props.id,
  computed: {
    parsePrice: function() {
      const { coursePrice } = this;
      if (coursePrice === 0) return '免费';
      if (coursePrice) return `￥${(coursePrice / 100).toFixed(2)}`;
      return '-';
    },
    totalNum() {
      return formatSalesNum(this.learntNum);
    },
    tagText() {
      const arr = ['体验课', '正式课', ''];
      return arr[this.courseType];
    },
  },
  methods: {
    pathToCourse: function() {
      // window.location = this.shortenUrl;
    },
  },
  filters: {
    formatImage: function(src, ext) {
      return fullfillImage(src, ext || '!200x0.jpg');
    },
  },
};
</script>
<style lang="scss" scoped>
.course-item-container {
  display: flex;
  height: 67px;
  margin: 10px 0;
}

.course-item-headImg {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: inherit;
  padding: 5px 0;
  box-sizing: border-box;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;

  .img-box {
    position: relative;
    width: 100%;
    height: inherit;
    text-align: center;
    & > img {
      display: inline-block;
      width: auto;
      height: inherit;
    }
  }

  .vis-tab-position-absolute {
    position: absolute;
    right: 2px;
    bottom: 5px;
  }
}

.course-item-info {
  margin-left: 10px;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.course-item-text {
  font-size: 14px;
  line-height: 1.5;
  color: #111;
  text-align: left;
  word-break: break-all;
}

.course-item-title {
  height: 42px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-item-learnt {
  color: #969696;
  font-size: 10px;
}

.course-item-price {
  color: #f44;
  font-size: 14px;
  line-height: 1.5;
  padding-top: 5px;
  padding-right: 5px;
  padding-left: 10px;
  text-align: center;
}
</style>

