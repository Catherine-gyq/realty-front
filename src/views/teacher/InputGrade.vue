<template>
    <div>
        <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog">
            <el-form ref="form" :model="currentRow" label-width="80px">
                <el-form-item label="学号">
                    <el-col :span="21">
                        <el-input v-model="currentRow.no" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-col :span="21">
                        <el-input v-model="currentRow.name" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="学院">
                    <el-col :span="21">
                        <el-input v-model="currentRow.department" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="分数">
                    <el-col :span="21">
                        <el-input v-model="currentRow.grade"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editDialog=false" size="small">
                    取消
                </el-button>
                <el-button @click="onUploadedGrade" type="primary" size="small">
                    更新
                </el-button>
            </div>
        </el-dialog>

        <div class="panel">
            <panel-title title="当前学期成绩录入"/>
            <div class="panel-body" style="height: 15px">
                <el-select v-model="currentOpenID" placeholder="请选择课程" @change="onRefresh">
                    <el-option
                            v-for="item in opens"
                            :key="item.id"
                            :label="item.cname"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>

        <div class="panel">
            <panel-title title="选修学生名单"></panel-title>
            <div class="panel-body" style="height: 550px">
                <el-table empty-text="暂无数据" :data="grade" v-loading="loading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="no" label="学号" width="210"/>
                    <el-table-column align="center" prop="name" label="姓名" width="210"/>
                    <el-table-column align="center" prop="grade" label="成绩" width="210"/>
                    <el-table-column align="center" prop="sex" label="性别" width="210"/>
                    <el-table-column align="center" prop="department" label="专业" width="210"/>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="props">
                            <el-button type="info" size="mini" @click.native="onAlterGrade(props.row)">
                                <i class="fa el-icon-edit"></i>
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import PanelTitle from '../../components/PanelTitle'

    export default {
        name: 'InputGrade',
        data() {
            return {
                form: {
                    term: '201903',
                    tno: this.$store.state.auth.user,
                    tname: '',
                    cno: '',
                    cname: ''
                },
                currentRow: {},
                editDialog: false,
                grade: {},
                currentOpenID: null,
                opens: {},
                loading: false,
            }
        },
        components: {
            PanelTitle,
        },
        created() {
            this.onGetOpens();
        },
        methods: {
            onRefresh() {
                this.onGetGrade();
            },
            onGetGrade() {
                this.loading = true;
                this.$http.get(this.formatString(this.$store.state.url.course.allStudent, {
                    no: this.currentOpenID
                })).then(({data: grade}) => {
                    this.grade = grade;
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },
            onGetOpens(){
                this.$http.post(
                    this.$store.state.url.open.search,
                    this.form
                ).then(({data: open}) => {
                    this.opens = open
                })
            },
            onAlterGrade(row){
                this.currentRow = row;
                this.editDialog = true;
            },
            onUploadedGrade(){
                this.$http.post(this.$store.state.url.grade.update, {
                    id: this.currentRow.eid.toString(),
                    grade: this.currentRow.grade
                }).then(() => {
                    this.$message.success("录入成功");
                    this.onRefresh();
                    this.editDialog = false
                }).catch(() => {
                    this.$message.error("录入失败");
                    this.editDialog = false
                })
            }
        }
    }
</script>

<style>
</style>