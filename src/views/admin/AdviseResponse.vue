<template>
  <div class="panel" style="min-height: 800px">
    <div class="routePath">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="font-weight: lighter;color: #999999" :to="{ path: '/advise/manage' }">意见管理</el-breadcrumb-item>
        <el-breadcrumb-item><a style="font-weight: bold">意见回复</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form class="formStyle">
      <div class="formItem">
        <span>提出人：</span>{{advise.residentName}}
      </div>
      <div class="formItem">
        <span>提出时间：</span>{{advise.date}}
      </div>
      <div class="formItem">
        <span>意见内容：</span>{{advise.content}}
      </div>
      <div style="margin:50px 0 10px 0">反馈内容：</div>
      <el-form-item style="margin:0 70px 0 0">
        <quill-editor  v-model="feedback"
                       ref="myQuillEditor"
                       :options="editorOption"
                       @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                       @change="onEditorChange($event)"
        ></quill-editor>
      </el-form-item>
      <div class="buttonFoot">
        <el-button type="primary" @click="onFeedback">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AdviseResponse",
  data(){
    return{
      adviseId:'',
      adminId:'',
      feedback:'',
      advise:{},
      editorOption: {},
    }
  },
  created() {
    this.onGetAdvise()
  },
  computed:{
    editor() {
      return this.$refs.myQuillEditor.quill
    },
  },
  methods:{
    onGetAdvise(){
      console.log(this.$route.params.adminId)
      if (this.$route.params.adviseId){
        this.adviseId = this.$route.params.adviseId
        this.adminId = this.$route.params.adminId
      }
      // console.log(this.adviseId)
      this.$http.get(this.formatString(this.$store.state.url.advise.detail,{
        adviseId: this.adviseId
      })).then(({data: advise})=>{
        advise.date = this.getChangedDate(advise.date)
        this.advise = advise;
        // this.currentRow.adminName = this.$route.params.adminName
      })
    },
    //进行反馈
    onFeedback(){
      let body={
        adviseId:this.adviseId,
        adminId: this.adminId,
        feedback:this.feedback
      }
      console.log(body)
      this.$http.post(this.$store.state.url.advise.feedback,body).then(()=>{
        this.$message.success("反馈成功！")
        this.$router.push({name:'AdviseManage'})
      }).catch(()=>{
        this.$message.error("反馈失败！")
      })
    },
    //取消返回
    onCancel(){
      this.$router.push({name:'AdviseManage'})
    },
    onEditorReady(editor) { // 准备编辑器
    },
    onEditorBlur(){}, // 失去焦点事件
    onEditorFocus(){}, // 获得焦点事件
    onEditorChange(){}, // 内容改变事件
    saveHtml:function(event){
      alert(this.content);
    },
    //这个是转换时间戳和时间日期之间的
    add0(m){return m<10?'0'+m:m },
    getChangedDate(timeStamp) {
      if (timeStamp) {
        var time = new Date(timeStamp);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
      }
    }
  }
}
</script>

<style scoped>
.formStyle{
  margin: 30px 0 20px 30px;
}
.buttonFoot{
  margin: 40px 0 0 20px;
  display: flex;
  justify-content: center;
}
.formItem{
  margin-bottom: 20px;
}
.routePath{
  padding: 20px 0 20px 30px;
  /*border-bottom: 1px solid #999999;*/
}
</style>
