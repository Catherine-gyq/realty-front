<template>
	<div id="user">
		<el-dropdown size="mini" split-button type="primary">
			<span>{{ $store.getters.user }}</span>
			<el-dropdown-menu slot="dropdown">
        <el-dropdown-item >
          <i class="el-icon-user"></i>
          <span @click="onUsr">个人中心</span>
        </el-dropdown-item>
				<el-dropdown-item>
          <i class="el-icon-warning"></i>
          <span @click="onLogout">注销</span>
        </el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>

<script>
	export default {
		components: {
		},
		name: 'User',
		methods: {
      onUsr(){
        if (this.$store.state.auth.identity ==='resident'){
          this.$router.push({name:'residentPersonalCenter'})
        }else{
          this.$router.path({name:'adminPersonalCenter'})
        }
      },
			onLogout() {
				this.$store.commit('clearToken')
				this.$router.push({path: '/login'})
			},
		}
	}
</script>

<style lang="scss">
	#user {
		display: inline-block;
		margin-top: 15px;
		margin-right: 240px;
		cursor: pointer;
		.el-button {
			margin: 0 !important;
			border-right: none;
		}
	}
</style>
