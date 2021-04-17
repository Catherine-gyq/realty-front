<template>
	<div id="login">
		<el-form :rules="rules" label-width="100px" class="form" :model="form" ref="form">
			<div class="title">
<!--				<img src="../../assets/images/logo.png" alt="ems">-->
        社区管理网站
			</div>
			<div class="title">
				<el-radio v-model="form.identity" label="resident">住户</el-radio>
				<el-radio v-model="form.identity" label="admin">管理员</el-radio>
<!--        <el-radio v-model="form.identity" label="super_admin">超级管理员</el-radio>-->
<!--				<el-radio v-model="form.identity" label="admin">管理员</el-radio>-->
			</div>
			<el-form-item label="用户名" prop="username" class="item">
				<el-input v-model="form.username" ref="username" autocomplete="off"/>
			</el-form-item>
			<el-form-item label="密码" prop="password" class="item">
				<el-input :type="type.password" v-model="form.password" autocomplete="off" ref="password"/>
				<span class="display" @click="onShowPassword">
					<span class="el-icon-view"></span>
				</span>

			</el-form-item>
			<el-form-item :label="null" class="submit">
				<el-button type="primary" class="btn btn-login" :loading="loading" @click.native.prevent="onLogin">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			const validateUsername = (rule, value, callback) => {
				if (!value || value.length === 0) {
					callback(new Error('请输入用户名'))
				} else {
					callback()
				}
			};
			const validatePassword = (rule, value, callback) => {
				if (!value || value.length === 0) {
					callback(new Error('请输入密码'))
				} else {
					callback()
				}
			};
			return {
				form: {
					username: null,
					password: null,
					identity: 'resident'
				},
				rules: {
					username: [{required: true, trigger: 'blur', validator: validateUsername}],
					password: [{required: true, trigger: 'blur', validator: validatePassword}]
				},
				type: {
					password: 'password'
				},
				loading: false
			}
		},
		methods: {
			// 显示密码，不用动
			onShowPassword() {
				if (this.type.password === 'password') {
					this.$set(this.type, 'password', '')
				} else {
					this.$set(this.type, 'password', 'password')
				}
				this.$nextTick(() => {
					this.$refs.password.focus()
				})
			},

			// 登录
			onLogin() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.loading = true;
						this.$http.post(this.$store.state.url.auth.login, this.form
						).then(({data: result}) => {
							if (result===2) {
								// 登录成功则保存用户名、权限信息并跳转页面
								this.$store.commit('setUser', this.form.username);
								this.$store.commit('setIdentity', this.form.identity);
								if (this.form.identity === "resident"){ this.$router.push({name: 'NoticeCheck'});}
								else {this.$router.push({name:'AdminManage'});}
                this.loading = false;
							} else if (result===1) {
								this.loading = false;
								this.$message.error('用户密码错误!')
							}else if (result===0){
                this.loading = false;
                this.$message.error('不存在该用户！')
              }
						})
					} else {
						return false
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	$background-color: #283443;
	$width-form: 400px;
	$width-label: 100px;
	#login {
		height: 100%;
		width: 100%;
		background-color: $background-color;
		.form {
			width: $width-form;
			margin: auto;
			padding-top: 200px;
			.title {
				width: 100%;
				margin-bottom: 20px;
				text-align: center;
        font-size:50px;
        color: #FFD700;
				//image {
				//	width: 80%;
				//}
			}
			.item {
				border: 1px solid rgba(255, 255, 255, 0.1);
				background: rgba(0, 0, 0, 0.1);
				.el-form-item__label::before {
					content: '';
				}
				.el-form-item__label {
					text-align: left;
					padding-left: 20px;
				}
				input {
					background: transparent;
					border: 0;
					-webkit-appearance: none;
					border-radius: 0;
					color: #eee;
					caret-color: #fff;
				}
				.el-form-item__error {
					left: -$width-label;
				}
				.display {
					position: absolute;
					right: 10px;
					color: #606266;
					cursor: pointer;
				}
			}
			.submit {
				margin-top: 5px;
				.el-form-item__content {
					margin-left: 0 !important;
				}
				.btn {
					&.btn-login {
						width: 100%;
					}
				}
			}
		}
	}
</style>
