<template>
    <div class="panel">
        <panel-title title="修改密码"></panel-title>
        <div class="panel-body">
            <el-row>
                <el-col :span="8">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="原密码">
                            <el-input v-model="form.ori_pwd" placeholder="请输入原密码" size="small" type="password"/>
                        </el-form-item>
                        <el-form-item label="新密码">
                            <el-input v-model="form.password" placeholder="请输入新密码" size="small" type="password"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" @click="onSubmitForm" :loading="onSubmitLoading">
                                <i class="fa fa-check"></i>
                                修改
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import PanelTitle from '../../components/PanelTitle'

    export default {
        name: 'Password',
        data() {
            return {
                form: {
                    ori_pwd: '',
                    name: this.$store.state.auth.user,
                    password: '',
                    identity: this.$store.state.auth.identity
                },
                onSubmitLoading: false
            }
        },
        created() {
        },
        components: {
            PanelTitle
        },
        methods: {
            onSubmitForm() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.onSubmitLoading = true;
                    this.$http.post(
                        this.$store.state.url.auth.update,
                        this.form
                    ).then(() => {
                        this.$message.success("修改成功");
                        this.onSubmitLoading = false;
                        this.form.password = '';
                        this.form.ori_pwd = ''
                    }).catch(() => {
                        this.$message.error("修改失败");
                        this.onSubmitLoading = false
                        this.form.password = '';
                        this.form.ori_pwd = ''
                    })
                })
            }
        }
    }
</script>