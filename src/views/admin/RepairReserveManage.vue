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
        <el-button size="small" @click="exportExcel" type="primary" style="float: right;margin-right: 20px">导出EXCEL</el-button>
      </div>
      <div class="panel-body" style="height: 700px">
        <el-table empty-text="暂无数据" :key="randomKey" :data="repairReserve" id="repairTable" v-loading="loading" element-loading-text="加载中...">
          <el-table-column align="center" prop="address" label="维修地点"/>
          <el-table-column align="center" prop="date" label="维修时间"/>
          <el-table-column align="center" prop="content" :show-overflow-tooltip="true" label="维修内容" width="250"/>
          <el-table-column align="center" prop="residentName" label="申请人"/>
          <el-table-column align="center" prop="adminName" label="审批人">
            <template slot-scope="props">
              <span v-if="props.row.adminName">{{props.row.adminName}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="adminName" :formatter="statusTransfer"  label="状态" width="200"/>
          <el-table-column align="center" label="操作" v-if="searchForm.reserveStatus!=='finished'">
            <template slot-scope="props">
              <el-button type="primary" v-if="props.row.status==='unapproved'" size="mini" @click="approveRepair(props.row.repair_id,'pending')">批准</el-button>
              <el-button type="primary" v-if="props.row.status==='pending'" size="mini" @click="approveRepair(props.row.repair_id,'processing')">处理中</el-button>
              <el-button type="primary" v-if="props.row.status==='processing'" size="mini" @click="approveRepair(props.row.repair_id,'finished')">已完成</el-button>
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
  import XLSX from "xlsx"
  import FileSaver from "file-saver"

  export default {
    name: 'RepairReserveManage',
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
          reserveStatus:'unapproved',
        },
        allStatus:[
          {value:'unapproved',label:'待批准'},
          {value:'pending',label:'待处理'},
          {value:'processing',label:'处理中'},
          {value:'finished',label:'已完成'},
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
        usr:{
          admin_id:'',
          admin_name:''
        }
      }
      },
      components: {
        PanelTitle,
      },
      created() {
        this.onGetRepairReserve()
        this.onGetUsr()
      },
      methods: {
        onRefresh() {
          this.onGetRepairReserve()
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
            this.repairReserve = data.repairInfo
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
        approveRepair(repairId,status){
          this.$http.get(this.formatString(this.$store.state.url.repair.approve, {
            adminId:this.usr.admin_id,
            repair_id: repairId,
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
        //导出表格
        exportExcel() {
          var wb = XLSX.utils.table_to_book(document.querySelector("#adminTable"));
          var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array"
          });
          try {
            FileSaver.saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                "repair.xlsx"
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
</style>
