<template>
  <div class="panel" style="min-height: 900px">
    <el-form style="margin:30px 200px 0 20px" :rules="roomRules" ref="roomRules" :model="roomData" label-width="100px">
      <el-form-item label="房间用途" prop="room_usage">
        <el-col :span="21">
          <el-input v-model="roomData.room_usage"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="房间地址" prop="room_address">
        <el-col :span="21">
          <el-input v-model="roomData.room_address"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="房间容量" prop="room_num">
        <el-col :span="21">
          <el-input v-model="roomData.room_num"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="房间描述" prop="description">
        <el-col :span="21">
          <el-input v-model="roomData.description" type="textarea"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="描述图片" prop="description">
        <el-upload
            class="upload-demo"
            drag
            :show-file-list="false"
            action="/api/room/upload"
            >
          <img v-if="imageUrl" :src='imageUrl' class="avatar">
<!--          <i  class="el-icon-plus avatar-uploader-icon"></i>-->
          <i v-else class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="center_display">
      <el-button @click="cancelEdit" style="margin-right: 50px">
        取消
      </el-button>
      <el-button v-if="ifAdd" @click="onCreateRoom" type="primary">
        添加
      </el-button>
      <el-button v-else @click="onUpdateRoom" type="primary">
        更新
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomAdd",
  data(){
    return{
      ifAdd:false,
      roomData:{},
      roomId:'',
      imageUrl:'',
      roomRules: {
        room_usage: [{required: true, trigger: 'blur', message:'请输入房间用途'}],
        room_address: [{required: true, trigger: 'blur', message:'请输入房间地址'}],
        room_num: [{required: true, trigger: 'blur', message:'请输入房间'}],
        description:[{required: true, trigger: 'blur', message:'请输入房间描述'}]
      },
    }
  },
  created() {
    this.onGetRoom()
  },
  methods:{
    //获取房间的具体信息
    onGetRoom(){
      console.log(this.$route.query.roomId)
      if (this.$route.query.roomId){
        this.roomId = this.$route.query.roomId
      }else{
        this.ifAdd = true
      }
      let body={
        roomId:this.roomId
      }
      this.$http.get(this.formatString(this.$store.state.url.room.detail, body)).then(({data: data}) => {
        console.log(data)
        this.roomData = data
        this.imageUrl = data.picture
      })
    },
    cancelEdit(){
      this.$router.push({name:'RoomManage'})
    },
    //创建房间信息
    onCreateRoom(){
      this.$refs['roomRules'].validate((valid)=>{
        if (valid){
          this.$http.post(this.$store.state.url.room.add, this.roomData)
              .then(() => {
                this.$message.success("添加成功");
                this.$router.push({name:'RoomManage'})
              }).catch(() => {
              this.$message.error("添加失败");
          })
        }})
    },
    //更新房间信息
    onUpdateRoom(){
      this.$refs['roomRules'].validate((valid)=>{
        if (valid){
          console.log(this.roomData)
          let body={
            id:this.roomData.room_id,
            usage:this.roomData.room_usage,
            num:this.roomData.room_num,
            address:this.roomData.room_address,
            description: this.roomData.description,
            picture: this.roomData.picture
          }
          this.$http.post(this.$store.state.url.room.update, body)
              .then(() => {
                this.$message.success("修改成功");
                this.$router.push({name:'RoomManage'})
              }).catch(() => {
                this.$message.error("修改失败");
          })
        }})
    }
  }

}
</script>

<style scoped>
.center_display{
  display: flex;
  justify-content: center;
  margin-top: 150px;
  align-content: center;
  align-items: center;
  flex-direction: row;
}

</style>
