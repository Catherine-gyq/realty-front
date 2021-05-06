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
  data(){
    return{
      noticeId:'',
      noticeData:{}
    }
  },
  created() {
    this.getNoticeDetail();
  },
  methods:{
    //传递过来的
    getNoticeDetail(){
      this.noticeId = this.$route.params.noticeId
      this.$http.get(this.formatString(this.$store.state.url.notice.detail,{
        id: this.noticeId
      })).then(({data: notice})=>{
        notice.time = this.getChangedDate(notice.time)
        this.noticeData = notice;
      })
    }
  }
}
</script>

<style scoped>

</style>
