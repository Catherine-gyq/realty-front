<template>
  <div>
    <div>提出人：</div>
    <div>提出时间：</div>
    <div>提出内容：</div>
<!--    填写反馈意见-->
    <el-form>
      <el-form-item>

      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary">确定</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdviseResponse",
  data(){
    return{
      adviseId:'',
      advise:{}
    }
  },
  created() {
    this.onGetAdvise()
  },
  methods:{
    onGetAdvise(){
      this.adviseId = this.$route.params.adviseId
      this.$http.get(this.formatString(this.$store.state.url.advise.detail,{
        id: this.adviseId
      })).then(({data: advise})=>{
        // advise.time = this.getChangedDate(notice.time)
        this.advise = advise;
        // this.currentRow.adminName = this.$route.params.adminName
      })
    }
  }
}
</script>

<style scoped>

</style>
