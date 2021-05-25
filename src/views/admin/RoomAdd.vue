<template>
  <div>
    <el-form :rules="roomRules" ref="roomRules" :model="roomData" label-width="100px">
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
            action="https://jsonplaceholder.typicode.com/posts/"
            >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="cancelEdit" size="small">
        取消
      </el-button>
      <el-button v-if="ifAdd" @click="onCreateRoom" type="primary" size="small">
        添加
      </el-button>
      <el-button v-else @click="onUpdateRoom" type="primary" size="small">
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
      roomData:{}
    }
  },
  created() {
    this.onGetRoom()
  },
  methods:{
    //获取房间的具体信息
    onGetRoom(){

    }
  }

}
</script>

<style scoped>

</style>
