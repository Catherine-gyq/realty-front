<template>
    <div>

        <!--编辑教师信息-->
        <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog">
            <el-form ref="form" :model="currentRow" label-width="80px">
                <el-form-item label="工号">
                    <el-col :span="21">
                        <el-input v-model="currentRow.no" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-col :span="21">
                        <el-input v-model="currentRow.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="性别">
                    <el-col :span="21">
                        <el-input v-model="currentRow.sex"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="出生年月">
                    <el-col :span="21">
                        <el-date-picker
                                v-model="currentRow.birthday"
                                type="date"
                                placeholder="选择出生年月"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="职称">
                    <el-col :span="21">
                        <el-input v-model="currentRow.education"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="学院">
                    <el-col :span="21">
                        <el-select v-model="currentRow.departmentID" placeholder="请选择所属学院">
                            <el-option
                                    v-for="item in departments"
                                    :key="item.no"
                                    :label="item.name"
                                    :value="item.no">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="学院">
                    <el-col :span="21">
                        <el-button @click="onResetPwd" type="primary" size="medium">重置密码</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editDialog=false" size="small">
                    取消
                </el-button>
                <el-button @click="onUploadedTeacher" type="primary" size="small">
                    更新
                </el-button>
            </div>
        </el-dialog>
        <!--添加教师信息-->
        <el-dialog :visible.sync="addDialog" size="tiny" width="600px" class="dialog">
            <el-form ref="form" :model="currentRow" label-width="80px">
                <el-form-item label="工号">
                    <el-col :span="21">
                        <el-input v-model="currentRow.no"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-col :span="21">
                        <el-input v-model="currentRow.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="性别">
                    <el-col :span="21">
                        <el-input v-model="currentRow.sex"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="出生年月">
                    <el-col :span="21">
                        <el-date-picker
                                v-model="currentRow.birthday"
                                type="date"
                                placeholder="选择出生年月"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="职称">
                    <el-col :span="21">
                        <el-input v-model="currentRow.education"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="学院">
                    <el-col :span="21">
                        <el-select v-model="currentRow.departmentID" placeholder="请选择所属学院">
                            <el-option
                                    v-for="item in departments"
                                    :key="item.no"
                                    :label="item.name"
                                    :value="item.no">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addDialog=false" size="small">
                    取消
                </el-button>
                <el-button @click="onCreateTeacher" type="primary" size="small">
                    添加
                </el-button>
            </div>
        </el-dialog>

        <div class="panel">
            <panel-title title="教师信息管理">
                <el-button @click="onAddTeacher" size="mini">
                    <i class="fa el-icon-plus"></i>
                    添加
                </el-button>
            </panel-title>
            <div class="panel-body" style="height: 1px">
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="searchNo" placeholder="工号" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="searchName" placeholder="姓名" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
            </div>
            <div class="panel-body" style="height: 700px">
                <el-table empty-text="暂无数据" :data="teachers" v-loading="loading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="no" label="工号" width="190"/>
                    <el-table-column align="center" prop="name" label="姓名" width="190"/>
                    <el-table-column align="center" prop="sex" label="性别" width="190"/>
                    <el-table-column align="center" prop="department" label="学院" width="190"/>
                    <el-table-column align="center" prop="education" label="职称" width="190"/>
                    <el-table-column align="center" prop="birthday" label="出生年月" width="200"/>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="props">
                            <el-button type="info" size="mini" @click.native="onAlterInfo(props.row)">
                                <i class="fa el-icon-edit"></i>
                                编辑
                            </el-button>
                            <el-button type="danger" size="mini" @click.native="onDeleteTeacher(props.row.no)">
                                <i class="fa fa-remove"></i>
                                删除
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
        name: 'TeacherManage',
        data() {
            return {
                currentRow: {},
                addDialog: false,
                editDialog: false,
                teachers: {},
                departments: {},
                searchName: '',
                searchNo: '',
                loading: false
            }
        },
        components: {
            PanelTitle,
        },
        created() {
            this.onGetTeachers()
            this.onGetDepartment()
        },
        methods: {
            onRefresh() {
                this.onGetTeachers()
            },
            onGetTeachers(){
                this.$http.get(this.formatString(this.$store.state.url.teacher.allInfo, {
                    no: this.searchNo,
                    name: this.searchName
                })).then(({data: teachers}) => {
                    this.teachers = teachers
                })
            },
            onGetDepartment(){
                this.$http.get(this.$store.state.url.department.allInfo)
                    .then(({data: department}) => {
                        this.departments = department
                    })
            },
            onAlterInfo(row){
                this.currentRow = row;
                this.editDialog = true;
            },
            onUploadedTeacher(){
                this.$http.post(this.$store.state.url.teacher.update, this.currentRow)
                    .then(() => {
                        this.$message.success("修改成功");
                        this.onRefresh();
                        this.editDialog = false
                    }).catch(() => {
                    this.$message.error("修改失败");
                    this.editDialog = false
                })
            },
            onAddTeacher(){
                this.currentRow = {};
                this.addDialog = true;
            },
            onCreateTeacher(){
                this.$http.post(this.$store.state.url.teacher.add, this.currentRow)
                    .then(() => {
                        this.$message.success("添加成功");
                        this.onRefresh();
                        this.addDialog = false
                    }).catch(() => {
                    this.$message.error("添加失败");
                    this.addDialog = false
                })
            },
            onDeleteTeacher(no){
                this.$http.get(this.formatString(this.$store.state.url.teacher.del,{
                    no: no
                })).then(() => {
                    this.$message.success("删除成功");
                    this.onRefresh();
                    this.editDialog = false
                }).catch(() => {
                    this.$message.error("删除失败");
                    this.editDialog = false
                })
            },
            onResetPwd(){
                this.$http.get(this.formatString(this.$store.state.url.auth.reset,{
                    username: this.currentRow.no,
                    identity: 'teacher'
                })).then(() => {
                    this.$message.success("重置成功");
                    this.editDialog = false
                }).catch(() => {
                    this.$message.error("重置失败");
                    this.editDialog = false
                })
            }
        }
    }
</script>

<style>
</style>
