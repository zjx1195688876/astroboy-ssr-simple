<template>
  <div class="course-list-container">
    <div class="course-list-title">
      课程
    </div>
    <div
      v-for="(item, index) in sourceData"
      :key="index"
      class="course-list-content">
      <course-item
        :id="item.id"
        :alias="item.alias"
        :head-img="item.pictureWrapDTO.url"
        :title="item.title"
        :course-price="item.price"
        :learnt-num="item.totalSoldNum"
        :shorten-url="item.shortenUrl"
        :course-type="item.courseType"
      />
    </div>
  </div>
</template>
<script>
import CourseItem from './course-item.vue';

export default {
  name: 'course-list',
  components: {
    CourseItem,
  },
  props: {
    sourceData: Array,
  }
};
</script>

<style lang="scss" scoped>
.course-list-container {
  padding: 10px;
  background-color: #fff;
  margin-top: 15px;
}

.course-list-title {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  color: #111;
  border: none;
  border-bottom: 1px solid #f2f2f2;
}

.course-list-content {
  display: flex;
  flex-direction: column;
}
</style>

