<template>
  <div class="panel" style="min-height: 800px">
    <el-form class="formStyle" ref="editForm" v-model="currentRow" label-width="80px">
      <el-form-item label="消息标题" prop="title">
        <el-col :span="21">
          <el-input class="noticeInput" v-model="currentRow.title" ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="发布时间" prop="time">
        <el-col :span="21">
          <el-input class="noticeInput" v-model="currentRow.time" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="发布人" prop="people">
        <el-col :span="21">
          <el-input class="noticeInput" v-model="currentRow.people" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="消息摘要" prop="abstract">
        <el-col :span="21" >
          <el-input v-model="currentRow.abstract" type="textarea" :autosize="{minRows: 4, maxRows: 10}"></el-input>
        </el-col>
      </el-form-item>
<!--      在这里应用插件输入-->
      <el-form-item label="消息内容" prop="content">
        <el-col :span="21" >
          <el-input v-model="currentRow.content" type="textarea" :autosize="{minRows: 2, maxRows: 10}"></el-input>
        </el-col>
      </el-form-item>
      <div class="buttonFoot">
        <el-button v-if="ifAdd" @click="onCreateNotice" type="primary">
          添加
        </el-button>
        <el-button v-else @click="onModifyNotice" type="primary">
          确定
        </el-button>
        <el-button @click="onCancel"  size="small">
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
      // adminName: ''
    }
  },
  created() {
    this.onSetStatus()
  },
  methods:{
    onSetStatus(){
      const myDate = new Date();
      let date = myDate.toLocaleDateString();
      date= date.toString();
      date.replace('/','-');
      this.currentRow.time= date;
      console.log(this.$route.params.noticeId)
      this.noticeId = this.$route.params.noticeId
      this.currentRow.adminName = this.$route.params.adminName
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
        this.currentRow = notice;
      })
    },
    onCreateNotice(){

    },
    onModifyNotice(){

    },
    onCancel(){
      this.$router.push({name:'NoticeManage'})
    }
  }
}
</script>

<style scoped>
.formStyle{
  margin: 30px 0 20px 30px;
}
.noticeInput{
  width: 500px;
}
.buttonFoot{
  margin: 20px 0 0 20px;
  display: flex;
  justify-content: center;
}
</style>
