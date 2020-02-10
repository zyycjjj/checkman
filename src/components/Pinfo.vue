<template>
  <el-container class="pinfo">
    <el-tabs type="border-card">
      <el-tab-pane label="出入数量">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="date.ts" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="date.te" style="width: 100%;"></el-date-picker>
            </el-col>
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
        <el-button :click='excel' type='success'>导出出入信息为excel</el-button>
        <el-table :data="inoutData" border style="width: 100%">
          <el-table-column prop="uid" label="用户Id" width="180"></el-table-column>
          <el-table-column prop="bn" label="住址" width="180"></el-table-column>
          <el-table-column prop="dt" label="时间"></el-table-column>
          <el-table-column prop="v" label="出入状态"></el-table-column>
          <el-table-column prop="tt" label="出行方式"></el-table-column>
          <el-table-column prop="cpn" label="车牌号"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
// import echarts from 'echarts'
export default {
  data () {
    return {
      comid: '',
      date: {
        ts: '',
        te: ''
      },
      tableData: [
        {
          sign_in: 100,
          sign_out: 233
        }
      ],
      inoutData: []
    }
  },
  created () {
    this.getPeonum()
    this.getDetails()
    this.getcomid()
  },
  methods: {
    onSubmit () {
      // console.log('submit!')
      // 处理选择的日期的格式,修改date数据
      // 调用获取查询方法
      this.getPeonum()
    },
    getcomid () {
      this.comid = window.sessionStorage.getItem('comid')
    },
    // 获取出入人数
    async getPeonum () {
      const res = await this.$http.get('/microsign/api/com/stats', {
        params: {
          ts: this.date.ts,
          te: this.date.te
        }
      })
      console.log(res)
      this.date = res
    },
    // 获取出入详情
    async getDetails () {
      const res = await this.$http.get(`/microsign/api/com/details/${this.comid}`)
      this.inoutData = res
      console.log('获取出入详情')
    },
    // 导出为excel
    async excel () {
      const res = await this.$http.get(`/microsign/api/com/output?ts=${this.date.ts}&te=${this.date.te}&comid=${this.comid}`)
      console.log(res)
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
