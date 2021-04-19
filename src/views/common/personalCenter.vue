<template>
  <div class="panel">
    <el-row>
      <el-col :span="8">
        <div class="center_display">
          <el-image style="border-radius: 50%;height: 200px;width: 200px;margin-top: 40px" src="http://localhost:8080/ActivityRoom/avatar.jpg"></el-image>
          <el-button style="margin-top: 40px;margin-bottom: 40px" @click="updatePassword">更新密码</el-button>
        </div>
      </el-col>
      <el-col :span="16">
        <el-form :model="personalInformation">
          <div v-if="usrIdentity==='resident'">
            <el-form-item label="姓名：">{{personalInformation.name}}</el-form-item>
            <el-form-item label="电话号码：">{{personalInformation.tele}}</el-form-item>
            <el-form-item label="邮箱：">{{personalInformation.mailBox}}</el-form-item>
            <el-form-item label="居住地点：">{{personalInformation.address}}</el-form-item>
            <el-form-item label="出生年月：">{{personalInformation.dateOfBirth}}</el-form-item>
            <el-form-item label="性别：">{{personalInformation.sex}}</el-form-item>
          </div>
          <div v-else>
            <el-form-item label="姓名：">{{personalInformation.admin_name}}</el-form-item>
            <el-form-item label="电话号码：">{{personalInformation.admin_tele}}</el-form-item>
            <el-form-item label="邮箱：">{{personalInformation.mailBox}}</el-form-item>
<!--            <el-form-item label="居住地点：">{{personalInformation.}}</el-form-item>-->
            <el-form-item label="出生年月：">{{personalInformation.dateOfBirth}}</el-form-item>
            <el-form-item label="性别：">{{personalInformation.admin_sex}}</el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="resetDialog" size="tiny" width="600px" class="dialog" >
      <el-form>
        <el-form-item label="密码：" attr="password">
          <el-input name="password" v-model="confirmForm.password"  placeholder="请输入密码" show-password type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" attr="passwordConfirm" v-if="!ifUpdate">
          <el-input v-model="confirmForm.passwordConfirm"  placeholder="请再次输入密码" show-password type="password"></el-input>
        </el-form-item>
        <el-button @click="getPassword()">确定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "personalCenter",
  data(){
    return{
      personalInformation:{},
      usrIdentity:this.$store.state.auth.identity,
      resetDialog:false,
      confirmForm:{
        password:'',
        passwordConfirm:''
      }
    }
  },
  created(){
    this.getUsrInfo()
  },
  methods:{
    //获取用户信息
    getUsrInfo(){
      if (this.$store.state.auth.identity==="resident"){
        this.$http.get(this.formatString(this.$store.state.url.resident.usr,{
          tele: this.$store.state.auth.user
        })).then(({data: usr})=>{
          this.personalInformation = usr[0];
          this.$store.commit('setId', this.personalInformation.resident_id);
        })
      }else{
      //用户为管理员或者超级管理员
        this.$http.get(this.formatString(this.$store.state.url.admin.usr,{
          tele: this.$store.state.auth.user
        })).then(({data: usr})=>{
          this.personalInformation = usr[0];
          this.$store.commit('setId', this.personalInformation.admin_id);
        })
      }
    },
  //  打开更新密码的dialog
    updatePassword(){
      this.resetDialog=true;
    },

    //确认代码是否正确
    getPassword(){

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
