<template>
  <div>
    <div class="panel">
      <panel-title title="活动室管理"></panel-title>
      <div class="panel-body">
        <el-select v-model="searchForm.room_id" style="margin-right: 20px" :clearable="true" @change="onGetActivityReserve">
          <el-option v-for="(item,index) in rooms" :value="item.room_id" :label="item.room_usage" :key="index"></el-option>
        </el-select>
        <el-radio-group v-model="searchForm.status" @change="searchRadioStatus">
          <el-radio v-for="(item,index) in allStatus" :key="index"  :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </div>
      <div class="panel-body" style="height: 700px">
        <el-table empty-text="暂无数据" :key="randomKey" :data="activityReserve" v-loading="loading" element-loading-text="加载中...">
          <el-table-column align="center" prop="room_usage" label="活动室"/>
          <el-table-column align="center" prop="activity_usage" label="活动室用途"/>
          <el-table-column align="center" prop="date" label="预约日期"/>
          <el-table-column align="center" :formatter="timeTransfer" label="使用时间"/>
          <el-table-column align="center" prop="resident_name" label="申请人"/>
          <el-table-column align="center" v-if="searchForm.status!=='unapproval'" prop="admin_name" label="审批人"/>
          <el-table-column align="center" :formatter="statusTransfer"  label="状态" width="200"/>
          <el-table-column align="center" label="操作" v-if="searchForm.status==='unapproval'">
            <template slot-scope="props">
              <el-button type="primary" size="mini" @click="approveRepair(props.row.activity_id,'approved')">批准</el-button>
              <el-button type="danger" size="mini" @click="approveRepair(props.row.activity_id,'rejected')">拒绝</el-button>
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

export default {
  name: 'ActivityManage',
  data() {
    return {
      activityReserve: [],
      rooms:[],
      loading: false,
      timePeriod:[],
      searchForm:{
        room_id:'',
        status:'unapproval',
      },
      usr: {
        admin_id:'',
        admin_name:''
      },
      allStatus:[
        {value:'unapproval',label:'待批准'},
        {value:'rejected',label:'已拒绝'},
        {value:'approved',label:'已通过'},
      ],
      randomKey:'',
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
    }
  },
  components: {
    PanelTitle,
  },
  created() {
    this.onGetActivityReserve()
    this.onGetRoom()
    this.onGetUsr()
  },
  methods: {
    onRefresh() {
      this.onGetActivityReserve()
    },
    //获取所有活动
    onGetActivityReserve(){
      this.loading=true
      let body
      body={
        room_id: this.searchForm.room_id,
        status: this.searchForm.status,
        pageSize:this.pageSize,
        currentPage:this.currentPage
      }
      this.$http.get(this.formatString(this.$store.state.url.activity.all,body)).then(({data: data})=>{
        this.activityReserve = data.activityInfo
        this.totalCount = data.totalNum
        this.loading = false
        this.randomKey = Math.random()
      })
    },
    //获取房间
    onGetRoom(){
      this.$http.get(this.$store.state.url.room.allInfo)
          .then(({data: rooms}) => {
            this.rooms = rooms
          })
    },
    timeTransfer(row){
      let temp = row.startTime+'-'+row.endTime
      return temp
    },
    statusTransfer(row){
      let temp = ""
      this.allStatus.map(e=>{
        if (row.status === e.value){
          temp = e.label
        }
      })
      return temp
    },
    searchRadioStatus(){
      this.onRefresh()
    },
    searchRadioTime(){
      this.onRefresh()
    },

    //获取管理员信息，用以社区消息的信息填充
    onGetUsr(){
      this.$http.get(this.formatString(this.$store.state.url.admin.usr,{
        tele: this.$store.state.auth.user
      })).then(({data: usr})=>{
        this.usr = usr[0];
        this.$store.commit('setId', this.usr.admin_id);
      })
    },
    //管理员的活动状态处理
    approveRepair(activityId,status){
      console.log(activityId)
      console.log(this.usr.admin_id)
      this.$http.get(this.formatString(this.$store.state.url.activity.approve, {
        activity_id: activityId,
        adminId:this.usr.admin_id,
        status:status
      })).then(() => {
        this.$message.success("操作成功");
        this.onRefresh();
      }).catch(() => {
        this.$message.error("操作失败");
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.onRefresh()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.onRefresh()
    },
    },
}
</script>

<style>
</style>
