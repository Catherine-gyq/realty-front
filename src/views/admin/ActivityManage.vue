<template>
  <div>
    <div class="panel">
      <panel-title title="维修预约信息管理"></panel-title>
      <div class="panel-body">
        <el-date-picker style="margin-right: 20px" size="small"
                        @change="searchRadioTime"
                        v-model="timePeriod"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
        </el-date-picker>
        <!--            使用radio进行一个状态选择（待批准;待处理；处理中;已完成）-->
        <el-radio-group v-model="searchForm.reserveStatus" @change="searchRadioStatus">
          <el-radio v-for="(item,index) in allStatus" :key="index"  :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
        <el-button size="small" @click="onRefresh" type="primary" style="float: right;margin-right: 20px">刷新</el-button>
      </div>
      <div class="panel-body" style="height: 700px">
        <el-table empty-text="暂无数据" :key="randomKey" :data="repairReserve" v-loading="loading" element-loading-text="加载中...">
          <el-table-column align="center" prop="address" label="维修地点" width="190"/>
          <el-table-column align="center" prop="date" label="维修时间" width="190"/>
          <el-table-column align="center" prop="content" label="维修内容" width="190"/>
          <el-table-column align="center" prop="residentName" label="申请人" width="190"/>
          <el-table-column align="center" prop="adminName" label="审批人" width="190">
            <template slot-scope="props">
              <span v-if="props.row.adminName">{{props.row.adminName}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="adminName" :formatter="statusTransfer"  label="状态" width="200"/>
          <el-table-column align="center" label="操作">
            <template slot-scope="props">
              <el-button type="primary" v-if="props.row.status==='0'" size="mini" @click="approveRepair(props.row.repair_id)">批准</el-button>
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
      currentRow: {},
      addDialog: false,
      editDialog: false,
      repairReserve: [],
      departments: {},
      searchName: '',
      searchNo: '',
      loading: false,
      timePeriod:[],
      searchForm:{
        startTime:'',
        endTime:'',
        reserveStatus:'0',
      },
      allStatus:[
        {value:'0',label:'待批准'},
        {value:'1',label:'待处理'},
        {value:'2',label:'处理中'},
        {value:'3',label:'已完成'},
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
    this.onGetRepairReserve()
  },
  methods: {
    onRefresh() {
      this.onGetRepairReserve()
    },
    onGetRepairReserve(){
      //使用时间和状态做筛选
      let body
      if (this.timePeriod && this.timePeriod.length===2){
        body={
          startTime: this.timePeriod[0],
          endTime:this.timePeriod[1],
          reserveStatus:this.searchForm.reserveStatus,
          pageSize:this.pageSize,
          currentPage:this.currentPage
        }
      }
      else{
        body={
          startTime: '',
          endTime:'',
          reserveStatus:this.searchForm.reserveStatus,
          pageSize:this.pageSize,
          currentPage:this.currentPage
        }
      }
      this.$http.post(this.$store.state.url.repair.all,body).then(({data: data})=>{
        this.repairReserve = data.residentInfo
        this.totalCount = data.totalNum
        this.randomKey = Math.random()
      })
    },
    onAlterInfo(row){
      this.currentRow = row;
      this.editDialog = true;
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
      console.log(this.searchForm)
      this.onRefresh()
    },
    searchRadioTime(){
      this.onRefresh()
    },
    approveRepair(repairId){
      this.$http.get(this.formatString(this.$store.state.url.repair.approve, {
        repair_id: repairId
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
