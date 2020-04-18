<template>
  <div class="richText">
    <!-- 富文本编辑{{ msg }} -->
    1111
    <A :logo="msg" />
  </div>
</template>

<script>
import A from "../Index/demo04";
export default {
  components: {A},
  data() {
    return {
      msg: "父组件"
    }
  }
};
</script>

<style lang="less" scoped>
.richText {
  height: 100%;
}
</style>