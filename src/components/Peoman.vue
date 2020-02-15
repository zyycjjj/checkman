<template>
  <el-container>
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="name" label="用户名" width="100"></el-table-column>
      <el-table-column prop="buid" label="楼号" width="100"></el-table-column>
      <el-table-column prop="unit" label="单元号" width="100"></el-table-column>
      <el-table-column prop="roomid" label="门牌号" width="100"></el-table-column>
      <el-table-column prop="stat" label="出入状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.stat === '-1'" type="success">外出</el-tag>
          <el-tag v-else-if="scope.row.stat === '0'" type="warning">未知</el-tag>
          <el-tag v-else-if="scope.row.stat === '1'" type="success">归来</el-tag>
          <el-tag v-else type="warning">隔离</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cpn" label="车牌号"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 获取详情按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="getOwn(scope.row.uid)"
          >获取出入数据详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户详情模态框 -->
    <el-dialog title="用户出行数据详情" :visible.sync="userDetailVis" width="80%" @close="userDetailClose">
      <!-- 内容主体区域 -->
      <el-table :data="userDetail" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="dt" label="时间" width="100"></el-table-column>
        <el-table-column prop="stat" label="出入状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.stat === '0'" type="warning">出门</el-tag>
            <el-tag v-else type="success">进入</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="eid" label="出入口id" width="100"></el-table-column>
        <el-table-column prop="stat" label="出行方式" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.stat === '0'" type="warning">步行</el-tag>
            <el-tag v-else-if="scope.row.stat === '1'" type="warning">自行车/电动车</el-tag>
            <el-tag v-if="scope.row.stat === '2'" type="warning">摩托车</el-tag>
            <el-tag v-else type="success">汽车</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cpn" label="车牌号"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDetailClose">关闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 展示的用户列表
      userList: [],
      // 当前用户所在小区id
      comid: '',
      // 用户列表页数
      pagenum: '',
      // 获取用户列表的参数对象
      ulistData: {},
      // 用户出行详情列表对象
      userDetail: [],
      // 用户出行信息模态框展示
      userDetailVis: false
    }
  },
  created () {
    this.comid = window.sessionStorage.getItem('groupid')
    // 获取用户列表
    // 默认获取第一页
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      this.ulistData = { groupid: Number(this.comid) }
      // this.ulistData = JSON.stringify(this.ulistData)
      const res = await this.$http.post(
        '/microsign/api/com/userlist',
        this.ulistData
      )
      this.userList = res.data
      console.log(res)
    },
    // 获取用户跟踪数据
    async getOwn (id) {
      const param = { groupid: Number(this.comid), uid: id }
      const res = await this.$http.post('/microsign/api/com/trace', param)
      this.userDetail = res.data
      console.log(res)
      // 展示模态框
      this.userDetailVis = true
    },
    // 对话框关闭
    userDetailClose () {
      this.userDetailVis = false
    }
  }
}
</script>

<style>
</style>
