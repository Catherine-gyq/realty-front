<template>
    <div>

<!--        修改信息  注意判断，只有原发布人才能够修改-->
        <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog">
            <el-form ref="form" :model="currentRow" label-width="80px">
                <el-form-item label="消息标题">
                    <el-col :span="21">
                        <el-input v-model="currentRow.title" ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-col :span="21">
                        <el-input v-model="currentRow.time" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="发布人">
                  <el-col :span="21">
                    <el-input v-model="currentRow.people" disabled></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="消息内容">
                    <el-col :span="21" >
                        <el-input v-model="currentRow.content" type="textarea" :autosize="{minRows: 2, maxRows: 10}"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editDialog=false" size="small">
                    取消
                </el-button>
                <el-button @click="onUploadedNotice" type="primary" size="small">
                    更新
                </el-button>
            </div>
        </el-dialog>


        <!--添加信息-->
        <el-dialog :visible.sync="addDialog" size="tiny" width="600px" class="dialog">
            <el-form ref="form" :model="currentRow" label-width="80px">
              <el-form-item label="消息标题">
                <el-col :span="21">
                  <el-input v-model="currentRow.title" ></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-col :span="21">
                  <el-input v-model="currentRow.time" disabled></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="发布人">
                <el-col :span="21">
                  <el-input v-model="currentRow.people" disabled></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="消息内容">
                <el-col :span="21" >
                  <el-input v-model="currentRow.content" type="textarea" :autosize="{minRows: 2, maxRows: 10}"></el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addDialog=false" size="small">
                    取消
                </el-button>
                <el-button @click="onCreateNotice" type="primary" size="small">
                    添加
                </el-button>
            </div>
        </el-dialog>



        <!--页面展示-->
        <div class="panel">
            <panel-title title="社区消息管理">
                <el-button @click="onAddNotice" size="mini">
                    <i class="fa el-icon-plus"></i>
                    添加
                </el-button>
            </panel-title>
            <div class="panel-body" style="height: 1px">
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="searchName" placeholder="标题" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
                <div style="float: left; width: 15%; margin-left: 10px">
                  <el-input v-model="searchTime" placeholder="发布时间" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
            </div>
            <div class="panel-body" style="height: 700px">
                <el-table empty-text="暂无数据" :data="notices" v-loading="loading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="id" label="消息id" width="200"/>
                    <el-table-column align="center" prop="title" show-overflow-tooltip='true' label="消息标题" width="250"/>
                    <el-table-column align="center" prop="people" label="发布人" width="250"/>
                    <el-table-column align="center" prop="admin_id" label="发布人" v-if=false width="250"/>
                    <el-table-column align="center" prop="time" label="发布时间" width="250"/>
                    <el-table-column align="center" prop="content" show-overflow-tooltip='true' label="消息内容" width="250"/>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="props">
                            <el-button type="info" size="mini" @click.native="onAlterInfo(props.row)">
                                <i class="fa el-icon-edit"></i>
                                编辑
                            </el-button>
                            <el-button type="danger" size="mini" @click.native="onDeleteNotice(props.row.id)">
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
        name: 'NoticeManage',
        data() {
            return {
                currentRow: {
                  id:'',
                  tele:'',
                  tile:'',
                  people:'',
                  time:'',
                  content:'',
                  admin_id:'',
                },
                usr: {
                  admin_id:'',
                  admin_name:''
                },
                addDialog: false,
                editDialog: false,
                notices: {},
                // departments: {},
                admin:{},
                searchName: '',
                searchTime: '',
                loading: false,

            }
        },
        components: {
            PanelTitle,
        },
        created() {
            this.onGetNotice()
            this.onGetUsr()
        },
        methods: {
            onRefresh() {
                this.onGetNotice()
                this.onGetUsr()
            },
            onGetNotice(){
                this.$http.get(this.formatString(this.$store.state.url.notice.allInfo,{
                    time: this.searchTime,
                    name: this.searchName
                })).then(({data: notices}) => {
                    this.notices = notices
                })
            },

            //获取管理员信息，用以社区消息的信息填充
            onGetUsr(){
                this.$http.get(this.formatString(this.$store.state.url.admin.usr,{
                    tele: this.$store.state.auth.user
                })).then(({data: usr})=>{
                  // document.write(usr.admin_name)
                    this.usr = usr;
                    this.$store.commit('setId', this.usr.admin_id);
                    // this.$message.error(this.usr[0].admin_name)
                })
            },


            //修改需确认
            onAlterInfo(row){
              this.currentRow = row;
              if (row.tele === this.$store.state.auth.user){
                this.editDialog = true;
              }
              else {
                this.$message.error("对不起！您没有修改权限！")
              }

            },


            //消息修改
            onUploadedNotice(){
                this.$http.post(this.$store.state.url.notice.update, this.currentRow)
                    .then(() => {
                        this.$message.success("修改成功");
                        this.onRefresh();
                        this.editDialog = false
                    }).catch(() => {
                    this.$message.error("修改失败");
                    this.editDialog = false
                })
            },



            //添加消息
            onAddNotice(){
                const myDate = new Date();
                let date = myDate.toLocaleDateString();
                date= date.toString();
                date.replace('/','-');
                this.currentRow = {};
                this.currentRow.people = this.usr[0].admin_name
                this.currentRow.admin_id = this.usr[0].admin_id
                this.currentRow.time = date;
                this.addDialog = true;
            },
            onCreateNotice(){
                // this.currentRow.credit = this.currentRow.credit.toString();
                this.$http.post(this.$store.state.url.notice.add, this.currentRow)
                    .then(() => {
                        this.$message.success("添加成功");
                        this.onRefresh();
                        this.addDialog = false
                    }).catch(() => {
                    this.$message.error("添加失败");
                    this.addDialog = false
                })
            },
            onDeleteNotice(id){
                this.$http.get(this.formatString(this.$store.state.url.notice.del,{
                    id: id
                })).then(() => {
                    this.$message.success("删除成功");
                    this.onRefresh();
                    this.editDialog = false
                }).catch(() => {
                    this.$message.error("删除失败");
                    this.editDialog = false
                })
            }
        }
    }
</script>

<style>
</style>
