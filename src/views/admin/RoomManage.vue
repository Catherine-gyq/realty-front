<template>
  <div class="panel">
    <panel-title title="社区活动室管理"></panel-title>
    <div class="panel-body">
      <el-table empty-text="暂无数据" :data="rooms" id="noticeTable" v-loading="loading" element-loading-text="加载中...">
        <el-table-column align="center" prop="room_usage" label="房间用途"></el-table-column>
        <el-table-column align="center" prop="room_address" label="房间号"></el-table-column>
        <el-table-column align="center" prop="room_num" label="房间数量"></el-table-column>
        <el-table-column align="center" :show-overflow-tooltip='true' prop="description" label="房间描述"></el-table-column>
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
    }
  },
  components: {
    PanelTitle,
  },
  created() {
    this.onGetRoom()
  },
  methods:{
    onGetRoom(){
      this.$http.get(this.$store.state.url.room.allInfo)
        .then(({data: rooms}) => {
          this.rooms = rooms
        })
    },
    //修改房间的信息
    onAlterInfo(){

    },
    //根据房间的id来删除房间
    onDeleteRoom(){

    }
  }
}
</script>

<style scoped>

</style>
