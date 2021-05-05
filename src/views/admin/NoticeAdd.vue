<template>
  <div class="panel" style="min-height: 800px">
    <el-form :rules="noticeRules" class="formStyle" ref="editForm" v-model="currentRow" label-width="80px">
      <el-form-item label="消息标题" prop="title">
        <el-col :span="21">
          <el-input class="noticeInput" v-model="currentRow.title"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="发布时间" prop="time">
        <el-col :span="21">
          <el-input class="noticeInput" v-model="currentRow.time" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="发布人" prop="people">
        <el-col :span="21">
          <el-input class="noticeInput" v-model="currentRow.adminName" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="消息类型" prop="type">
        <el-col :span="21">
          <el-select class="noticeInput" v-model="currentRow.type" placeholder="请选择消息类型">
            <el-option  v-for="item in allNoticeType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="消息摘要" prop="abstracts">
        <el-col :span="21" >
          <el-input v-model="currentRow.abstracts" type="textarea" :autosize="{minRows: 4, maxRows: 10}"></el-input>
        </el-col>
      </el-form-item>
<!--      在这里应用插件输入-->
      <el-form-item label="消息内容" prop="content">
        <el-col :span="21">
          <quill-editor v-model="currentRow.content"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)"
          ></quill-editor>
        </el-col>
      </el-form-item>
      <div class="buttonFoot">
        <el-button style="margin-right: 20px" v-if="ifAdd" @click="onCreateNotice" type="primary">
          添加
        </el-button>
        <el-button style="margin-right: 20px" v-else @click="onModifyNotice" type="primary">
          确定
        </el-button>
        <el-button @click="onCancel" >
          取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "NoticeAdd",
  data(){
    return{
      currentRow:[],
      noticeId:'',
      ifAdd:'',
      editorOption: {},
      allNoticeType:[
        {value:'communityDynamic',label:'小区动态'},
        {value:'latestNews',label:'近期新闻'},
        {value:'importantNotice',label:'重要通知'},
        {value:'facilityUse',label:'设施使用'}
      ],
      noticeRules: {
        title: [{required: true, trigger:'blur', message:'请输入消息标题'}],
        type: [{required: true, trigger:'blur', message:'请选择消息类型'}],
        abstracts:[{required: true, trigger:'blur', message:'请填写消息摘要'}],
        content:[{required: true, trigger:'blur', message:'请填写消息内容'}]
        // mailBox: [{required: true, trigger: 'blur',pattern: '^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
        //   message: '请输入正确的邮箱格式'}],
      },
    }
  },
  computed:{
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  created() {
    this.onSetStatus()
  },
  methods:{
    onSetStatus(){
      const myDate = new Date();
      let date = this.getChangedDate(myDate)
      //应该有专门用来转换的函数
      this.currentRow.time= date;
      console.log(this.$route.params.adminName)
      this.noticeId = this.$route.params.noticeId
      this.currentRow.adminName = this.$route.params.adminName
      this.currentRow.adminId = this.$route.params.adminId
      if (this.noticeId){
        this.ifAdd = false
        this.getNoticeDetail()
      }else{
        this.ifAdd = true
      }
    },
    //获取消息的具体信息
    getNoticeDetail() {
      this.$http.get(this.formatString(this.$store.state.url.notice.detail,{
        id: this.noticeId
      })).then(({data: notice})=>{
        notice.time = this.getChangedDate(notice.time)
        this.currentRow = notice;
      })
    },
    //添加消息
    onCreateNotice(){
      this.$refs['editForm'].validate((valid)=>{
        if (valid){
          this.$http.post(this.$store.state.url.notice.add, this.currentRow)
              .then(() => {
                this.$message.success("添加成功");
                this.$refs['editForm'].resetFields();
                this.$router.push({name:'NoticeManage'})
              }).catch(() => {
            this.$message.error("添加失败");
          })
        }
      })
    },
    //修改消息
    onModifyNotice(){
      this.$refs['editForm'].validate((valid)=>{
        if (valid){
          this.$http.post(this.$store.state.url.notice.update, this.currentRow)
              .then(() => {
                this.$message.success("修改成功");
                this.$refs['editForm'].resetFields()
                this.$router.push({name:'NoticeManage'})
              }).catch(() => {
            this.$message.error("修改失败");
          })
        }
      })
    },
    onCancel(){
      this.$refs['editForm'].resetFields()
      this.$router.push({name:'NoticeManage'})
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
  }
}
</script>

<style scoped>
.formStyle{
  margin: 30px 0 20px 30px;
}
.noticeInput{
  width: 600px;
}
.buttonFoot{
  margin: 40px 0 0 20px;
  display: flex;
  justify-content: center;
}
</style>
