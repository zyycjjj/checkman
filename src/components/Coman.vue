<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-button type="warning" @click="addCom">添加组织(管理账号)</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width:80%">
      <el-table-column prop="id" label="组织ID" width="100"></el-table-column>
      <el-table-column prop="com_name" label="组织名" width="150"></el-table-column>
      <el-table-column prop="login_name" label="登录名" width="150"></el-table-column>
      <el-table-column label="管理类型" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.power_level === 1">普通管理员</el-tag>
          <el-tag v-else>超级管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="getComdetail(scope.row)">获取组织详情</el-button>
          <el-button type="success" size="mini" @click="changeP(scope.row)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:80%">
      <el-button-group style="float:right;margin-top:20px">
        <el-button type="primary" icon="el-icon-arrow-left" @click="getPrepage">上一页</el-button>
        <el-button type="primary" @click="getNexpage">
          下一页
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
    </div>
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
            <el-tag :model="this.comdet.n">{{this.comdet.com_name}}</el-tag>
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
            <el-tag :model="this.comdet.login_name">{{this.comdet.login_name}}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-tag type="primary" effect="dark">注册时间</el-tag>
          </el-col>
          <el-col :span="2">:</el-col>
          <el-col :span="16">
            <el-tag :model="this.comdet.reg_datetime">{{this.comdet.reg_datetime}}</el-tag>
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
      <!-- 修改信息 -->
    <el-dialog title="修改信息" :visible.sync="editInfoVis" width="40%" @close="editClose">
      <!-- 内容主体区域 -->
      <el-form ref="editcomFormRef" :model="editInfo" :rules="editFormRules" label-width="100px">
        <el-form-item label="组织名称" prop="n">
          <el-input v-model="editInfo.n" disabled></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="u">
          <el-input v-model="editInfo.u" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="p">
          <el-input v-model="editInfo.p"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editClose">取 消</el-button>
        <el-button type="primary" @click="editCompany">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 修改信息对话框的显示隐藏
      editInfoVis: false,
      // 修改信息的绑定数据
      editInfo: {
        n: '',
        s: '',
        u: '',
        p: '',
        id: ''
      },
      // 页码
      num: 1,
      // 是否有上一页
      prePage: false,
      // 是否有下一页
      nextPage: false,
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
      const res = await this.$http.post(
        `/microsign/api/adm/comlist`,
        {
          num: this.num,
          size: 10
        }
      )
      console.log(res)
      this.prePage = res.data.hasPreviousPage
      this.nextPage = res.data.hasNextPage
      this.tableData = res.data.list
    },
    // 点击上一页
    getPrepage () {
      if (this.prePage) {
        this.num = this.num - 1
        this.getComlist()
      } else {
        this.$message.warning('没有上一页了')
      }
    },
    // 点击跳转下一页
    getNexpage () {
      if (this.nextPage) {
        this.num = this.num + 1
        this.getComlist()
      } else {
        this.$message.warning('没有数据了哦')
      }
    },
    // 获取组织详情
    async getComdetail (row) {
      console.log(row)
      this.comdet = row
      // const res = await this.$http.post('/microsign/api/adm/com')
      // console.log(res)
      // this.comdet = res.data
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
        // this.cominfo = JSON.stringify(this.cominfo)
        const res = await this.$http.post(
          '/microsign/api/adm/com',
          this.cominfo
        )
        if (res.status !== 200) return this.$message.error('添加组织失败')
        // 重新获取组织列表显示
        this.addDialogvisiable = !this.addDialogvisiable
        this.getComlist()
      })
    },
    addialogClose () {
      this.$refs.addcomFormRef.resetFields()
      this.addDialogvisiable = false
    },
    // 点击修改信息
    changeP (row) {
      this.editInfo.n = row.com_name
      this.editInfo.id = row.id
      this.editInfo.u = row.login_name
      this.editInfoVis = !this.editInfoVis
    },
    // 确认修改信息
    async editCompany () {
      const res = this.$http.post(`/microsign/api/adm/com`, {
        p: this.editInfo.p,
        id: this.editInfo.id
      })
      console.log(res)
      // if (res.r !== 0) return this.$message.warning('修改信息失败')
      this.$message.success('修改信息成功')
      this.editInfoVis = !this.editInfoVis
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
