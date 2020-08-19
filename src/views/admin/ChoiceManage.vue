<template>
    <div>
        <div class="panel">
            <panel-title title="选课管理"/>
            <div class="panel-body" style="height: 700px">
                <el-table empty-text="暂无数据" :data="terms" v-loading="loading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="name" label="学期" width="400"/>
                    <el-table-column align="center" label="选课状态" width="400">
                        <template slot-scope="props">
                            <el-switch
                                    v-model="terms[props.$index].choice"
                                    active-color="#13ce66"
                                    inactive-color="#60BCFE"
                                    :active-value="true"
                                    :inactive-value="false"
                                    active-text="开启选课"
                                    inactive-text="关闭选课"
                                    @change="onUpdateOpenAndTerm(props.row)">
                            </el-switch>
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
        name: 'ChoiceManage',
        data() {
            return {
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
                this.onGetTerms()
            },
            onGetTerms(){
                this.$http.get(this.$store.state.url.term.allInfo)
                    .then(({data: terms}) => {
                        this.terms = terms
                    })
            },
            onUpdateOpenAndTerm(row){
                this.$http.post(this.$store.state.url.open.update, row)
                    .then(() => {
                        if(row.choice)
                            this.$message.success("选课开启");
                        else
                            this.$message.success("选课关闭");
                    }).catch(() => {
                    this.$message.error("修改失败");
                })
            }
        }
    }
</script>

<style>
</style>