<template>
  <div class="panel_check">
<!--    <el-scrollbar style="height: 100%; width:100%;overflow-x: hidden;">-->
<!--      <img src="../../assets/images/logo.png" alt="ems" style="margin-bottom: 50px;">-->
    <div class="panel_margin">
      <div class="news_head">
        小区新闻
      </div>
      <el-row>
        <el-col :span="4">
          <el-menu
              default-active="1"
              class="el-menu-vertical-demo">
            <el-menu-item index="1">
              <i class="el-icon-location"></i>
              <span>小区动态</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">近期新闻</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span slot="title">重要通知</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">设施使用</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="20">
        <!--一个消息，使用ｖ－for-->
          <div class="news_container">
            <div v-for="(notice, i) in notices" :key="i" >
              <el-divider></el-divider>
              <div style="display: flex;">
                <div class="time_head">
                  <div style="font-size: 50px;margin: 5px 0px 0px 5px">{{notice.date}}</div>
                  <div style="bottom: 0px;float: right;font-size: 18px; margin-top: 13px">{{notice.time}}</div>
                </div>
                <div class="news_content">
                  <div style="font-weight: bold;margin-bottom: 10px">{{notice.title}}</div>
                  <div>{{notice.content}}</div>
                </div>
              </div>
              <div style="text-align: right">
                <el-button style="margin-top: 20px;" type="primary">查看详情</el-button>
              </div>
            </div>
            <el-divider></el-divider>
          </div>
        </el-col>
      </el-row>
    </div>
<!--      <el-row>-->
<!--        <el-col :span="8" v-for="(notice, i) in notices" :key="i" :offset="3" style="margin-bottom: 40px">-->
<!--          <el-card :body-style="{ padding: '0px' }">-->
<!--            <div slot="header" class="clearfix">-->
<!--              <span>{{notice.title}}</span>-->
<!--              <p>-->
<!--                <span style="margin-right: 10px;">{{notice.people}}</span>-->
<!--                <span>{{notice.time}}</span>-->
<!--              </p>-->
<!--            </div>-->
<!--            <div style="padding: 14px;">-->
<!--              {{notice.content}}-->
<!--            </div>-->
<!--          </el-card>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-scrollbar>-->
  </div>
</template>

<script>
  // import PanelTitle from '../../components/PanelTitle'

  import {getNoticeAllInfo} from "@/views/resident/api";

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
        }
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
      //获取所有消息
      onGetNotice() {
        this.$http.get(this.formatString(this.$store.state.url.notice.allInfo, {
          time: this.searchTime,
          name: this.searchName
        })).then((res) => {
          this.notices = res.data
          let temp=""
          for (let i=0;i<this.notices.length;i++){
            this.notices[i].date = this.notices[i].time.slice(-2)
            temp = this.notices[i].time.slice(0,8)
            temp = temp.replace(/-/,"年")
            temp = temp.replace(/-/,"月")
            this.notices[i].time = temp
          }
          console.log(this.notices.length)
          console.log(this.notices)
        })
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
    margin-left: 20px;
  }
</style>
