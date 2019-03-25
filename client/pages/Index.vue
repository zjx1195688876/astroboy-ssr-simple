<template>
  <div>首页</div>
</template>

<script>
import titleMixin from '@client/mixin/title-mixin';

export default {
  mixins: [titleMixin],
  title () {
    return '首页';
  }
}
</script>
