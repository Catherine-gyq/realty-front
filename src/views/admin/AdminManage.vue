<template>
  <div>
    <!-- 修改或者添加管理员信息的弹出框-->
    <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog" :before-close="cancelEdit">
      <el-form :rules="rules"  ref="adminForm" :model="currentRow" label-width="100px">
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
        <el-form-item label="出生年月" prop="dateOfBirth">
          <el-col :span="21">
            <el-date-picker v-model="currentRow.dateOfBirth" value-format="yyyy-MM-dd" type="date" placeholder="请选择出生年月">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="管理员权限" prop="identity">
          <el-select v-model="currentRow.identity" placeholder="请选择管理员身份">
            <el-option v-for="item in administrator"
                       :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="tele">
          <el-col :span="21">
            <el-input v-model="currentRow.tele"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="mailBox">
          <el-col :span="21">
            <el-input v-model="currentRow.mailBox"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelEdit" size="small">
          取消
        </el-button>
        <el-button v-if="ifChange" @click="onUploadedAdmin" type="primary" size="small">
          更新
        </el-button>
        <el-button v-else @click="onCreateAdmin" type="primary" size="small">
          添加
        </el-button>
      </div>
    </el-dialog>

    <!--页面框信息展示-->
    <div class="panel" style="min-height: 800px">
      <panel-title title="管理员信息管理"></panel-title>
      <div class="panel-body" style="display: flex;justify-content: space-between;">
        <div>
          <el-button @click="onAddAdmin" type="primary" size="small">添加管理员</el-button>
          <el-input class="community_input" v-model="search_tele" placeholder="请输入用户手机号来查询用户" prefix-icon="el-icon-search" size="small" @keyup.enter.native="onRefresh"/>
          <el-input class="community_input" v-model="searchName" placeholder="请输入用户姓名来查询用户" prefix-icon="el-icon-search" size="small" @keyup.enter.native="onRefresh"/>
        </div>
        <el-button size="small" @click="exportExcel" style="float: right;margin-right: 20px" type="primary">导出EXCEL</el-button>
      </div>
      <div class="panel-body">
        <el-table empty-text="暂无数据" :data="admins" id="adminTable" v-loading="loading" element-loading-text="加载中...">
          <el-table-column align="center" prop="admin_name" label="姓名" />
          <el-table-column align="center" prop="admin_sex" label="性别" />
          <el-table-column align="center" prop="identity" label="权限" >
            <template slot-scope="props">
              <span v-if="props.row.identity === 'admin'">管理员</span>
              <span v-else-if="props.row.identity === 'super_admin'">超级管理员</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="mailBox" label="邮箱"/>
          <el-table-column align="center" prop="admin_tele" label="手机号码"/>>
          <el-table-column align="center" label="操作">
            <template slot-scope="props" width="400">
              <el-button type="info" size="mini" @click.native="onAlterInfo(props.row)">
                <i class="fa el-icon-edit"></i>
                编辑
              </el-button>
              <el-button type="danger" size="mini" @click.native="onDeleteAdmin(props.row.admin_tele)">
                <i class="fa fa-remove"></i>
                删除
              </el-button>
              <el-button @click="onResetPwd(props.row.admin_tele)" type="primary" size="mini">密码重置</el-button>
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
import XLSX from "xlsx"
export default {
  name: 'AdminManage',
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
        identity:'',
        tele:"",
        mailBox:"",
        dateOfBirth:''
      },
      addDialog: false,
      editDialog: false,
      admins: [],
      searchName: '',
      search_tele: '',
      loading: false,
      rules: {
        name: [{required: true, trigger: 'blur', message:'请输入用户名'}],
        sex: [{required: true, trigger: 'blur', message:'请输入性别'}],
        tele: [{required: true, trigger: 'blur', validator: validateTele}],
        mailBox: [{required: true, trigger: 'blur',pattern: '^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
          message: '请输入正确的邮箱格式'}],
        identity: [{required: true, trigger: 'blur', message:'请选择管理员的权限'}],
      },
      ifChange:false,
      //  分页问题
      currentPage:1,
      pageSize:10,
      totalCount:0,
      //管理员选项
      administrator:[{
        value: 'admin',
        label: '管理员'
      },{
        value: 'super_admin',
        label: '超级管理员'
      }],
    }
  },
  components: {
    PanelTitle,
  },
  created() {
    this.onGetAdmins()
  },
  methods: {
    onRefresh() {
      this.onGetAdmins()
    },
    //搜寻管理员信息 分页搜寻
    onGetAdmins() {
      let body = {
        tele: this.search_tele,
        name: this.searchName,
        pageSize:this.pageSize,
        currentPage:this.currentPage
      }
      this.loading=true
      this.$http.get(this.formatString(this.$store.state.url.admin.allInfo, body)).then(({data: data}) => {
        this.admins = data.adminInfo
        this.totalCount = data.totalNum
        this.loading=false
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
    cancelEdit(){
      this.editDialog=false
      this.$refs["adminForm"].resetFields()
    },
    onUploadedAdmin() {
      //把dateOfBirth格式化
      this.$refs['adminForm'].validate((valid)=>{
        if (valid){
          this.$http.post(this.$store.state.url.admin.update, this.currentRow)
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
    //添加管理员
    onAddAdmin() {
      if (this.$store.state.auth.identity==='super_admin'){
        this.ifChange=false
        this.currentRow = {};
        this.editDialog = true
      }else {
        this.$message.error('不具备此权限')
      }
    },
    //修改管理员信息
    onAlterInfo(row) {
      if (this.$store.state.auth.identity==='super_admin'){
        this.ifChange = true
        this.currentRow={
          id:row.admin_id,
          name:row.admin_name,
          sex:row.admin_sex,
          tele:row.admin_tele,
          mailBox:row.mailBox,
          identity:row.identity,
          dateOfBirth:row.dateOfBirth
        }
        this.editDialog = true;
      }else{
        this.$message.error('不具备此权限')
      }
    },


    // 添加管理员信息
    onCreateAdmin() {
      this.$refs['adminForm'].validate((valid)=>{
        if (valid){
          this.$http.post(this.$store.state.url.admin.add, this.currentRow)
              .then(() => {
                this.$message.success("添加成功");
                this.onRefresh();
                this.$message.success("首次添加用户默认密码为手机号");
                this.editDialog = false
              }).catch(() => {
            this.$message.error("添加失败");
            this.editDialog = false
          })
        }
      })
    },
    onDeleteAdmin(tele) {
      if (this.$store.state.auth.identity==='super_admin'){
        this.$http.get(this.formatString(this.$store.state.url.admin.del, {
          tele: tele
        })).then(() => {
          this.$message.success("删除成功");
          this.onRefresh();
          this.editDialog = false
        }).catch(() => {
          this.$message.error("删除失败");
          this.editDialog = false
        })
      }else{
        this.$message.error("不具备此权限")
      }

    },
    onResetPwd(tele) {
      if (this.$store.state.auth.identity==='super_admin'){
        this.$confirm('用户密码即将重置为初始手机号，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(this.formatString(this.$store.state.url.auth.reset,{
            username: tele,
            identity: 'admin'
          })).then(() => {
            this.$message.success("重置成功");
            this.editDialog = false
          }).catch(() => {
            this.$message.error("重置失败");
            this.editDialog = false
          })
        })
      }else{
        this.$message.error("不具备此权限")
      }
    },
    //导出表格
    exportExcel() {
      var wb = XLSX.utils.table_to_book(document.querySelector("#adminTable"));
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "admin.xlsx"
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
