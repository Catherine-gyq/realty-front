<template>
  <div class="panel">
    <panel-title title="社区意见箱">
      <el-button @click="onAddAdvise" size="mini">
        <i class="fa el-icon-plus"></i>
        添加
      </el-button>
    </panel-title>
    <div class="panel-body" style="height: 700px">
      <el-table empty-text="暂无数据" :data="advise" v-loading="loading" element-loading-text="加载中...">
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
</template>

<script>
export default {
name: "AdviseBox"
}
</script>

<style scoped>

</style>
