<template>
    <div>
<!-- 修改居民信息弹出框-->
        <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog">
            <el-form :rules="rules"  ref="form" :model="currentRow" label-width="80px">
              <el-form-item label="姓名" prop="name">
                <el-col :span="21">
                  <el-input v-model="currentRow.name"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-col :span="21">
                  <el-input v-model="currentRow.sex" ></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="手机号" prop="tele">
                <el-col :span="21">
                  <el-input v-model="currentRow.tele"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-col :span="21">
                  <el-input v-model="currentRow.address"></el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editDialog=false" size="small">
                    取消
                </el-button>
                <el-button @click="onUploadedResident" type="primary" size="small">
                    更新
                </el-button>
            </div>
        </el-dialog>
<!--      添加居民信息弹出框-->
        <el-dialog :visible.sync="addDialog" size="tiny" width="600px" class="dialog">
            <el-form :rules="rules" ref="form" :model="currentRow" label-width="80px">
              <el-form-item label="姓名" prop="name">
                  <el-col :span="21">
                      <el-input v-model="currentRow.name"></el-input>
                  </el-col>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                  <el-col :span="21">
                      <el-input v-model="currentRow.sex" ></el-input>
                  </el-col>
              </el-form-item>
              <el-form-item label="手机号" prop="tele">
                <el-col :span="21">
                  <el-input v-model="currentRow.tele"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-col :span="21">
                  <el-input v-model="currentRow.address"></el-input>
                  <div style="font-size: 10px;text-align: right;color: rgba(203,129,58,0.86)">注：初始密码为手机号</div>
                </el-col>
              </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addDialog=false" size="small">
                    取消
                </el-button>
                <el-button @click="onCreateResident" type="primary" size="small">
                    添加
                </el-button>
            </div>
        </el-dialog>


<!--页面框信息展示-->
        <div class="panel">
            <panel-title title="居民信息管理">
                <el-button @click="onAddResident" size="mini">
                    <i class="fa el-icon-plus"></i>
                    添加
                </el-button>
            </panel-title>
            <div class="panel-body" style="height: 1px">
                <!--模糊搜索-->
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="search_tele" placeholder="手机号" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
                <div style="float: left; width: 15%; margin-left: 10px">
                    <el-input v-model="searchName" placeholder="姓名" prefix-icon="el-icon-search" size="mini" @input="onRefresh"/>
                </div>
            </div>
            <div class="panel-body" style="height: 700px">
                <el-table empty-text="暂无数据" :data="residents" v-loading="loading" element-loading-text="加载中...">
                    <el-table-column align="center" prop="resident_id" label="居民id" width="200"/>
                    <el-table-column align="center" prop="name" label="姓名" width="200"/>
                    <el-table-column align="center" prop="sex" label="性别" width="200"/>
                    <el-table-column align="center" prop="tele" label="手机号码" width="200"/>
                    <el-table-column align="center" prop="address" label="住址" width="200"/>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="props" width="200">
                            <el-button type="info" size="mini" @click.native="onAlterInfo(props.row)">
                                <i class="fa el-icon-edit"></i>
                                编辑
                            </el-button>
                            <el-button type="danger" size="mini" @click.native="onDeleteStudent(props.row.tele)">
                                <i class="fa fa-remove"></i>
                                删除
                            </el-button>
                          <el-button @click="onResetPwd" type="primary" size="mini">密码重置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    // import mislist from "@easipass/basic/mixins/mislist";
    import PanelTitle from '../../components/PanelTitle'
    export default {
        name: 'ResidentManage',
        // mixins: [mislist],
        data() {
            const validateName = (rule, value, callback) => {
            if (!value || value.length === 0) {
              callback(new Error('请输入用户名'))
            } else {
              callback()
            }
            };
            const validateSex = (rule, value, callback) => {
              if (!value || value.length === 0) {
                callback(new Error('请输入性别'))
              } else {
                callback()
              }
            };
            const validateTele = (rule, value, callback) => {
              if (!value || value.length != 11) {
                callback(new Error('请输入正确格式的电话号码'))
              } else {
                callback()
              }
            };
            const validateAddress = (rule, value, callback) => {
              if (!value || value.length === 0) {
                callback(new Error('请输入住址'))
              } else {
                callback()
              }
            };
            return {
                currentRow: {
                  resident_id:"",
                  name:"",
                  sex:"",
                  tele:"",
                  address:""
                },
                addDialog: false,
                editDialog: false,
                residents: {},
                // departments: {},
                searchName: '',
                search_tele: '',
                loading: false,

                rules: {
                  name: [{required: true, trigger: 'blur', validator: validateName}],
                  sex: [{required: true, trigger: 'blur', validator: validateSex}],
                  tele: [{required: true, trigger: 'blur', validator: validateTele}],
                  address: [{required: true, trigger: 'blur', validator: validateAddress}],
                  // password: [{required: true, trigger: 'blur', validator: validatePassword}]
                },
            }
        },
        components: {
            PanelTitle,
        },
        created() {
            this.onGetResidents()
        },
        methods: {
          onRefresh() {
            this.onGetResidents()
          },
          //搜寻居民信息(如果没有搜索那就是全部信息)
          onGetResidents() {
            this.$http.get(this.formatString(this.$store.state.url.resident.allInfo, {
              usr_tele: this.search_tele,
              name: this.searchName
            })).then(({data: residents}) => {
              this.residents = residents
            })
          },

          onAlterInfo(row) {
            this.currentRow = row;
            this.editDialog = true;
          },

          onUploadedResident() {
            this.$http.post(this.$store.state.url.resident.update, this.currentRow)
                .then(() => {
                  this.$message.success("修改成功");
                  this.onRefresh();
                  this.editDialog = false
                }).catch(() => {
              this.$message.error("修改失败");
              this.onRefresh();
              this.editDialog = false
            })
          },


          //是否显示编辑框
          onAddResident() {
            this.currentRow = {};
            this.addDialog = true;
          },
          // 添加居民信息
          onCreateResident() {
            this.$http.post(this.$store.state.url.resident.add, this.currentRow)
                .then(() => {
                  this.$message.success("添加成功");
                  this.onRefresh();
                  this.$message.success("首次添加用户默认密码为手机号");
                  this.addDialog = false
                }).catch(() => {
              this.$message.error("添加失败");
              this.addDialog = false
            })
          },
          onDeleteStudent(tele) {
            this.$http.get(this.formatString(this.$store.state.url.resident.del, {
              tele: tele
            })).then(() => {
              this.$message.success("删除成功");
              this.onRefresh();
              this.editDialog = false
            }).catch(() => {
              this.$message.error("删除失败");
              this.editDialog = false
            })
          },
          onResetPwd() {
            this.$confirm('用户密码即将重置为初始手机号，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.get(this.formatString(this.$store.state.url.auth.reset,{
                  username: this.currentRow.tele,
                  identity: 'resident'
              })).then(() => {
                  this.$message.success("重置成功");
                  this.editDialog = false
              }).catch(() => {
                  this.$message.error("重置失败");
                  this.editDialog = false
              })
            })
          },
        }
    }
</script>
<style>

</style>
