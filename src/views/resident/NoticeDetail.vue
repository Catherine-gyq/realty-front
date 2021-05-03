<template>
  <div>
    <div class="routePath"></div>
    <div class="title"></div>
    <div class="dateTime"></div>
<!--    摘要展示-->
    <div class="Abstract"></div>
<!--    文章内容-->
    <div class="content"></div>
  </div>
</template>

<script>
export default {
  name: "NoticeDetail",
  created() {
    this.getNoticeDetail();
  },
  methods:{
    //传递过来的
    getNoticeDetail(){

    }
  }
}
</script>

<style scoped>

</style>
