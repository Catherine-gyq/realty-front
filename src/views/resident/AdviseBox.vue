<template>
  <div class="panel_check">
    <el-row :gutter="24" >
      <el-col :span="6" style="height: 700px; border: 1px solid #eee;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #ffffff">
        <div style="margin: 10px 10px 0px 0px;">
          <h2>新增意见反馈</h2>
          <el-form ref="adviseForms" :model="adviseForm" label-width="40px" style="margin-top: 30px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="adviseForm.title"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
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
<!--              <el-table-column prop="feedback" label="反馈">-->
<!--                <template slot-scope="props">-->
<!--                  <div v-if="props.feedback">{{props.feedback}}</div>-->
<!--                  <div v-else>暂无</div>-->
<!--                </template>-->
<!--              </el-table-column>-->
              <el-table-column prop="status" label="审阅状态" width="200px" :formatter="getAdviseStatus"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="props">
                  <el-button :disabled="props.row.status!=='checked'" type="info" size="mini" @click.native="getResponse(props.row)">
                    <i class="fa el-icon-edit"></i>
                    查看回复
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
    <el-dialog :visible.sync="checkDialog" width="700px">
      <el-form :data="chosenData" label-width="50px" size="medium">
        <el-form-item>
          <el-row>
            <el-col :span="4"><span style="font-size: 20px">标题：</span></el-col>
            <el-col :span="20"><span style="font-size: 20px">{{chosenData.title}}</span></el-col>
          </el-row>
        </el-form-item>
        <el-form-item >
          <el-row>
            <el-col :span="4"><span style="font-size: 20px">提交日期：</span></el-col>
            <el-col :span="20"><span style="font-size: 20px">{{chosenData.date}}</span></el-col>
          </el-row>
        </el-form-item>
        <el-form-item >
          <el-row>
            <el-col :span="4"><span style="font-size: 20px">内容：</span></el-col>
            <el-col :span="20"><span style="font-size: 20px">{{chosenData.content}}</span></el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="4"><span style="font-size: 20px">反馈：</span></el-col>
            <el-col :span="20"><span style="font-size: 20px" v-html="chosenData.feedback">{{chosenData.feedback}}</span></el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
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
      chosenData:{},
      checkDialog:false
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
    onAdviseSubmit(){
      this.adviseForm.resident_id = this.$store.state.auth.id;
      var myDate = new Date();
      this.adviseForm.dateTime = myDate
      this.$http.post(this.$store.state.url.advise.add,this.adviseForm)
          .then(()=>{
            this.$message.success("意见添加成功，请耐心等待后续");
            this.onRefresh();
            this.$refs['adviseForms'].resetFields();
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
    getResponse(allData){
    //  展示
      this.chosenData = allData
      console.log(allData)
      this.chosenData.date = this.getChangedDate(allData.date)
      this.checkDialog = true
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
.contain_left{
  display: flex;
  align-content: center;
  justify-content: left;
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
