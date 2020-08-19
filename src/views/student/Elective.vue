<template>
    <div>
        <div class="panel">
            <panel-title title="模糊查询"/>
            <div class="panel-body" style="height: 15px">
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="form.cno" placeholder="课程号" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="form.cname" placeholder="课程名" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="form.tno" placeholder="教师号" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="form.tname" placeholder="教师名" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
            </div>
        </div>

        <div class="panel" style="width: 48.5%; float: left">
            <panel-title title="已选课程"></panel-title>
            <div class="panel-body" style="height: 590px">
                <el-table empty-text="暂无数据" :data="ownCourse" v-loading="ownLoading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="cid" label="课程号" width="100"/>
                    <el-table-column align="center" prop="cname" label="课程名" width="150"/>
                    <el-table-column align="center" prop="credit" label="学分" width="80"/>
                    <el-table-column align="center" prop="time" label="上课时间" width="200"/>
                    <el-table-column align="center" prop="tname" label="任课教师" width="100"/>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="props">
                            <el-button type="danger" size="mini" @click="onDeleteCourse(props.row.id)">
                                <i class="fa fa-remove"></i>
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="panel" style="width: 50.5%; float: right">
            <panel-title title="可选课程"></panel-title>
            <div class="panel-body" style="height: 590px">
                <el-table empty-text="暂无数据" :data="enableCourse" v-loading="enableLoading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="cid" label="课程号" width="100"/>
                    <el-table-column align="center" prop="cname" label="课程名" width="150"/>
                    <el-table-column align="center" prop="credit" label="学分" width="80"/>
                    <el-table-column align="center" prop="time" label="上课时间" width="100"/>
                    <el-table-column align="center" prop="tname" label="任课教师" width="100"/>
                    <el-table-column align="center" prop="studentNumber" label="选课人数" width="100"/>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="props">
                            <el-button type="info" size="mini" @click="onChooseCourse(props.row.id)">
                                <i class="fa fa-check"></i>
                                选择
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
        name: 'Elective',
        data() {
            return {
                form: {
                    no: this.$store.state.auth.user,
                    tno: '',
                    tname: '',
                    cno: '',
                    cname: ''
                },
                ownLoading: false,
                enableLoading: false,
                enableCourse: {},
                ownCourse: {}
            }
        },
        components: {
            PanelTitle,
        },
        created() {
            this.onGetOwnCourse();
            this.onGetEnableCourse();
        },
        methods: {
            onRefresh() {
                this.onGetOwnCourse();
                this.onGetEnableCourse();
            },
            onGetOwnCourse() {
                this.ownLoading = true;
                this.$http.get(this.formatString(this.$store.state.url.student.ownCourse, {
                    no: this.$store.state.auth.user
                })).then(({data: courses}) => {
                    this.ownCourse = courses;
                    this.ownLoading = false
                }).catch(() => {
                    this.ownLoading = false
                })
            },
            onGetEnableCourse(){
                this.enableLoading = true;
                this.$http.post(
                    this.$store.state.url.student.enableCourse,
                    this.form
                ).then(({data: courses}) => {
                    this.enableCourse = courses;
                    this.enableLoading = false
                }).catch(() => {
                    this.enableLoading = false
                })
            },
            onDeleteCourse(no) {
                this.$http.get(this.formatString(this.$store.state.url.elective.del, {
                    sno: this.$store.state.auth.user,
                    cno: no
                })).then(() => {
                    this.$message.success("退课成功");
                    this.onRefresh();
                }).catch(() => {
                    this.$message.error("退课失败");
                })
            },
            onChooseCourse(no) {
                this.$http.post(this.$store.state.url.elective.choose, {
                    courseNo: no,
                    studentNo: this.$store.state.auth.user
                }).then(() => {
                    this.$message.success("选课成功");
                    this.onRefresh()
                }).catch(() => {
                    this.$message.error("选课失败");
                })
            }
        }
    }
</script>

<style>
</style>