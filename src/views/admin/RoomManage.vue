<template>
  <div>
    <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog" :before-close="cancelEdit">
      <el-form :rules="roomRules" ref="roomRules" :model="roomData" label-width="100px">
        <el-form-item label="房间用途" prop="room_usage">
          <el-col :span="21">
            <el-input v-model="roomData.room_usage"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="房间地址" prop="room_address">
          <el-col :span="21">
            <el-input v-model="roomData.room_address"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="房间容量" prop="room_num">
          <el-col :span="21">
            <el-input v-model="roomData.room_num"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="房间描述" prop="description">
          <el-col :span="21">
            <el-input v-model="roomData.description" type="textarea"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelEdit" size="small">
          取消
        </el-button>
        <el-button v-if="ifAdd" @click="onCreateRoom" type="primary" size="small">
          添加
        </el-button>
        <el-button v-else @click="onUpdateRoom" type="primary" size="small">
          更新
        </el-button>

      </div>
    </el-dialog>
    <div class="panel">
      <panel-title title="社区活动室管理"></panel-title>
      <div class="panel-body">
        <div class="panel-body">
          <el-button @click="onAddRoom" type="primary" size="small">添加房间</el-button>
        </div>
        <el-table empty-text="暂无数据" :data="rooms" id="noticeTable" v-loading="loading" element-loading-text="加载中...">
          <el-table-column align="center" prop="room_usage" label="房间用途"></el-table-column>
          <el-table-column align="center" prop="room_address" label="房间地址"></el-table-column>
          <el-table-column align="center" prop="room_num" label="房间容量"></el-table-column>
          <el-table-column align="center" :show-overflow-tooltip='true' prop="description" width="400" label="具体描述"></el-table-column>
          <el-table-column align="center" label="操作" width="250">
            <template slot-scope="props">
              <el-button type="info" size="mini" @click.native="onAlterInfo(props.row)">
                <i class="fa el-icon-edit"></i>
                编辑
              </el-button>
              <el-button type="danger" size="mini" @click.native="onDeleteRoom(props.row.id)">
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
  name: "RoomManage",
  data(){
    return{
      rooms:[],
      roomData:{},
      ifAdd:false,
      editDialog:false,
      loading:false,
      roomRules: {
        room_usage: [{required: true, trigger: 'blur', message:'请输入房间用途'}],
        room_address: [{required: true, trigger: 'blur', message:'请输入房间地址'}],
        room_num: [{required: true, trigger: 'blur', message:'请输入房间'}],
        description:[{required: true, trigger: 'blur', message:'请输入房间描述'}]
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
    this.onGetRoom()
  },
  methods:{
    onRefresh(){
      this.onGetRoom()
    },
    onGetRoom(){
      this.loading = true
      let body={
        pageSize:this.pageSize,
        currentPage:this.currentPage
      }
      this.$http.get(this.formatString(this.$store.state.url.room.allInfo,body))
        .then(({data: rooms}) => {
          this.rooms = rooms.roomInfo
          this.totalCount = rooms.totalNum
          this.loading = false
        })
    },
    cancelEdit(){
      this.editDialog = false
      this.$refs["roomRules"].resetFields()
    },
    //打开修改房间信息的弹窗
    onAlterInfo(roomData){
      this.roomData = roomData
      this.editDialog = true
      this.ifAdd = false
    },
    //打开添加房间信息的弹窗
    onAddRoom(){
      this.ifAdd = true
      this.editDialog = true
    },
    //根据房间的id来删除房间
    onDeleteRoom(roomId){
      this.$http.get(this.formatString(this.$store.state.url.admin.del, {roomId:roomId}))
          .then(()=> {
            this.$message.success('删除成功！')
          }).catch(()=>{
            this.$message.error('删除失败！')
      })
    },
    //创建房间信息
    onCreateRoom(){

    },
    //更新房间的信息
    onUpdateRoom(){
      this.$refs['roomRules'].validate((valid)=>{
        if (valid){
          this.$http.post(this.$store.state.url.room.update, this.roomData)
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
  //  分页的设置
    handleSizeChange(val) {
      this.pageSize=val
      this.onRefresh()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.onRefresh()
    },
  }
}
</script>

<style scoped>

</style>
