<template>
    <div>
<!-- 修改居民信息弹出框-->
        <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog">
            <el-form :rules="rules"  ref="editForm" :model="currentRow" label-width="80px">
              <el-form-item label="姓名" prop="name">
                <el-col :span="21">
                  <el-input v-model="currentRow.name"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-col :span="21">
                  <el-radio-group v-model="currentRow.sex" size="medium">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-col>
              </el-form-item>
              <el-form-item label="手机号" prop="tele">
                <el-col :span="21">
                  <el-input v-model="currentRow.tele"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="邮箱地址" prop="mailBox">
                <el-col :span="21">
                  <el-input v-model="currentRow.mailBox"></el-input>
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
            <el-form :rules="rules" ref="addForm" :model="currentRow" label-width="80px">
              <el-form-item label="姓名" prop="name">
                  <el-col :span="21">
                      <el-input v-model="currentRow.name"></el-input>
                  </el-col>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-col :span="21">
                  <el-radio-group v-model="currentRow.sex" size="medium">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-col>
              </el-form-item>
              <el-form-item label="手机号" prop="tele">
                <el-col :span="21">
                  <el-input v-model="currentRow.tele"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="邮箱地址" prop="mailBox">
                <el-col :span="21">
                  <el-input v-model="currentRow.mailBox"></el-input>
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
            <panel-title title="居民信息管理"></panel-title>
            <div class="panel-body" style="display: flex;justify-content: space-between">
              <div>
                <el-button @click="onAddResident" type="primary" size="small">添加居民</el-button>
                <el-input class="community_input" v-model="search_tele" placeholder="请输入用户手机号来查询用户" prefix-icon="el-icon-search" size="small" @keyup.enter.native="onRefresh"/>
                <el-input class="community_input" v-model="searchName" placeholder="请输入用户姓名来查询用户" prefix-icon="el-icon-search" size="small" @keyup.enter.native="onRefresh"/>
              </div>
              <el-button size="small" @click="exportExcel" style="float: right;margin-right: 20px" type="primary">导出EXCEL</el-button>
            </div>
            <div class="panel-body">
              <el-table empty-text="暂无数据" :data="residents" id="residentTable" v-loading="loading" element-loading-text="加载中...">
                  <el-table-column align="center" prop="name" label="姓名" width="200"/>
                  <el-table-column align="center" prop="sex" label="性别" width="200"/>
                  <el-table-column align="center" prop="mailBox" label="邮箱" width="300"/>
                  <el-table-column align="center" prop="tele" label="手机号码" width="300"/>
                  <el-table-column align="center" prop="address" label="住址" width="300"/>
                  <el-table-column align="center" label="操作">
                      <template slot-scope="props" width="400">
                          <el-button type="info" size="mini" @click.native="onAlterInfo(props.row)">
                              <i class="fa el-icon-edit"></i>
                              编辑
                          </el-button>
                          <el-button type="danger" size="mini" @click.native="onDeleteResident(props.row.tele)">
                              <i class="fa fa-remove"></i>
                              删除
                          </el-button>
                        <el-button @click="onResetPwd(props.row.tele)" type="primary" size="mini">密码重置</el-button>
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
  import FileSaver from "file-saver"
  import XLSX from "xlsx";
  export default {
    name: 'ResidentManage',
    data() {
      const validateTele = (rule, value, callback) => {
        if (!value || value.length != 11) {
          callback(new Error('请输入正确格式的电话号码'))
        } else {
          callback()
        }
      };
      return {
        currentRow: {
          id:"",
          name:"",
          sex:"",
          tele:"",
          address:"",
          mailBox:"",
        },
        addDialog: false,
        editDialog: false,
        residents: [],
        searchName: '',
        search_tele: '',
        loading: false,
        rules: {
          name: [{required: true, trigger: 'blur', message:'请输入姓名'}],
          sex: [{required: true, trigger: 'blur', message:'请输入性别'}],
          tele: [{required: true, trigger: 'blur', validator: validateTele}],
          mailBox: [{required: true, trigger: 'blur',pattern: '^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
            message: '请输入正确的邮箱格式'}],
          address: [{required: true, trigger: 'blur', message:'请输入地址'}],
        },

      //  分页问题
        currentPage:1,
        pageSize:10,
        totalCount:0,
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
      //搜寻居民信息 分页搜寻
      onGetResidents() {
        let body = {
          usr_tele: this.search_tele,
          name: this.searchName,
          pageSize:this.pageSize,
          currentPage:this.currentPage
        }
        console.log(body)
        this.$http.get(this.formatString(this.$store.state.url.resident.allInfo, body)).then(({data: residents}) => {
          console.log(residents)
          this.residents = residents.residentInfo
          this.totalCount = residents.totalNum
        })
      },

      handleSizeChange(val) {
        this.pageSize=val
        this.onRefresh()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.onRefresh()
      },


      onAlterInfo(row) {
        this.currentRow = row;
        this.currentRow.id = row.resident_id
        this.editDialog = true;
      },

      onUploadedResident() {
        this.$refs['editForm'].validate((valid)=>{
          if (valid){
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
          }})
      },


      //是否显示编辑框
      onAddResident() {
        this.currentRow = {};
        this.addDialog = true;
      },
      // 添加居民信息
      onCreateResident() {
        this.$refs['addForm'].validate((valid)=>{
          if (valid){
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
          }
        })
      },
      onDeleteResident(tele) {
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
      //导出表格
      exportExcel() {
        var wb = XLSX.utils.table_to_book(document.querySelector("#residentTable"));
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              "resident.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }
    }
  }
</script>
<style>

</style>
