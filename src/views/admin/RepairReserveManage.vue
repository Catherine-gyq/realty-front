<template>
    <div>
      <div class="panel">
        <panel-title title="维修预约信息管理"></panel-title>
        <div class="panel-body">
<!--            通过select选择时间段，即显示在该时间段中的事件-->
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
            <el-table empty-text="暂无数据" :data="repairReserve" v-loading="loading" element-loading-text="加载中...">
                <el-table-column align="center" prop="repair_address" label="维修地点" width="190"/>
                <el-table-column align="center" prop="name" label="维修时间" width="190"/>
                <el-table-column align="center" prop="sex" label="维修内容" width="190"/>
                <el-table-column align="center" prop="department" label="申请人" width="190"/>
                <el-table-column align="center" prop="education" label="审批人" width="190"/>
                <el-table-column align="center" prop="birthday" label="状态" width="200"/>
                <el-table-column align="center" label="操作">
                  <template slot-scope="props">
                    <el-button type="info" size="mini" @click.native="onAlterInfo(props.row)">
                        <i class="fa el-icon-edit"></i>

                    </el-button>
                    <el-button type="danger" size="mini" @click.native="onDeleteTeacher(props.row.no)">
                        <i class="fa fa-remove"></i>
                        删除
                    </el-button>
                  </template>
              </el-table-column>
            </el-table>
        </div>
      </div>
    </div>
</template>

<script>
  import PanelTitle from '../../components/PanelTitle'

  export default {
    name: 'RepairReserveManage',
    data() {
      return {
        currentRow: {},
        addDialog: false,
        editDialog: false,
        repairReserve: {},
        departments: {},
        searchName: '',
        searchNo: '',
        loading: false,
        timePeriod:[],
        searchForm:{
          startTime:{},
          endTime:{},
          reserveStatus:'',
        },
        allStatus:[
          {value:0,label:'待批准'},
          {value:1,label:'待处理'},
          {value:2,label:'处理中'},
          {value:3,label:'已完成'},
        ],
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
      }
      },
      components: {
          PanelTitle,
      },
      created() {
          this.onGetRepairReserve()
          // this.onGetDepartment()
      },
      methods: {
          onRefresh() {
              this.onGetRepairReserve()
          },
          onGetRepairReserve(){
            //使用时间和状态做筛选
            this.searchForm.startTime = this.timePeriod[0]
            this.searchForm.endTime = this.timePeriod[1]
            console.log(this.searchForm)
            this.$http.post().then(res=>{
              console.log(res)
            })
          },
          // onGetDepartment(){
          //     this.$http.get(this.$store.state.url.department.allInfo)
          //         .then(({data: department}) => {
          //             this.departments = department
          //         })
          // },
          onAlterInfo(row){
              this.currentRow = row;
              this.editDialog = true;
          },
          // onUploadedTeacher(){
          //     this.$http.post(this.$store.state.url.teacher.update, this.currentRow)
          //         .then(() => {
          //             this.$message.success("修改成功");
          //             this.onRefresh();
          //             this.editDialog = false
          //         }).catch(() => {
          //         this.$message.error("修改失败");
          //         this.editDialog = false
          //     })
          // },
        searchRadioStatus(){
          this.onRefresh()
        },
        searchRadioTime(){
          this.onRefresh()
        },
          // onDeleteTeacher(no){
          //     this.$http.get(this.formatString(this.$store.state.url.teacher.del,{
          //         no: no
          //     })).then(() => {
          //         this.$message.success("删除成功");
          //         this.onRefresh();
          //         this.editDialog = false
          //     }).catch(() => {
          //         this.$message.error("删除失败");
          //         this.editDialog = false
          //     })
          // },
      }
  }
</script>

<style>
</style>
