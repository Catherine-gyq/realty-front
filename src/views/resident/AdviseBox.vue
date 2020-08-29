<template>
  <div class="panel_check">
    <h1>意见箱</h1>
    <el-row :gutter="24" >
      <el-col :span="6" :offset="1" style="height: 500px; border: 1px solid #eee;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
        <h2>新增意见反馈</h2>
        <el-form ref="form" :model="form" label-width="80px" style="margin-top: 20px">
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onAdviseSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="15" :offset="1" style="height: 500px; border: 1px solid #eee;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
        <el-container style="margin-top: 20px;height: 100%;">
          <el-header style="font-size: 30px">
            <el-dropdown>
              <el-dropdown-menu>
              </el-dropdown-menu>
              <h1>所有意见反馈</h1>
            </el-dropdown>
          </el-header>
          <el-main style="text-align: center;justify-content: center;width: 100%;">
            <el-table :data="boxList.slice((currpage - 1) * pagesize, currpage * pagesize)">
              <el-table-column prop="date" label="提交日期" width="140">
              </el-table-column>
              <el-table-column prop="title" label="标题">
              </el-table-column>
              <el-table-column prop="content" label="内容">
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer style="text-align: center;">
            <el-pagination background
                           layout="prev, pager, next, sizes, total, jumper"
                           :page-sizes="[1, 5, 10, 15, 20]"
                           :page-size="pagesize"
                           :total="boxList.length"
                           @current-change="handleCurrentChange"
                           @size-change="handleSizeChange">
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
      pagesize: 10,
      currpage: 1,
      form: {
        date: '',
        resident_id:'',
        title: '',
        content: ''
      }
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
    onGetAdvise(){
      this.$http.get(this.$store.state.url.advise.allInfo).then(({data: advise}) =>
      {
        this.boxList = advise
      })
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
      }
      return fmt;
    },

    onAdviseSubmit(){
      this.form.resident_id = this.$store.state.auth.id;
      var myDate = new Date();
      var date = this.dateFormat("YYYY-mm-dd HH:MM:SS", myDate)
      this.form.date = date
      this.$http.post(this.$store.state.url.advise.add,this.form)
          .then(()=>{
            this.$message.success("意见添加成功，请耐心等待后续");
            this.onRefresh();
          }).catch(()=>{
        this.$message.error("添加失败");
        // this.onRefresh();
      })
    },

    handleCurrentChange (cpage) {
      this.currpage = cpage
    },
    handleSizeChange (psize) {
      this.pagesize = psize
    },
    // handleSelectionChange (val) {
    //   // console.log(val)
    // }

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
