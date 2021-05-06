<template>
    <div>
        <!--页面展示-->
      <div class="panel">
        <panel-title title="社区消息管理"></panel-title>
        <el-radio-group class="typeChoose" v-model="noticeType" @change="searchRadioType">
          <el-radio label="allType">所有状态</el-radio>
          <el-radio v-for="(item,index) in allNoticeType" :key="index"  :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
          <div class="panel-body" style="display: flex;justify-content: space-between">
            <div>
              <el-button @click="onAddNotice" size="small" type="primary">
                添加消息
              </el-button>
              <el-date-picker class="community_input" style="margin-right: 20px" size="small"
                              value-format="yyyy-MM-dd"
                              @change="onRefresh"
                              v-model="timePeriod"
                              type="datetimerange"
                              :picker-options="pickerOptions"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              align="right">
              </el-date-picker>
              <el-input class="community_input" v-model="searchName" placeholder="请输入标题来查询消息" prefix-icon="el-icon-search" size="small" @keyup.enter.native="onRefresh"/>
            </div>
            <el-button size="small" @click="exportExcel" style="float: right;margin-right: 20px" type="primary">导出EXCEL</el-button>
          </div>
          <div class="panel-body" style="height: 700px">
            <el-table empty-text="暂无数据" :data="notices" id="noticeTable" v-loading="loading" element-loading-text="加载中...">
              <el-table-column align="center" prop="title" :show-overflow-tooltip='true' label="消息标题"/>
              <el-table-column align="center" prop="people" label="发布人"/>
              <el-table-column align="center" prop="time" label="发布时间" :formatter="getNoticeDate"/>
<!--              <el-table-column align="center" prop="type" label="消息类型"></el-table-column>-->
              <el-table-column align="center" prop="abstracts" :show-overflow-tooltip='true' label="消息梗概" width="450"/>
              <el-table-column align="center" label="操作" width="250">
                  <template slot-scope="props">
                      <el-button type="info" size="mini" @click.native="onAlterInfo(props.row)">
                          <i class="fa el-icon-edit"></i>
                          编辑
                      </el-button>
                      <el-button type="danger" size="mini" @click.native="onDeleteNotice(props.row.id)">
                          <i class="fa fa-remove"></i>
                          删除
                      </el-button>
                  </template>
              </el-table-column>
            </el-table>
            <div class="block" style="display: flex;justify-content: center;margin-top: 20px">
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
      </div>
    </div>
</template>

<script>
  import PanelTitle from '../../components/PanelTitle'
  import FileSaver from "file-saver"
  import XLSX from "xlsx"
  export default {
    name: 'NoticeManage',
    data() {
      return {
        addInfo:{
          title:'',
          publish_time:'',
          content:'',
          adminId: '',
          name:'',
        },
        usr: {
          admin_id:'',
          admin_name:''
        },
        timePeriod:['',''],
        addDialog: false,
        editDialog: false,
        notices: [],
        // departments: {},
        admin:{},
        searchName: '',
        searchTime: '',
        loading: false,
        //时间的快速选择
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        currentPage:1,
        pageSize:10,
        totalCount:0,
        noticeType:'allType',
        allNoticeType:[
          {value:'communityDynamic',label:'小区动态'},
          {value:'latestNews',label:'近期新闻'},
          {value:'importantNotice',label:'重要通知'},
          {value:'facilityUse',label:'设施使用'}
        ]
      }
    },
    components: {
      PanelTitle,
    },
    created() {
      this.onGetNotice()
      this.onGetUsr()
    },
    methods: {
      onRefresh() {
        this.onGetNotice()
        this.onGetUsr()
      },
      //通过类型查询
      searchRadioType(){
        this.onGetNotice()
      },
      //获取所有的消息
      onGetNotice(){
        let body
        if ((this.timePeriod && this.timePeriod.length!==2) || !this.timePeriod){
          body={
            startTime: '',
            endTime:'',
            name: this.searchName,
            pageSize:this.pageSize,
            currentPage:this.currentPage,
            type:this.noticeType
          }
        }else if (this.timePeriod && this.timePeriod.length===2){
          body={
            startTime: this.timePeriod[0],
            endTime:this.timePeriod[1],
            name: this.searchName,
            pageSize:this.pageSize,
            currentPage:this.currentPage,
            type:this.noticeType
          }
        }
        this.$http.post(this.$store.state.url.notice.allInfo,body).then(({data: notices}) => {
          this.notices = notices.noticeInfo
          this.totalCount = notices.totalNum
        })
      },

      //获取管理员信息，用以社区消息的信息填充
      onGetUsr(){
        this.$http.get(this.formatString(this.$store.state.url.admin.usr,{
            tele: this.$store.state.auth.user
        })).then(({data: usr})=>{
          console.log(usr)
          this.usr = usr[0];
          this.$store.commit('setId', this.usr.admin_id);
        })
      },
      //添加消息
      onAddNotice(){
        console.log(this.usr.admin_name)
        this.$router.push({name:'NoticeAdd',params:{adminName:this.usr.admin_name,adminId:this.usr.admin_id}})
      },

      //修改需确认
      onAlterInfo(row){
        console.log(row)
        if (row.tele === this.$store.state.auth.user){
          //传参 消息id
          this.$router.push({name:'NoticeAdd',params:{noticeId:row.id,
              adminId:this.usr.admin_id,
              adminName:this.usr.admin_name}})
        }
        else {
          this.$message.error("对不起！您没有修改权限！")
        }
      },

      //分页函数（需修改）
      handleSizeChange(val) {
        this.pageSize=val
        this.onRefresh()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.onRefresh()
      },

      onDeleteNotice(id){
        this.$confirm('确定删除本条社区消息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.get(this.formatString(this.$store.state.url.notice.del,{
            id: id
          })).then(() => {
            this.$message.success("删除成功");
            this.onRefresh();
            this.editDialog = false
          }).catch(() => {
            this.$message.error("删除失败");
            this.editDialog = false
          })
        })
      },

      getNoticeDate(row){
        return this.getChangedDate(row.time)
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
      //导出表格
      exportExcel() {
        var wb = XLSX.utils.table_to_book(document.querySelector("#noticeTable"));
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              "notice.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }
    }
  }
</script>
<style>
.typeChoose{
  margin: 40px 0 10px 30px;
}
</style>
