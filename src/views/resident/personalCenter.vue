<template>
  <div class="personal" style="min-height: 800px;">
    <div v-if="!resetDialog">
      <el-row>
        <el-col :span="8">
          <div class="center_display">
            <el-upload
                class="avatar-uploader"
                action="/api/resident/upload"
                :data="{residentId: this.personalInformation.resident_id}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                name="image"
            >
              <img v-if="imageUrl" :src='imageUrl' class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-image style="border-radius: 50%;height: 200px;width: 200px;margin-top: 40px" src="http://localhost:8080/ActivityRoom/avatar.jpg"></el-image>
            <el-button style="margin-top: 40px;margin-bottom: 40px" @click="updatePassword">更新密码</el-button>
          </div>
        </el-col>
        <el-col :span="16">
          <el-form :model="personalInformation" style="margin-top: 50px" label-width="100px">
            <el-form-item label="姓名：">
              <el-input v-if="infoEdit" class="input_type" v-model="personalInformation.name"></el-input>
              <div v-else>
                {{personalInformation.name}}
                <el-popover placement="bottom" content="修改个人信息" trigger="hover">
                  <i style="margin-left: 20px;cursor: pointer" @click="editInfo" slot="reference" class="el-icon-edit"></i>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item label="电话号码：">{{personalInformation.tele}}</el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-if="infoEdit" class="input_type" v-model="personalInformation.mailBox"></el-input>
              <div v-else>
                {{personalInformation.mailBox}}
              </div>
            </el-form-item>
            <el-form-item label="居住地点：">
              <el-input v-if="infoEdit" class="input_type" v-model="personalInformation.address"></el-input>
              <div v-else>
                {{personalInformation.address}}
              </div>
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-if="infoEdit" v-model="personalInformation.sex" size="medium">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
              <div v-else>
                {{personalInformation.sex}}
              </div>
            </el-form-item>
            <div v-if="infoEdit" style="margin: 40px 0 0 100px">
              <el-button size="small" type="primary" @click="submitInfo">确定</el-button>
              <el-button size="small" @click="cancelEdit">取消</el-button>
            </div>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <!--    修改密码的部分 -->
    <div style="margin:20px 0 0 200px;" v-else>
      <div class="left_display">
        <div class="head_title">修改密码</div>
        <div>
          <el-button size="normal" style="margin-left: 20px" @click="cancelChange()">取消</el-button>
        </div>
      </div>
      <el-form label-width="160px" ref="confirmPassword" :rules="passwordRules" :model="form" class="left_display">
        <el-form-item label="请输入原来的密码：" prop="password">
          <el-input name="password" v-model="form.password"  placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <div>
          <el-button size="large" v-if="ifPassword!=='true'" style="margin-left: 40px" @click="getPassword()" type="primary">验证</el-button>
        </div>
        <div v-if="ifPassword==='true'" style="margin-left: 30px">
          <i class="el-icon-success" style="color: #67C23A"></i>
          验证成功
        </div>
        <div v-if="ifPassword==='false'" style="color: red;margin-left: 30px">
          <i class="el-icon-warning"></i>
          密码错误
        </div>
      </el-form>
      <el-form label-width="160px" v-if="ifPassword==='true'" :model="confirmForm" ref="newPasswords" :rules="changePassword" >
        <el-form-item label="请输入新的密码：" attr="newPassword" prop="newPassword">
          <el-input style="width: 400px" name="password" v-model="confirmForm.newPassword" show-password placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" attr="passwordConfirm" prop="passwordConfirm">
          <el-input style="width: 400px" v-model="confirmForm.passwordConfirm" show-password placeholder="请再次输入密码" type="password"></el-input>
        </el-form-item>
        <div style="width: 500px;margin-top: 40px" class="center_row_display">
          <el-button type="primary" @click="setPassword()">确定</el-button>
        </div>
      </el-form>
    </div>
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
      form:{
        password: '',
      },
      confirmForm:{
        newPassword:'',
        passwordConfirm:''
      },
      ifPassword:'unknown',
      passwordRules:{
        password:[{required: true, trigger: 'blur', message:'请输入您原本的密码'}],
      },
      changePassword: {
        newPassword: { required: true, message: '请设置相应密码', trigger: 'blur' },
        passwordConfirm:{required:true,validator: this.passConfirm,message:'两次输入密码需一致',trigger:'blur'},
      },
      infoEdit:false,
      imageUrl:''
    }
  },
  created(){
    this.getUsrInfo()
  },
  methods:{
    //获取用户信息
    getUsrInfo(){
      this.$http.get(this.formatString(this.$store.state.url.resident.usr,{
        tele: this.$store.state.auth.user
      })).then(({data: usr})=>{
        this.personalInformation = usr;
        console.log(this.personalInformation)
        this.imageUrl = this.personalInformation.avatar;
        this.imageUrl = this.imageUrl+'?rnd='+Math.random()
        this.$store.commit('setId', this.personalInformation.resident_id);
      })
    },
    //  打开更新密码的dialog
    updatePassword(){
      this.resetDialog=true;
    },
    onRefresh(){
      this.getUsrInfo()
    },
    //确认代码是否正确
    getPassword(){
      let body={
        username:this.$store.state.auth.user,
        identity:this.$store.state.auth.identity,
        password: this.form.password
      }
      console.log(body)
      this.$refs['confirmPassword'].validate((valid)=>{
        if (valid){
          this.$http.post(this.$store.state.url.auth.login,body)
              .then(({data: result}) => {
                if (result===2){
                  this.ifPassword = 'true'
                }else if (result===1){
                  this.ifPassword = 'false'
                }
              })
        }
      })
    },
    passConfirm (rule, value, callback) {
      if (value.length === 0) {
        callback('不能为空')
      } else if (value !== this.confirmForm.newPassword) {
        callback('密码与确认密码不匹配，请重新输入')
      }
      else {
        callback()
      }
    },
    //设置新的密码
    setPassword(){
      let body={
        username:this.$store.state.auth.user,
        password:this.confirmForm.newPassword,
        identity: this.$store.state.auth.identity
      }
      this.$refs['newPasswords'].validate((valid)=>{
        if (valid){
          this.$http.post(this.$store.state.url.auth.update,body)
              .then(()=> {
                this.$message.success("修改成功");
                this.$router.push({name:'login'})
              })
              .catch(()=>{
                this.$message.error("修改失败");
              })
        }
      })
    },
    //  取消修改
    cancelChange(){
      this.resetDialog=false
      this.ifPassword = 'unknown'
      this.$refs['confirmPassword'].resetFields()
      this.$refs['newPasswords'].resetFields()
    },
    //编辑信息
    editInfo(){
      this.infoEdit=true;
    },
    //分类用户和管理员提交
    submitInfo(){
      let body={
        id:this.personalInformation.resident_id,
        tele:this.personalInformation.tele,
        name:this.personalInformation.name,
        sex:this.personalInformation.sex,
        address:this.personalInformation.address,
        mailBox:this.personalInformation.mailBox
      }
      this.$http.post(this.$store.state.url.resident.update,body)
          .then(() => {
            this.$message.success("修改成功");
            this.infoEdit=false;
          }).catch(() => {
        this.$message.error("修改失败");
      })
    },
    cancelEdit(){
      this.infoEdit=false;
    },
    handleAvatarSuccess(res, file) {
      this.onRefresh()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style scoped>
.personal{
  top: 200px;
  position: absolute;
  width: 95%;
  /*background-color: #ffffff;*/
  margin: 0 40px 0 40px;
}
.center_display{
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
}
.center_row_display{
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: row;
}
.left_display{
  display: flex;
  justify-content: flex-start;
  /*align-content:center;*/
  /*align-items: center;*/
  flex-direction: row;
}
.head_title{
  font-size: 20px;
  margin-bottom: 30px;
}
.input_type{
  width: 280px;
}
</style>
