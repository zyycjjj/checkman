<template>
  <el-container class="pinfo">
    <el-tabs type="border-card">
      <el-tab-pane label="出入数量">
        <el-form ref="form" :model="date" label-width="130px">
          <el-form-item label="请选择开始时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="date.ts" format="yyyy-MM-dd"
      value-format="yyyyMMdd" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">点击查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 数据展示 -->
        <el-card>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="sign_in" label="进入人数" width="180"></el-table-column>
            <el-table-column prop="sign_out" label="离开人数" width="180"></el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="出入信息">
        <el-button @click="excel" type="success">导出出入信息为excel</el-button>
        <el-table :data="inoutData" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="uid" label="用户Id" width="100"></el-table-column>
          <el-table-column prop="bn" label="住址" width="180"></el-table-column>
          <el-table-column prop="dt" label="时间"></el-table-column>
          <el-table-column prop="v" label="出入状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.v === '0'" type="warning">离开</el-tag>
              <el-tag v-else type="success">进入</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="tt" label="出行方式">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.tt === '0'">步行</el-tag>
              <el-tag v-else-if="scope.row.tt === '1'">自行车/电动车</el-tag>
              <el-tag v-else-if="scope.row.tt === '2'">摩托车</el-tag>
              <el-tag v-else type="success">汽车</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cpn" label="车牌号"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 获取住户详情信息 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="getUdetail(scope.row.uid)"
              >住户详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 住户详情信息展示对话框 -->
    <el-dialog title="住户详细信息" :visible.sync="userDetailVis" width="70%" @close="userDetailClose">
      <!-- 内容主体区域 -->
      <el-table :data="userDetail" border style="width: 100%">
        <el-table-column prop="mobile" label="手机号" width="100"></el-table-column>
        <el-table-column prop="name" label="用户名称" width="80"></el-table-column>
        <el-table-column prop="buid" label="楼号" width="50"></el-table-column>
        <el-table-column prop="unit" label="单元号" width="60"></el-table-column>
        <el-table-column prop="roomid" label="房间号" width="60"></el-table-column>
        <el-table-column prop="stat" label="当前状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.stat === '-1'" type="success">外出</el-tag>
            <el-tag v-else-if="scope.row.stat === '0'" type="warning">未知</el-tag>
            <el-tag v-else-if="scope.row.stat === '1'" type="success">归来</el-tag>
            <el-tag v-else type="warning">隔离</el-tag>
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
// import echarts from 'echarts'
export default {
  data () {
    return {
      comid: '',
      date: {
        ts: ''
      },
      tableData: [],
      inoutData: [],
      data1: [],
      // 住户详细信息
      userDetail: [],
      // 住户详细信息对话框的显示与隐藏
      userDetailVis: false
    }
  },
  created () {
    this.getPeo()
    this.getDetails()
    this.getcomid()
  },
  methods: {
    onSubmit () {
      // console.log('submit!')
      // 处理选择的日期的格式,修改date数据
      // 调用获取查询方法
      console.log(this.date.ts)
      this.getPeo()
    },
    getcomid () {
      this.comid = window.sessionStorage.getItem('comid')
    },
    // 获取出入人数
    async getPeo () {
      const res = await this.$http.get(`http://localhost:3000/stats?ts=${this.date.ts}`)
      this.data1.push(res.data)
      this.tableData = this.data1
      this.data1 = []
    },
    // 获取出入详情
    async getDetails () {
      // const res = await this.$http.get(`/microsign/api/com/details/${this.comid}`)
      // this.inoutData = res
      // console.log(res)
      const res = await this.$http.get('http://localhost:3000/details')
      this.inoutData = res.data
    },
    // 导出为excel
    excel () {
      this.$http.post('/microsign/api/com/output', this.date, { responseType: 'arraybuffer' }).then((_res) => {
        const blob = new Blob([_res.data], { type: 'application/vnd.ms-excel;' })
        const a = document.createElement('a')
        // 生成文件路径
        const href = window.URL.createObjectURL(blob)
        a.href = href
        const _fileName = _res.headers['content-disposition'].split(';')[1].split('=')[1].split('.')[0]
        // 文件名中有中文 则对文件名进行转码
        a.download = decodeURIComponent(_fileName)
        // 利用a标签做下载
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(href)
      })
    },
    // 获取用户详细信息
    async getUdetail () {
      const res = await this.$http.get('http://localhost:3000/user')
      this.userDetail.push(res.data)
      this.userDetailVis = true
      console.log(res)
    },
    // 监听用户详情信息关闭情况
    userDetailClose () {
      this.userDetailVis = false
      this.userDetail = []
    }

  }
}
</script>

<style lang='less' scoped>
.pinfo {
  height: 100%;
  width: 100%;
  position: relative;
  .el-tabs {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .el-card {
    width: 37%;
    margin-left: 200px;
  }
}
</style>
