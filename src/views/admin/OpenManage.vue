<template>
    <div>
        <el-dialog :visible.sync="addDialog" size="tiny" width="600px" class="dialog">
            <el-form ref="form" :model="currentRow" label-width="80px">
                <el-form-item label="课程">
                    <el-col :span="21">
                        <el-select v-model="currentRow.cid" placeholder="请选择课程" @change="onGetTermTeachers">
                            <el-option
                                    v-for="item in courses"
                                    :key="item.no"
                                    :label="item.name"
                                    :value="item.no">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="教师">
                    <el-col :span="21">
                        <el-select v-model="currentRow.tid" placeholder="请选择教师">
                            <el-option
                                    v-for="item in termTeachers"
                                    :key="item.no"
                                    :label="item.name"
                                    :value="item.no">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="学期">
                    <el-col :span="21">
                        <el-select v-model="currentRow.term" placeholder="请选择学期">
                            <el-option
                                    v-for="item in terms"
                                    :key="item.no"
                                    :label="item.name"
                                    :value="item.no">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="上课时间">
                    <el-col :span="21">
                        <el-input v-model="currentRow.time"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="上课地点">
                    <el-col :span="21">
                        <el-input v-model="currentRow.location"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addDialog=false" size="small">
                    取消
                </el-button>
                <el-button @click="onCreateOpens" type="primary" size="small">
                    添加
                </el-button>
            </div>
        </el-dialog>

        <div class="panel">
            <panel-title title="开课管理">
                <el-button @click="onAddOpens" size="mini">
                    <i class="fa el-icon-plus"></i>
                    添加
                </el-button>
            </panel-title>
            <div class="panel-body" style="height: 1px">
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="searchNo" placeholder="课程号" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="searchName" placeholder="课程名" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
            </div>
            <div class="panel-body" style="height: 700px">
                <el-table empty-text="暂无数据" :data="opens" v-loading="loading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="cid" label="课程号" width="180"/>
                    <el-table-column align="center" prop="cname" label="课程名" width="180"/>
                    <el-table-column align="center" prop="credit" label="学分" width="180"/>
                    <el-table-column align="center" prop="tname" label="教师" width="180"/>
                    <el-table-column align="center" prop="tename" label="学期" width="180"/>
                    <el-table-column align="center" prop="time" label="上课时间" width="180"/>
                    <el-table-column align="center" prop="location" label="上课地点" width="180"/>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="props">
                            <el-button type="danger" size="mini" @click.native="onDeleteOpen(props.row.id)">
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
        name: 'OpenManage',
        data() {
            return {
                currentRow: {},
                addDialog: false,
                opens: {},
                terms: {},
                courses: {},
                termTeachers: {},
                searchName: '',
                searchNo: '',
                loading: false
            }
        },
        components: {
            PanelTitle,
        },
        created() {
            this.onGetOpens()
            this.onGetTerms()
            this.onGetCourses()
        },
        methods: {
            onRefresh() {
                this.onGetOpens()
            },
            onGetOpens(){
                this.$http.get(this.formatString(this.$store.state.url.open.allInfo, {
                    no: this.searchNo,
                    name: this.searchName
                })).then(({data: open}) => {
                    this.opens = open
                })
            },
            onGetCourses(){
                this.$http.get(this.formatString(this.$store.state.url.course.allInfo,{
                    no: '',
                    name: ''
                })).then(({data: courses}) => {
                    this.courses = courses
                })
            },
            onGetTerms(){
                this.$http.get(this.$store.state.url.term.allInfo)
                    .then(({data: terms}) => {
                        this.terms = terms
                    })
            },
            onGetTermTeachers(){
                let de;
                const cid = this.currentRow.cid;
                this.courses.forEach(function (item) {
                    if(item.no === cid)
                        de = item.departmentID;
                })
                this.$http.get(this.formatString(this.$store.state.url.teacher.search,{
                    de: de
                })).then(({data: teachers}) => {
                    this.termTeachers = teachers
                })
            },
            onAddOpens(){
                this.currentRow = {};
                this.addDialog = true;
            },
            onCreateOpens(){
                this.$http.post(this.$store.state.url.open.add, this.currentRow)
                    .then(() => {
                        this.$message.success("添加成功");
                        this.onRefresh();
                        this.addDialog = false
                    }).catch(() => {
                    this.$message.error("添加失败");
                    this.addDialog = false
                })
            },
            onDeleteOpen(id){
                this.$http.get(this.formatString(this.$store.state.url.open.del,{
                    id: id
                })).then(() => {
                    this.$message.success("删除成功");
                    this.onRefresh();
                }).catch(() => {
                    this.$message.error("删除失败");
                })
            }
        }
    }
</script>

<style>
</style>