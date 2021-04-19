<template>
  <div>

    <!--页面展示-->
    <div class="panel">
      <panel-title title="意见箱管理"></panel-title>
      <div class="panel-body" style="height: 700px">
        <el-select style="margin-left: 20px;margin-bottom: 40px" v-model="searchStatus" placeholder="请选择意见状态" @change="onGetAdvise">
          <el-option
              v-for="item in allStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-table empty-text="暂无数据" :data="advises" v-loading="loading" element-loading-text="加载中...">
          <el-table-column align="center" prop="title" :show-overflow-tooltip='true' label="意见标题" width="250"/>
          <el-table-column align="center" prop="content" :show-overflow-tooltip='true' label="意见内容" width="400"/>
          <el-table-column align="center" prop="date" label="发布时间" width="250"/>
          <el-table-column align="center" prop="residentName" label="意见发起人" />
          <el-table-column align="center" label="操作" width="250">
            <template slot-scope="props">
              <el-button type="info" size="mini" @click.native="onChangeStatus(props.row,'checked')">
                <i class="fa el-icon-edit"></i>
                查看
              </el-button>
              <el-button v-if="searchStatus!=='star'" type="primary" size="mini" @click.native="onChangeStatus(props.row,'star')">
                <i class="fa el-icon-star-off"></i>
                挂起
              </el-button>
              <el-button v-if="searchStatus==='star'"  type="danger" size="mini" @click.native="onChangeStatus(props.row,'unstar')">
                <i class="fa el-icon-star-on"></i>
                解挂
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

export default {
  name: 'NoticeManage',
  data() {
    return {
      currentRow: {
        id:'',
        tele:'',
        tile:'',
        people:'',
        time:'',
        content:'',
        admin_id:'',
      },
      usr: {
        admin_id:'',
        admin_name:''
      },
      // timePeriod:['',''],
      // addDialog: false,
      // editDialog: false,
      advises: [],
      // departments: {},
      // admin:{},
      // searchName: '',
      // searchTime: '',
      loading: false,
      //意见箱的所有状态
      allStatus:[
        {value:'unchecked',label:'未查看'},
        {value:'checked',label:'已查看'},
        {value:'star',label:'挂起'},
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
      //意见状态
      searchStatus:'unchecked',
      currentPage:1,
      pageSize:10,
      totalCount:0,
    }
  },
  components: {
    PanelTitle,
  },
  created() {
    this.onGetAdvise()
    this.onGetUsr()
  },
  methods: {
    onRefresh() {
      this.onGetAdvise()
      this.onGetUsr()
    },
    onGetAdvise(){
      //获取相应的意见箱内容
      let body={
        pageSize:this.pageSize,
        currentPage:this.currentPage,
        status:this.searchStatus
      }
      this.loading=true
      this.$http.post(this.$store.state.url.advise.allInfo,body).then(({data: advises}) => {
        console.log(advises)
        this.advises = advises.adviseInfo
        this.totalCount = advises.totalNum
        this.loading=false
      })
    },

    //获取管理员信息
    onGetUsr(){
      this.$http.get(this.formatString(this.$store.state.url.admin.usr,{
        tele: this.$store.state.auth.user
      })).then(({data: usr})=>{
        this.usr = usr;
        this.$store.commit('setId', this.usr.admin_id);
      })
    },


    onChangeStatus(row,status){
      if (row.status!=='star'){
        let body={
          advise_id:row.advise_id,
          status:status
        }
        this.$http.get(this.formatString(this.$store.state.url.advise.change, body))
            .then(() => {
              this.onRefresh();
            }).catch(() => {
          this.onRefresh();
        })
      }else{
        //取消挂起，则状态变为看过
        if (status==='unstar'){
          let body={
            advise_id:row.advise_id,
            status:"checked"
          }
          this.$http.get(this.formatString(this.$store.state.url.advise.change, body))
              .then(() => {
                this.onRefresh();
              }).catch(() => {
            this.onRefresh();
          })
        }
      }
    },

    //修改需确认
    // onAlterInfo(row){
    //   this.currentRow = row;
    //   if (row.tele === this.$store.state.auth.user){
    //     this.editDialog = true;
    //   }
    //   else {
    //     this.$message.error("对不起！您没有修改权限！")
    //   }
    // },
    //分页函数（需修改）
    handleSizeChange(val) {
      this.pageSize=val
      this.onRefresh()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.onRefresh()
    },

    //消息修改
    onUploadedNotice(){
      this.$http.post(this.$store.state.url.notice.update, this.currentRow)
          .then(() => {
            this.$message.success("修改成功");
            this.onRefresh();
            this.editDialog = false
          }).catch(() => {
        this.$message.error("修改失败");
        this.editDialog = false
      })
    },



    //添加消息
    onAddNotice(){
      const myDate = new Date();
      let date = myDate.toLocaleDateString();
      date= date.toString();
      date.replace('/','-');
      this.currentRow = {};
      this.currentRow.people = this.usr[0].admin_name
      this.currentRow.admin_id = this.usr[0].admin_id
      this.currentRow.time = date;
      this.addDialog = true;
    },

    onCreateNotice(){
      // this.currentRow.credit = this.currentRow.credit.toString();
      this.$http.post(this.$store.state.url.notice.add, this.currentRow)
          .then(() => {
            this.$message.success("添加成功");
            this.onRefresh();
            this.addDialog = false
          }).catch(() => {
        this.$message.error("添加失败");
        this.addDialog = false
      })
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
    }
  }
}
</script>

<style>
</style>
