<template>
  <div class="panel_check" style="min-height: 800px">
    <div class="noticeContainer">
      <div class="routePath">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item style="font-weight: lighter;color: #999999" :to="{ path: '/notice/check' }">消息管理</el-breadcrumb-item>
          <el-breadcrumb-item><a style="font-weight: bold">消息详情</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="noticeTitle">{{noticeData.title}}</div>
      <div class="adminName">
        <span>报道人：</span>{{noticeData.adminName}}
      </div>
      <div class="dateTime">{{noticeData.time}}</div>
      <div class="abstract">{{noticeData.abstracts}}</div>
      <div class="content" v-html="noticeData.content">{{noticeData.content}}</div>
    </div>
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
      this.noticeId = this.$route.query.noticeId
      this.$http.get(this.formatString(this.$store.state.url.notice.detail,{
        id: this.noticeId
      })).then(({data: notice})=>{
        notice.time = this.getChangedDate(notice.time)
        this.noticeData = notice;
      })
    },
    //这个是转换时间戳和时间日期之间的
    add0(m){return m<10?'0'+m:m },
    getChangedDate(timeStamp){
      if (timeStamp){
        var time = new Date(timeStamp);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s)
      }
    },
  }
}
</script>

<style scoped>
.noticeContainer{
  margin: 30px 150px 20px 150px;
}
.routePath{
  margin: 0 0 20px 0;
}
.noticeTitle{
  font-size: 30px;
  margin: 0 0 10px 0;
}
.adminName{
  margin: 0 0 10px 10px;
  color: #999999;
}

.dateTime{
  margin: 0 0 0 10px;
  color: #999999;
}
.abstract{
  margin: 20px 0 40px 0;
  font-style: italic;
}
</style>
