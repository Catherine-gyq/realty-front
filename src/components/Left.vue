<template>
	<div class="left-side">
		<div class="left-side-inner">
			<router-link to="/home" class="logo block">
				<p style="font-size: xx-large; color: yellow; margin-left: 35px">C <span style="color: black">M</span> S
					<span style="color: white; font-size: small">社区管理</span></p>
			</router-link>
			<el-menu class="menu-box" theme="dark" router :default-active="$route.path">
				<el-menu-item class="menu-list" index="/resident/manage" v-if="$store.state.auth.identity === 'admin'">
					<i class="icon el-icon-user"></i>
					<span class="text">居民信息管理</span>
				</el-menu-item>
				<el-menu-item class="menu-list" index="/notice/manage" v-if="$store.state.auth.identity === 'admin'">
					<i class="icon el-icon-user-solid"></i>
					<span class="text">社区消息管理</span>
				</el-menu-item>
        <el-menu-item class="menu-list" index="/repairReserve/manage" v-if="$store.state.auth.identity === 'admin'">
          <i class="icon el-icon-user"></i>
          <span class="text">维修预约信息管理</span>
        </el-menu-item>
				<el-menu-item class="menu-list" index="/open/manage" v-if="$store.state.auth.identity === 'admin'">
					<i class="icon el-icon-user-solid"></i>
					<span class="text">开课管理</span>
				</el-menu-item>
				<el-menu-item class="menu-list" index="/choice/manage" v-if="$store.state.auth.identity === 'admin'">
					<i class="icon el-icon-user-solid"></i>
					<span class="text">选课管理</span>
				</el-menu-item>
				<el-menu-item class="menu-list" index="/teacher/open" v-if="$store.state.auth.identity === 'teacher'">
					<i class="icon el-icon-user-solid"></i>
					<span class="text">授课情况</span>
				</el-menu-item>
				<el-menu-item class="menu-list" index="/teacher/input" v-if="$store.state.auth.identity === 'teacher'">
					<i class="icon fa fa-hdd-o"></i>
					<span class="text">成绩录入</span>
				</el-menu-item>
				<el-menu-item class="menu-list" index="/student/elective" v-if="$store.state.auth.identity === 'student'">
					<i class="icon fa fa-television"></i>
					<span class="text">学生选课</span>
				</el-menu-item>
				<el-menu-item class="menu-list" index="/student/grade" v-if="$store.state.auth.identity === 'student'">
					<i class="icon fa fa-folder-o"></i>
					<span class="text">成绩单</span>
				</el-menu-item>
				<el-menu-item class="menu-list" index="/common/password" v-if="$store.state.auth.identity !== 'admin'">
					<i class="icon el-icon-user-solid"></i>
					<span class="text">修改密码</span>
				</el-menu-item>
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
