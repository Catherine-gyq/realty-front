<template>
    <div>
        <div class="panel">
            <panel-title title="授课情况"/>
            <div class="panel-body" style="height: 1px">
                <el-select v-model="form.term" placeholder="请选择学期" @change="onRefresh">
                    <el-option
                            v-for="item in terms"
                            :key="item.no"
                            :label="item.name"
                            :value="item.no">
                    </el-option>
                </el-select>
            </div>
            <div class="panel-body" style="height: 700px">
                <el-table empty-text="暂无数据" :data="opens" v-loading="loading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="cid" label="课程号" width="200"/>
                    <el-table-column align="center" prop="cname" label="课程名" width="200"/>
                    <el-table-column align="center" prop="credit" label="学分" width="200"/>
                    <el-table-column align="center" prop="time" label="上课时间" width="250"/>
                    <el-table-column align="center" prop="location" label="上课地点" width="250"/>
                    <el-table-column align="center" prop="studentNumber" label="选课人数"/>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import PanelTitle from '../../components/PanelTitle'

    export default {
        name: 'OpenCourse',
        data() {
            return {
                form: {
                    term: '',
                    tno: this.$store.state.auth.user,
                    tname: '',
                    cno: '',
                    cname: ''
                },
                opens: {},
                terms: {},
                loading: false
            }
        },
        components: {
            PanelTitle,
        },
        created() {
            this.onGetTerms()
        },
        methods: {
            onRefresh() {
                this.onGetOpens()
            },
            onGetOpens(){
                this.$http.post(
                    this.$store.state.url.open.search,
                    this.form
                ).then(({data: open}) => {
                    this.opens = open
                })
            },
            onGetTerms(){
                this.$http.get(this.$store.state.url.term.allInfo)
                    .then(({data: terms}) => {
                        this.terms = terms
                    })
            }
        }
    }
</script>

<style>
</style>