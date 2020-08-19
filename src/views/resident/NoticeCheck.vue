<template>
  <div class="panel_check">
    <el-scrollbar style="height: 100%; width:100%;overflow-x: hidden;">
      <img src="../../assets/images/logo.png" alt="ems" style="margin-bottom: 50px;">
      <el-row>
        <el-col :span="8" v-for="(notice, i) in notices" :key="i" :offset="3" style="margin-bottom: 40px">
          <el-card :body-style="{ padding: '0px' }">
            <div slot="header" class="clearfix">
              <span>{{notice.title}}</span>
              <p>
                <span style="margin-right: 10px;">{{notice.people}}</span>
                <span>{{notice.time}}</span>
              </p>
            </div>
            <div style="padding: 14px;">
              {{notice.content}}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
  // import PanelTitle from '../../components/PanelTitle'

  export default {
    name: "NoticeCheck",
    data() {
      return {
        // url: '../../assets/images/logo.png',
        searchName:'',
        searchTime:'',
        notices:{}
      }
    },
    components: {
      // PanelTitle,
    },
    created() {
      this.onGetNotice()
    },
    methods:{
      onRefresh()
      {
        this.onGetNotice()
      },
      //获取所有消息
      onGetNotice()
      {
        this.$http.get(this.formatString(this.$store.state.url.notice.allInfo,{
          time: this.searchTime,
          name: this.searchName
        })).then(({data: notices}) => {
          this.notices = notices
        })
      }
    }
  }
</script>

<style scoped>

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

</style>
