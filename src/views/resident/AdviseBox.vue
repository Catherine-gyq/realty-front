<template>
  <div class="panel_check">
    <el-row :gutter="24" >
      <el-col :span="6" style="height: 700px; border: 1px solid #eee;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #ffffff">
        <div style="margin: 10px 10px 0px 0px;">
          <h2>新增意见反馈</h2>
          <el-form ref="form" :model="adviseForm" label-width="40px" style="margin-top: 30px">
            <el-form-item label="标题">
              <el-input v-model="adviseForm.title"></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="adviseForm.content"></el-input>
            </el-form-item>
          </el-form>
          <div style="display: flex;flex-direction: row;justify-content: center;margin-top: 100px">
            <el-button type="primary" @click="onAdviseSubmit">提交</el-button>
          </div>
        </div>
      </el-col>

      <el-col :span="18" style="min-height: 700px; border: 1px solid #eee;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #ffffff">
        <el-container style="margin-top: 20px;height: 100%;">
          <el-header style="font-size: 30px">
            <el-dropdown>
              <el-dropdown-menu>
              </el-dropdown-menu>
              <h1>意见反馈</h1>
            </el-dropdown>
          </el-header>
          <el-main style="text-align: center;justify-content: center;width: 100%;">
            <el-table :data="boxList">
              <el-table-column prop="title" width="140" label="标题"></el-table-column>
              <el-table-column prop="date" label="提交日期" :formatter="getAdviseDate" width="200"></el-table-column>
              <el-table-column prop="content" label="内容"></el-table-column>
              <el-table-column prop="status" label="审阅状态" width="200px" :formatter="getAdviseStatus"></el-table-column>
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
      boxList: [{
        box_id:'',
        date: '',
        title: '',
        content: '',
        status:'',
      }],
      currentPage:1,
      pageSize:10,
      totalCount:0,
      adviseForm: {
        dateTime: '',
        resident_id:'',
        title: '',
        content: ''
      },
      adviseStatus:[
          {value:"unchecked", label:"未查看"},
          {value:"checked", label:"已查看"},
          {value:"star", label:"挂起"}],

  }
  },
  created() {
    this.onGetAdvise();
  },
  methods: {
    onSubmit () {
      alert('已提交意见，请耐心等候处理！')
    },
    onRefresh(){
      this.onGetAdvise();
    },
    //获取的是所有用户的意见呢,
    onGetAdvise(){
      let body={
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        resident_id:this.$store.state.auth.id,
      }
      this.$http.get(this.formatString(this.$store.state.url.advise.allInfo,body)).then(({data: data}) =>
      {
        this.boxList = data.adviseInfo
        this.totalCount = data.totalNum
      })
    },
    // dateFormat(fmt, date) {
    //   let ret;
    //   const opt = {
    //     "Y+": date.getFullYear().toString(),        // 年
    //     "m+": (date.getMonth() + 1).toString(),     // 月
    //     "d+": date.getDate().toString(),            // 日
    //     "H+": date.getHours().toString(),           // 时
    //     "M+": date.getMinutes().toString(),         // 分
    //     "S+": date.getSeconds().toString()          // 秒
    //     // 有其他格式化字符需求可以继续添加，必须转化成字符串
    //   };
    //   for (let k in opt) {
    //     ret = new RegExp("(" + k + ")").exec(fmt);
    //     if (ret) {
    //       fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    //     }
    //   }
    //   return fmt;
    // },

    onAdviseSubmit(){
      this.adviseForm.resident_id = this.$store.state.auth.id;
      var myDate = new Date();
      // var date = this.dateFormat("YYYY-mm-dd HH:MM:SS", myDate)
      this.adviseForm.dateTime = myDate
      this.$http.post(this.$store.state.url.advise.add,this.adviseForm)
          .then(()=>{
            this.$message.success("意见添加成功，请耐心等待后续");
            this.onRefresh();
          }).catch(()=>{
        this.$message.error("添加失败");
        // this.onRefresh();
      })
    },

    //意见状态格式化
    getAdviseStatus(row){
      let temp=''
      this.adviseStatus.map(e=>{
        if (row.status === e.value){
          temp = e.label
        }
      })
      return temp
    },
    // 意见发表时间格式化
    getAdviseDate(row) {
      return this.getChangedDate(row.date);
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
