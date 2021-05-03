<template>
  <div class="panel_check">
<!--    <el-scrollbar style="height: 100%; width:100%;overflow-x: hidden;">-->
<!--      <img src="../../assets/images/logo.png" alt="ems" style="margin-bottom: 50px;">-->
    <div class="news_head">
      小区新闻
    </div>
    <el-row style="min-height: 800px">
      <el-col :span="4">
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="changeStatus('communityDynamic')">
            <i class="el-icon-location"></i>
            <span>小区动态</span>
          </el-menu-item>
          <el-menu-item index="2" @click="changeStatus('latestNews')">
            <i class="el-icon-menu"></i>
            <span slot="title">近期新闻</span>
          </el-menu-item>
          <el-menu-item index="3" @click="changeStatus('importantNotice')">
            <i class="el-icon-document"></i>
            <span slot="title">重要通知</span>
          </el-menu-item>
          <el-menu-item index="4" @click="changeStatus('facilityUse')">
            <i class="el-icon-setting"></i>
            <span slot="title">设施使用</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
      <!--一个消息，使用ｖ－for-->
        <div class="news_container">
          <div v-for="(notice, index) in notices" :key="index" >
            <el-divider></el-divider>
            <div style="display: flex;">
              <div class="time_head">
                <div style="font-size: 50px;margin: 5px 0px 0px 5px">{{notice.date}}</div>
                <div style="bottom: 0px;float: right;font-size: 18px; margin-top: 13px;margin-right: 3px">{{notice.time}}</div>
              </div>
              <div class="news_content">
                <div style="font-weight: bold;margin-bottom: 10px">{{notice.title}}</div>
                <div>{{notice.content}}</div>
              </div>
            </div>
            <div style="text-align: right">
              <el-button style="margin-top: 20px;" type="primary" @click="onGetDetail(notice.id)">查看详情</el-button>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
        <div class="block" style="bottom: 0;position:absolute;width: 80%">
          <div style="display: flex;justify-content: center;margin-bottom:30px ">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "NoticeCheck",
    data() {
      return {
        searchName:'',
        searchTime:'',
        notices:{},
        usr:{
          resident_id:'',
          name:'',
        },
        currentPage:1,
        pageSize:10,
        totalCount:0,
        type:'communityDynamic'
      }
    },
    components: {
    },
    created() {
      this.onGetNotice()
      this.onGetUsr()
    },
    methods: {
      onRefresh() {
        this.onGetNotice();
        this.onGetUsr();
      },
      onGetUsr() {
        this.$http.get(this.formatString(this.$store.state.url.resident.usr, {
          tele: this.$store.state.auth.user
        })).then(({data: usr}) => {
          this.usr = usr
          this.$store.commit('setId', this.usr.resident_id);
        })
      },
      changeStatus(type) {
        this.type = type
        this.onRefresh()
      },
      //获取所有消息
      onGetNotice() {
        let body={
          name: this.searchName,
          pageSize:this.pageSize,
          currentPage:this.currentPage,
          type:this.type
        }
        this.$http.post(this.$store.state.url.notice.allInfo, body).then((res) => {
          this.notices = res.data.noticeInfo
          this.totalCount = res.data.totalNum
          let temp=""
          for (let i=0;i<this.notices.length;i++){
            //总时间点
            this.notices[i].time = this.getChangedDate(this.notices[i].time).slice(0,10)
            this.notices[i].date = this.notices[i].time.slice(5,7)
          }
          console.log(this.notices)
        })
      },
      //获取消息的详细信息并展示
      onGetDetail(noticeId){
        this.$router.push({name:'NoticeDetail',params:{noticeId:noticeId}})
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
      handleSizeChange(val) {
        this.pageSize=val
        this.onRefresh()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.onRefresh()
      },
    }
  }
</script>

<style scoped>

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .panel_margin{
    background-color: #FFFFFF;
    margin: 0 40px 0 40px;
  }
  .news_container{
    margin:0 20px 0 20px;
  }
  .time_head{
    background-color: #67C23A;
    height: 100px;
    width: 100px;
    color: white;
  }
  .news_head{
    font-size: 30px;
    font-weight: bold;
    text-align: left;
    padding: 20px 0 10px 60px;
  }
  .news_content{
    margin-left: 30px;
    width: 70%;
  }
</style>
