<template>
  <div class="panel_check">
    <!--查看所有预约-->
    <el-dialog :visible.sync="checkDialog" size="tiny" width="1500px" class="dialog">
      <div class="panel-body" style="height: 700px">
<!--        v-loading="loading"-->
        <el-table empty-text="暂无数据" :data="activity"  element-loading-text="加载中..." stripe>
          <el-table-column align="center" prop="activity_id" label="活动编号" width="100"/>
          <el-table-column align="center" prop="room_usage" label="房间用途" width="200"/>
          <el-table-column align="center" prop="resident_name" label="预约人" width="200"/>
          <el-table-column align="center" prop="resident_id" label="预约人id" width="200" v-if="false"/>
          <el-table-column align="center" prop="date" label="预约日期" width="200"/>
          <el-table-column align="center" prop="startTime" label="开始时间" width="200"/>
          <el-table-column align="center" prop="endTime" label="结束时间" width="200"/>
          <el-table-column align="center" prop="status" label="审批状态" width="200"/>
          <el-table-column align="center" label="操作">
            <template slot-scope="props" width="200">
<!--              && status="待处理"{{this.$store.state.auth.id == activity.resident_id}}-->
              <el-button type="info" size="mini" @click.native="onCancelReserve(props.row.activity_id)"
              :disabled="usr.resident_id == props.row.resident_id ? false : true">
                <i class="fa el-icon-edit"></i>
                取消预约
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="checkDialog=false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--预约的填写组件 size="tiny"  应该要把所有内容整成必填的（还没写,不过问题也不大，预约失败完事儿）-->
    <el-dialog :visible.sync="reserveDialog" width="700px" class="dialog">
      <el-form ref="form" :model="currentRow" label-width="80px">
        <el-form-item label="预约房间">
          <el-col :span="21">
            <el-input v-model="currentRow.room" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="预约用途">
          <el-col :span="21">
            <el-input v-model="currentRow.usage" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="预约时间">
          <el-col :span="21" style="text-align: left;">
            <el-date-picker v-model="currentRow.date" type="date" placeholder="选择日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd"> </el-date-picker>
            <!--具体时间周期的选择-->
          </el-col>
          <el-col :span="24" style="text-align: left;margin-top: 10px;">
            <el-time-select placeholder="开始时间" v-model="currentRow.startTime" :picker-options="{start: '08:30', step: '02:00',end: '18:30'}" style="margin-right: 5px;">
            </el-time-select>
            <el-time-select placeholder="结束时间" v-model="currentRow.endTime" :picker-options="{start: '08:30', step: '02:00',end: '18:30', minTime: currentRow.startTime}">
            </el-time-select>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="reserveDialog=false" size="small">
          取消
        </el-button>
        <el-button @click="onReserveSubmit" type="primary" size="small">
          预约
        </el-button>
      </div>
    </el-dialog>

    <el-row>
      <el-col :span="16" v-for="(room, i) in rooms" :key="i" :offset="4" style="margin-bottom: 40px">
        <el-card :body-style="{ padding: '0px' }">
          <el-container>
            <el-aside width="40%">
<!--              fit="fill"-->
              <el-image v-bind:src="room.picture" style="margin: 20px;" fit="fill"></el-image>
            </el-aside>
            <el-container>
              <el-main>
                <el-row style="height: 100%;">
                  <el-col :span="24" style="font-size: xx-large;color: #F6B93D;margin-bottom: 30px;"><div>{{room.room_usage}}</div></el-col>
                  <el-col :span="24"><div style="font-size: large;line-height: 40px;">容纳人数：{{room.room_num}}</div></el-col>
                  <el-col :span="24"><div style="font-size: large;line-height: 40px;">小区地址：{{room.room_address}}</div></el-col>
                  <el-col :span="24"><div style="font-size: large;line-height: 40px;"><span style="color: #50cf77;font-weight: bold;">描述：</span>{{room.description}}</div></el-col>
                </el-row>
              </el-main>
              <el-footer>
                <template>
                  <el-popover  width="200" trigger="hover" content="查看该活动室预约情况。" style="margin-right: 20px;">
                    <el-button @click="showReserve" slot="reference" plain>
                      查看
                    </el-button>
                  </el-popover>
                  <el-popover  width="200" trigger="hover" content="进行该活动室的预约" style="margin-right: 10px;">
                    <el-button @click="onActivityReserve(room.room_usage,room.room_id)" slot="reference" type="primary" plain>
                      预约
                    </el-button>
                  </el-popover>
                </template>
              </el-footer>
            </el-container>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ActivityReserve",
  data(){
    const validateUsage = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请输入您的用途'))
      } else {
        callback()
      }
    };
    const validateStarttime = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请选择开始时间'))
      } else {
        callback()
      }
    };
    const validateEndtime = (rule, value, callback) => {
      if (!value || value.length != 11) {
        callback(new Error('请选择结束时间'))
      } else {
        callback()
      }
    };
    const validateDate = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请输入日期'))
      } else {
        callback()
      }
    };
    return{
      reserveDialog:false,
      checkDialog:false,
      // error:false,
      currentRow:{
        room:'',
        room_id:'',
        resident_id:'',
        usage:'',
        date:'',
        startTime:'',
        endTime:'',
      },
      //申请的居民名字和编号
      usr: {
        resident_id:'',
        name:''
      },
      //活动预约的所有内容
      activity:{
        activity_id:'',
        resident_id: '',
        room_usage: '',
        resident_name:'',
        date:'',
        startTime: '',
        endTime:'',
        status:'',
      },
      rooms:{
        room_id:'',
        room_usage:'',
        picture:'',
        description:'',
        room_num:'',
        room_address:''
      },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      rules: {
        usage:[{required: true, trigger: 'blur', validator: validateUsage}],
        date:[{required: true, trigger: 'blur', validator: validateDate}],
        startTime:[{required: true, trigger: 'blur', validator: validateStarttime}],
        endTime:[{required: true, trigger: 'blur', validator: validateEndtime}],
      },
    }
  },



  created() {
    this.onGetRoom()
    this.onGetUsr()
  },
  methods:{
    //获取房间预约情况
    onRefresh(){
      this.onGetActivity();
    },
    // 获取用户信息
    onGetUsr(){
      this.$http.get(this.formatString(this.$store.state.url.resident.usr,{
        tele: this.$store.state.auth.user
      })).then(({data: usr})=>{
        this.usr = usr
        // this.$store.commit('setId', this.usr.resident_id);
      })
    },

    onGetRoom(){
      this.$http.get(this.$store.state.url.room.allInfo)
          .then(({data: rooms}) => {
            this.rooms = rooms
          })
    },
    showReserve(){
      this.onGetActivity()
      this.checkDialog=true
    },
    onActivityReserve(usage,id){
      this.currentRow = {};
      this.reserveDialog = true;
      this.currentRow.room = usage;
      this.currentRow.room_id = id;
      this.currentRow.resident_id = this.$store.state.auth.id;
    },

    //提交活动室预约
    onReserveSubmit(){
      this.$http.post(this.$store.state.url.activity.reserve, this.currentRow)
      .then(()=>{
        this.$message.success("预约成功，等待审核");
        this.onRefresh();
        this.reserveDialog = false;
      }).catch(()=>{
        this.$message.error("预约失败");
        this.reserveDialog = false;
      })
    },

  //  获取所有预约内容
    onGetActivity(){
      this.$http.get(this.$store.state.url.activity.allInfo)
          .then(({data: activity}) => {
        this.activity = activity
            // document.write(this.activity[1].startTime)
      })
    },

    //删除预约
    onCancelReserve(activity_id){
      // document.write(activity_id)
      this.$http.get(this.formatString(this.$store.state.url.activity.cancel,{
        activity_id: activity_id
      })).then(() => {
        this.$message.success("取消成功");
        this.onRefresh();
        this.checkDialog = false
      }).catch(() => {
        this.$message.error("取消失败");
        this.checkDialog = false
      })
    }

  }
}
</script>

<style scoped>
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  /*line-height: 200px;*/
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: left;
  /*line-height: 160px;*/
}
.el-footer {
  background-color: #E9EEF3;
  color: #333;
  text-align: right;
  /*line-height: 160px;*/
}
</style>
