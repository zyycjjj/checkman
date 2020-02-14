<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-button type="warning" @click="addCom">添加组织(管理账号)</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 80%">
      <el-table-column prop="id" label="组织ID"></el-table-column>
      <el-table-column prop="nm" label="组织名"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="getComdetail(scope.row.id)">获取组织详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 组织详情模态框 -->
    <el-dialog title="组织详情" :visible.sync="comdetVis" width="40%" @close="comdeClose">
      <!-- 内容主体区域 -->
        <el-card>
          <el-row>
            <el-col :span="6">
              <el-tag type="primary" effect="dark">组织名称</el-tag>
            </el-col>
            <el-col :span="2">:</el-col>
            <el-col :span="16">
              <el-tag :model="this.comdet.n">{{this.comdet.n}}</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-tag type="primary" effect="dark">组织类型</el-tag>
            </el-col>
            <el-col :span="2">:</el-col>
            <el-col :span="16">
              <el-tag :model="this.comdet.n">{{this.comdet.s ===0? "社区":"企业"}}</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-tag type="primary" effect="dark">登录名称</el-tag>
            </el-col>
            <el-col :span="2">:</el-col>
            <el-col :span="16">
              <el-tag :model="this.comdet.n">{{this.comdet.u}}</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-tag type="primary" effect="dark">注册时间</el-tag>
            </el-col>
            <el-col :span="2">:</el-col>
            <el-col :span="16">
              <el-tag :model="this.comdet.n">{{this.comdet.rt}}</el-tag>
              <!-- <input type="text" disabled v-model="this.comdet.n" /> -->
            </el-col>
          </el-row>
        </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="comdeClose">关闭</el-button>
        <!-- 可加修改组织信息功能 -->
        <!-- <el-button type="primary" @click="addEnty">确 定</el-button> -->
      </span>
    </el-dialog>
    <!-- 添加组织 -->
    <el-dialog title="添加组织" :visible.sync="addDialogvisiable" width="40%" @close="addialogClose">
      <!-- 内容主体区域 -->
      <el-form ref="addcomFormRef" :model="cominfo" :rules="addFormRules" label-width="100px">
        <el-form-item label="组织名称" prop="n">
          <el-input v-model="cominfo.n"></el-input>
        </el-form-item>
        <el-form-item label="组织类型" prop="s">
          <el-select v-model="cominfo.s" placeholder="请选择">
            <el-option v-for="item in options" :key="item.s" :label="item.label" :value="item.s"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录名" prop="u">
          <el-input v-model="cominfo.u"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="p">
          <el-input v-model="cominfo.p"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addialogClose">取 消</el-button>
        <el-button type="primary" @click="addCompany">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      // 组织详情对话框显示隐藏
      comdetVis: false,
      // 组织详情对象
      comdet: {},
      // 添加组织模态框显示隐藏
      addDialogvisiable: false,
      // 待添加的组织信息
      cominfo: {},
      // 添加表单验证规则
      addFormRules: {
        n: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
        s: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
        u: [{ required: true, message: '请输入用户登陆名', trigger: 'blur' }],
        p: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]

      },
      options: [
        {
          s: 0,
          label: '社区'
        },
        {
          s: 1,
          label: '企业'
        }
      ]
    }
  },
  created () {
    // 获取组织列表
    this.getComlist()
  },
  methods: {
    // 获取组织列表函数
    async getComlist () {
      const res = await this.$http.get('/microsign/api/adm/comlist')
      this.tableData = res.data
    },
    // 获取组织详情
    async getComdetail () {
      const res = await this.$http.get('/microsign/api/adm/com')
      console.log(res)
      this.comdet = res.data
      this.comdetVis = true
    },
    // 监听组织详情对话框关闭事件
    comdeClose () {
      this.comdetVis = false
      this.comdet = {}
    },
    // 添加组织对话框
    addCom () {
      this.addDialogvisiable = true
    },
    addCompany () {
      this.$refs.addcomFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.cominfo)
        this.cominfo = JSON.stringify(this.cominfo)
        const res = await this.$http.post('/microsign/api/adm/com', this.cominfo)
        if (res.status !== 200) return this.$message.error('添加组织失败')
        // 重新获取组织列表显示
        this.addDialogvisiable = false
        this.getComlist()
      })
    },
    addialogClose () {
      this.$refs.addcomFormRef.resetFields()
      this.addDialogvisiable = false
    }
  }
}
</script>

<style scoped>
.el-row {
  height: 30px;
  margin-bottom: 10px;
}
.el-table {
  margin-top: 60px;
}
</style>
