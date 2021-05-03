<template>
	<div class="left-side">
		<div class="left-side-inner">
			<router-link to="/home" class="logo block">
				<p style="font-size: xx-large; color: yellow; margin-left: 35px">C <span style="color: black">M</span> S
					<span style="color: white; font-size: small">社区管理</span></p>
			</router-link>
			<el-menu class="menu-box" theme="dark" router :default-active="$route.path">
        <el-menu-item class="menu-list" index="/admin/manage" v-if="$store.state.auth.identity === 'admin'">
          <i class="icon el-icon-user-solid"></i>
          <span class="text">管理员信息管理</span>
        </el-menu-item>
				<el-menu-item class="menu-list" index="/resident/manage" v-if="$store.state.auth.identity === 'admin'">
					<i class="icon el-icon-user"></i>
					<span class="text">居民信息管理</span>
				</el-menu-item>
				<el-menu-item class="menu-list" index="/notice/manage" v-if="$store.state.auth.identity === 'admin'">
					<i class="icon el-icon-chat-dot-square"></i>
					<span class="text">社区消息管理</span>
				</el-menu-item>
        <el-menu-item class="menu-list" index="/repairReserve/manage" v-if="$store.state.auth.identity === 'admin'">
          <i class="icon el-icon-setting"></i>
          <span class="text">维修预约信息管理</span>
        </el-menu-item>
        <el-menu-item class="menu-list" index="/activity/manage" v-if="$store.state.auth.identity === 'admin'">
          <i class="icon el-icon-collection-tag"></i>
          <span class="text">活动预约管理</span>
        </el-menu-item>
        <el-menu-item class="menu-list" index="/advise/manage" v-if="$store.state.auth.identity === 'admin'">
          <i class="icon el-icon-reading"></i>
          <span class="text">意见箱管理</span>
        </el-menu-item>
<!--        <el-menu-item class="menu-list" index="/common/personalCenter">-->
<!--          <i class="icon el-icon-s-home"></i>-->
<!--          <span class="text">个人中心</span>-->
<!--        </el-menu-item>-->
			</el-menu>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Left',
	}
</script>

<style scoped>
	.left-side .logo {
		text-align: left !important;
	}

	.left-side .logo img {
		width: 150px;
		margin-left: 10px;
	}

	.left-side .el-menu {
		border-right: none;
	}
</style>
