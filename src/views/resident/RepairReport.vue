<template>
  <div class="panel_check">
    <el-row :gutter="30">
      <el-col :span="6" style="height: 700px; border: 1px solid #eee;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #ffffff">
        <div style="margin: 10px 10px 0px 0px;">
          <h2>新建预约</h2>
          <el-form ref="repairForm" :rules="RepairRule" :model="repairForm" label-width="80px" style="margin-top: 20px">
            <el-form-item label="维修地点" attr="address" prop="address">
              <el-input v-model="repairForm.address"></el-input>
            </el-form-item>
            <el-form-item label="预约时间" attr="date" prop="date">
              <el-date-picker type="date" placeholder="选择日期" v-model="repairForm.date" style="width: 100%;" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="维修内容" attr="content" prop="content">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="repairForm.content"></el-input>
            </el-form-item>
          </el-form>
          <div style="display: flex;flex-direction: row;justify-content: center;margin-top: 100px">
            <el-button type="primary" @click="onRepairSubmit">立即预约</el-button>
          </div>
        </div>
      </el-col>
      <!--显示自己的所有预约-->
      <el-col :span="18" style="height: 700px; border: 1px solid #eee;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #ffffff">
        <el-container style="margin-top: 20px;height: 100%;">
          <el-header style="font-size: 30px">
            <el-dropdown>
              <h1>我的预约</h1>
              <el-dropdown-menu></el-dropdown-menu>
            </el-dropdown>
          </el-header>
          <el-main style="text-align: center;justify-content: center;width: 100%;">
            <el-table :data="repairList">
              <el-table-column prop="date" label="预约日期" width="140"/>
              <el-table-column prop="address" label="地址" width="120"/>
              <el-table-column prop="content" label="维修内容详情"/>
              <el-table-column prop="status" :formatter="statusTransfer" label="状态"/>
              <el-table-column align="center" label="操作">
                <template slot-scope="props" width="200">
                  <el-button :disabled="props.row.status!=='0'" type="info" size="mini" @click.native="onRepairCancel(props.row.repair_id)">
                    <i class="fa el-icon-edit"></i>
                    取消预约
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer style="text-align: center;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
          </el-footer>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      repairList: [{
        repair_id:'',
        date: '',
        address: '',
        content: '',
        status: ''
      }],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '明天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '三天后',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周后',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }
        ]
      },
      RepairRule: {
        address: { required: true, message: '请输入维修地点', trigger: 'blur' },
        date: { required: true, message: '请输入预约时间', trigger: 'blur' },
        content: { required: true, message: '请输入维修内容',trigger: 'blur' },
      },
      repairForm: {
        address: '',
        date: '',
        content: '',
        resident_id: '',
      },
      repairStatus:[
        {value:'0',label:'待批准'},
        {value:'1',label:'待处理'},
        {value:'2',label:'处理中'},
        {value:'3',label:'已完成'},
      ],
      currentPage:1,
      pageSize:10,
      totalCount:0,
    }
  },
  created() {
    this.onGetRepair()
  },
  methods: {
    onRefresh(){
      this.onGetRepair();
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.onRefresh()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.onRefresh()
    },
    statusTransfer(row){
      // console.log(row)
      let temp = ""
      this.repairStatus.map(e=>{
        if (row.status === e.value){
          temp = e.label
        }
      })
      return temp
    },
    onGetRepair(){
      let body={
        usr_id: this.$store.state.auth.id,
        pageSize:this.pageSize,
        currentPage:this.currentPage
      }
      console.log(body)
      this.$http.get(this.formatString(this.$store.state.url.repair.allInfo, body)).then(({data: data}) => {
        console.log(data)
        this.repairList = data.residentInfo
        this.totalCount = data.totalNum
      })
    },
    onRepairSubmit () {
      this.$refs['RepairForm'].validate((valid)=>{
        if (valid){
          this.repairForm.resident_id = this.$store.state.auth.id;
          this.$http.post(this.$store.state.url.repair.add,this.repairForm)
              .then(()=>{
                this.$message.success("预约成功，等待审核");
                this.onRefresh();
                this.$refs['repairForm'].resetFields();
              }).catch(()=>{
            this.$message.error("预约失败");
          })
        }
      })
    },

    onRepairCancel(id) {
      this.$confirm('确定取消预约吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.formatString(this.$store.state.url.repair.cancel,{
          repair_id: id
        })).then(() => {
          this.$message.success("取消成功");
          this.onRefresh();
        }).catch(() => {
          this.$message.error("取消失败");
        })
      }).catch()
    },
  },
}
</script>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
