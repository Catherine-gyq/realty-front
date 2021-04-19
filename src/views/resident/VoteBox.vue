<template>
  <div class="panel_check">
    <el-dialog :visible.sync="editDialog" size="tiny" width="600px" class="dialog">
      <div slot="footer">
        <el-button @click="editDialog=false" size="small">
          取消
        </el-button>
        <el-button @click="onUploadedNotice" type="primary" size="small">
          更新
        </el-button>
      </div>
    </el-dialog>

    <el-row style="width: 100%">
      <el-col :span="18" offset="3">
        <div class="panel-body" style="height: 700px; border: 1px solid #eee;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
          <el-table empty-text="暂无数据" style="margin-top: 20px;margin-right: 10px; margin-bottom: 20px; margin-left: 10px;"
                    :data="vote" v-loading="loading" element-loading-text="加载中...">
<!--            <el-table-column align="center" prop="id" label="投票信息id" width="200"/>-->
            <el-table-column align="center" prop="title" show-overflow-tooltip='true' label="消息标题" width="250"/>
            <el-table-column align="center" prop="people" label="发布人" width="200"/>
            <el-table-column align="center" prop="time" label="发布时间" width="200"/>
            <el-table-column align="center" prop="content" show-overflow-tooltip='true' label="消息内容" width="250"/>
            <el-table-column align="center" label="操作">
              <template slot-scope="props">
                <el-button type="info" size="mini" @click.native="onCheckVote(props.row.id)">
                  <i class="fa el-icon-edit"></i>
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "NoteBox",
  data() {
    return {
      vote: {
        id: '',
        time: '',
        title: '',
        content: '',
        people: '',
        admin_id: '',
        tele: '',
      },
      editDialog: false,
    }
  },
  created() {
    this.onGetVote()
  },
  methods: {
    onGetVote() {
      this.$http.get(this.$store.state.url.vote.allInfo).then(({data: vote}) => {
        this.vote = vote
      })
    },

    // onCheckVote(id) {
    //   this.editDialog = true;
    //   //查看你自己是否在其中投票了
    //   this.$http.get(this.formatString(this.$store.state.url.notice.del, {
    //     id: id
    //   })).then(({data:check}) => {
    //     // this.$message.success("删除成功");
    //     // data:
    //     // this.onRefresh();
    //     // this.editDialog = false
    //
    //
    //   })
    //   //     .catch(() => {
    //   //   this.$message.error("删除失败");
    //   //   this.editDialog = false
    //   // })
    // },

  }
}
</script>

<style scoped>

</style>
