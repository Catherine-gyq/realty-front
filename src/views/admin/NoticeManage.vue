<template>
    <div>
<!--        修改信息  注意判断，只有原发布人才能够修改-->
        <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog">
            <el-form ref="editForm" :model="currentRow" label-width="80px">
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
            <el-form ref="addForm" :model="addInfo" label-width="80px">
              <el-form-item label="消息标题">
                <el-col :span="21">
                  <el-input v-model="addInfo.title" ></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-col :span="21">
                  <el-input v-model="addInfo.publish_time" disabled></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="发布人">
                <el-col :span="21">
                  <el-input v-model="addInfo.name" disabled></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="消息内容">
                <el-col :span="21" >
                  <el-input v-model="addInfo.content" type="textarea" :autosize="{minRows: 2, maxRows: 10}"></el-input>
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
          <panel-title title="社区消息管理"></panel-title>
            <div class="panel-body" style="display: flex">
              <el-button @click="onAddNotice" size="small" type="primary">
<!--                <i class="fa el-icon-plus"></i>-->
                添加消息
              </el-button>
              <el-date-picker class="community_input" style="margin-right: 20px" size="small"
                              value-format="yyyy-MM-dd"
                              @change="onRefresh"
                              v-model="timePeriod"
                              type="datetimerange"
                              :picker-options="pickerOptions"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              align="right">
              </el-date-picker>
              <el-input class="community_input" v-model="searchName" placeholder="请输入标题来查询消息" prefix-icon="el-icon-search" size="small" @keyup.enter="onRefresh"/>
            </div>
            <div class="panel-body" style="height: 700px">
              <el-table empty-text="暂无数据" :data="notices" v-loading="loading" element-loading-text="加载中...">
                  <el-table-column align="center" prop="title" :show-overflow-tooltip='true' label="消息标题" width="250"/>
                  <el-table-column align="center" prop="people" label="发布人" width="250"/>
                  <el-table-column align="center" prop="admin_id" label="发布人" v-if=false width="250"/>
                  <el-table-column align="center" prop="time" label="发布时间" :formatter="getNoticeDate"  width="250"/>
                  <el-table-column align="center" prop="content" :show-overflow-tooltip='true' label="消息内容" width="400"/>
                  <el-table-column align="center" label="操作" width="250">
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
              <div class="block" style="display: flex;justify-content: center;margin-top: 20px">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
              </div>
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
            adminId:'',
          },
          addInfo:{
            title:'',
            publish_time:'',
            content:'',
            adminId: '',
            name:'',
          },
          usr: {
            admin_id:'',
            admin_name:''
          },
          timePeriod:['',''],
          addDialog: false,
          editDialog: false,
          notices: [],
          // departments: {},
          admin:{},
          searchName: '',
          searchTime: '',
          loading: false,
          //时间的快速选择
          pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          currentPage:1,
          pageSize:10,
          totalCount:0,
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
          let body
          if ((this.timePeriod && this.timePeriod.length!==2) || !this.timePeriod){
            body={
              startTime: '',
              endTime:'',
              name: this.searchName,
              pageSize:this.pageSize,
              currentPage:this.currentPage
            }
          }else if (this.timePeriod && this.timePeriod.length===2){
            body={
              startTime: this.timePeriod[0],
              endTime:this.timePeriod[1],
              name: this.searchName,
              pageSize:this.pageSize,
              currentPage:this.currentPage
            }
          }
          this.$http.post(this.$store.state.url.notice.allInfo,body).then(({data: notices}) => {
            console.log(notices)
            this.notices = notices.noticeInfo
            this.totalCount = notices.totalNum
          })
        },

          //获取管理员信息，用以社区消息的信息填充
          onGetUsr(){
              this.$http.get(this.formatString(this.$store.state.url.admin.usr,{
                  tele: this.$store.state.auth.user
              })).then(({data: usr})=>{
                  this.usr = usr;
                  this.$store.commit('setId', this.usr.admin_id);
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
        //分页函数（需修改）
        handleSizeChange(val) {
          this.pageSize=val
          this.onRefresh()
        },
        handleCurrentChange(val) {
          this.currentPage = val
          this.onRefresh()
        },

          //消息修改
          onUploadedNotice(){
            this.$http.post(this.$store.state.url.notice.update, this.currentRow)
              .then(() => {
                  this.$message.success("修改成功");
                  this.onRefresh();
                  this.$refs['editForm'].resetFields()
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
            this.currentRow.adminId = this.usr[0].admin_id
            this.addInfo.name = this.usr[0].admin_name
            this.addInfo.adminId = this.usr[0].admin_id
            this.addInfo.publish_time= date;
            this.addDialog = true;
          },

          onCreateNotice(){
            console.log(this.addInfo)
            this.$http.post(this.$store.state.url.notice.add, this.addInfo)
              .then(() => {
                this.$message.success("添加成功");
                this.onRefresh();
                //表格清空
                this.$refs['addForm'].resetFields()
                this.addDialog = false
              }).catch(() => {
              this.$message.error("添加失败");
              this.addDialog = false
            })
          },

          onDeleteNotice(id){
            this.$confirm('确定删除本条社区消息吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
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
            })
          },
        getNoticeDate(row){
          return this.getChangedDate(row.time)
        },
        //这个是转换时间戳和时间日期之间的
        add0(m){return m<10?'0'+m:m },
        getChangedDate(timeStamp){
          if (timeStamp){
            var time = new Date(timeStamp);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s)
          }
        },
      }
    }
</script>

<style>
</style>
