<template>
  <div class="container">
    <el-form ref="form" :model="date" label-width="130px">
      <el-form-item label="请选择开始时间">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="date.ts"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">点击查询</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe border :data="statsData" style="width: 50%">
      <el-table-column prop="com_name" label="组织名称" width="180"></el-table-column>
      <el-table-column prop="sign_out" label="签出数量" width="180"></el-table-column>
      <el-table-column prop="sign_in" label="签入数量"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: {
        ts: ''
      },
      statsData: []
    }
  },
  created () {
    this.getstats()
  },
  methods: {
    onSubmit () {
      // console.log('submit!')
      // 处理选择的日期的格式,修改date数据
      // 调用获取查询方法
      this.getstats()
      console.log(this.date.ts)
    },
    async getstats () {
      console.log(this.date.ts)
      const res = await this.$http.get(`/microsign/api/adm/stats?ts=${this.date.ts}`)
      this.statsData = res.data
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  position: relative;
  .el-table{
    position: absolute;
    left: 50%;
    transform: translateX(-50%)
  }
}
</style>
