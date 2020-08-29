<template>
  <el-container>
    <el-header>
      <div class="top-side">
        <el-row class="top-row">
          <el-col :span="5" style="height:100%;font-size: xx-large; color: #ffd700;" >
            <span style="top:50px; position:fixed; text-align: center;left: 100px;"> 社区门户网站</span>
          </el-col>
          <el-col :span="18" style="height: 100%;" >
            <!--   background-color="#545c64"     active-text-color="#ffd04b" -->
            <el-menu router :default-active="$route.path" class="top-menu" mode="horizontal"
                     background-color="#424f63"  text-color="#fff" active-text-color="#65cea7" >
              <el-menu-item class="menu-list" index="/notice/check">社区消息</el-menu-item>
              <el-menu-item class="menu-list" index="/activity/reserve">活动预约</el-menu-item>
              <el-menu-item class="menu-list" index="/repair/report">维修预约</el-menu-item>
<!--              <el-menu-item class="menu-list" index="/resident/vote">投票箱</el-menu-item>-->
              <el-menu-item class="menu-list" index="/resident/advise">意见箱</el-menu-item>
            </el-menu>
          </el-col>
<!--          <el-col :span="5" style="height: 100%; ">-->
<!--            <div style="bottom: 20px;position: absolute;">-->
<!--              <el-button type="text" @click.native="onAlterInfo()" style="margin-right: 10px;">-->
<!--                <i class="fa el-icon-edit"></i>-->
<!--                登录-->
<!--              </el-button>-->
<!--              <el-button type="text" @click.native="onDeleteStudent()" style="margin-left: 10px;">-->
<!--                <i class="fa fa-remove"></i>-->
<!--                注册-->
<!--              </el-button>-->
<!--            </div>-->
<!--          </el-col>-->
        </el-row>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: "Top"
  }
</script>

<style scoped>

</style>
