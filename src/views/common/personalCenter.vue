<template>
  <div class="panel">
    <el-row>
      <el-col :span="8">
        <div class="center_display">
          <el-image style="border-radius: 50%;height: 200px;width: 200px;margin-top: 40px" src="http://localhost:8080/ActivityRoom/avatar.jpg"></el-image>
          <el-button style="margin-top: 40px">更新密码</el-button>
        </div>
      </el-col>
      <el-col :span="16">
        <el-form :model="personalInformation">
          <el-form-item label="姓名："></el-form-item>
          <el-form-item label="电话号码："></el-form-item>
          <el-form-item label="邮箱："></el-form-item>
          <el-form-item label="居住地点："></el-form-item>
          <el-form-item label="出生年月："></el-form-item>
          <el-form-item label="性别："></el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: "personalCenter",
  data(){
    return{
      personalInformation:{}
    }
  }
}
</script>

<style scoped>
.center_display{
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
