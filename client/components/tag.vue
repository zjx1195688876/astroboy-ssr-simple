<template>
  <span
    class="vis-tag"
    :class="extendClass"
    :style="style">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'tag',

  props: {
    extendClass: {
      type: String,
      default: '',
    },
    extendStyle: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'standard',
    },
    color: {
      type: String,
      default: '',
    },
  },

  computed: {
    style() {
      let style = '';
      if (this.size && this.size === 'mini') {
        style += 'height: 16px; line-height: 11px; font-size: 10px;';
      }
      if (this.color) {
        style += `background-color: ${this.color};`;
      }

      return style;
    },
  },
};
</script>

<style lang="scss" scoped>
.vis-tag {
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  margin-right: 3px;
  padding: 3px;
  line-height: 1;
  font-size: 12px;
  color: #fff;
  border-radius: 2px;
  background-color: #f44;
}
</style>

