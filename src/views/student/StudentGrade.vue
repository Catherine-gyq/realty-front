<template>
    <div>
        <div class="panel">
            <panel-title title="学生信息"></panel-title>
            <div class="panel-body" style="height: 20px">
                <div style="float: left; width: 20%">
                    <el-select v-model="currentStudentID" placeholder="请选择" filterable size="small" @change="onRefresh">
                        <el-option v-for="item in students" :key="item.no" :label="item.name" :value="item.no"></el-option>
                    </el-select>
                </div>
                <div style="float: right; width: 80%">
                    <el-form ref="form" :model="currentStudent" label-width="40px" label-position="left">
                        <el-row type="flex">
                            <el-col><el-form-item label="学号">{{ currentStudent.no }}</el-form-item></el-col>
                            <el-col><el-form-item label="姓名">{{ currentStudent.name }}</el-form-item></el-col>
                            <el-col><el-form-item label="性别">{{ currentStudent.sex }}</el-form-item></el-col>
                            <el-col><el-form-item label="学院">{{ currentStudent.department }}</el-form-item></el-col>
                            <el-col><el-form-item label="年龄">{{ currentStudent.age }}</el-form-item></el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="panel">
            <panel-title title="已修课程成绩单"></panel-title>
            <div class="panel-body" style="height: 400px">
                <el-table empty-text="暂无数据" :data="grade" v-loading="loading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="no" label="课程号" width="230"/>
                    <el-table-column align="center" prop="name" label="课程名" width="230"/>
                    <el-table-column align="center" prop="grade" label="成绩" width="230"/>
                    <el-table-column align="center" prop="redit" label="学分" width="230"/>
                    <el-table-column align="center" prop="teacher" label="任课教师" width="230"/>
                </el-table>
            </div>
        </div>
        <div class="panel">
            <panel-title title="平均成绩"></panel-title>
            <div class="panel-body" style="height: 20px">
                <span><P style="color: red; font-size: larger;">{{ averageGrade }}</P></span>
            </div>
        </div>
    </div>
</template>

<script>
    import PanelTitle from '../../components/PanelTitle'

    export default {
        name: 'StudentGrade',
        data() {
            return {
                grade: {},
                currentStudentID: null,
                currentStudent: {},
                students: {},
                loading: false,
                averageGrade: null
            }
        },
        components: {
            PanelTitle,
        },
        created() {
            this.onGetStudents();
        },
        methods: {
            onRefresh() {
                this.onGetGrade();
                this.onGetStudentInfo();
            },
            onGetGrade() {
                this.loading = true;
                this.$http.get(this.formatString(this.$store.state.url.grade.studentGrade, {
                    no: this.currentStudentID
                })).then(({data: grade}) => {
                    this.grade = grade;
                    this.onGetAvg();
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },
            onGetStudents(){
                this.$http.get(this.$store.state.url.student.allInfo)
                    .then(({data: students}) => {
                        this.students = students
                    })
            },
            onGetStudentInfo(){
                this.$http.get(this.formatString(this.$store.state.url.student.oneInfo,{
                    no: this.currentStudentID
                })).then(({data: info}) => {
                    this.currentStudent = info;
                })
            },
            onGetAvg(){
                const len = this.grade.length;
                let sum = 0;
                for(let i=0; i < len; i++)
                    sum += parseInt(this.grade[i].grade);
                const temp = (sum / len).toFixed(2);
                if (isNaN(temp))
                    this.averageGrade = 0;
                else
                    this.averageGrade = temp;
            }
        }
    }
</script>

<style>
</style>