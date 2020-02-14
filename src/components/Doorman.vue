<template>
  <div>
    <el-row>
      <el-col :span="6"></el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="addDialogvisiable = true"
        >点击增加入口</el-button>
      </el-col>
    </el-row>
    <el-table :data="DoorData" border style="width: 100%">
      <el-table-column prop="name" label="大门" width="300"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="changeEntyVis(scope.row)"
          >修改</el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delEnty(scope.row.id)"
          >删除</el-button>
          <el-tooltip effect="dark" content="获取二维码" placement="top" :enterable="false">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="getPic(scope.row.id)"
            >获取出入口二维码</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加入口对话框模态框 -->
    <el-dialog title="添加入口" :visible.sync="addDialogvisiable" width="50%" @close="addialogClose">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="entrytip" :rules="addFormRules" label-width="70px">
        <el-form-item label="入口名" prop="n">
          <el-input v-model="entrytip.n"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addialogClose">取 消</el-button>
        <el-button type="primary" @click="addEnty">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改入口对话框模态框 -->
    <el-dialog
      title="修改"
      :visible.sync="changeDialogvisiable"
      width="50%"
      @close="changedialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form ref="changeFormRef" :model="entyinfo" :rules="changeFormRules" label-width="70px">
        <el-form-item label="入口名" prop="name">
          <el-input v-model="entyinfo.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogvisiable = false">取 消</el-button>
        <el-button type="primary" @click="changeEnty">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示图片 -->
    <el-dialog title="门禁二维码" :visible.sync='imgVisable' width="25%" @close='imgdialogClose'>
      <img :src="imgUrl" class="ewm" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      comid: '',
      DoorData: [],
      // 控制添加用户对话框的显示与隐藏
      addDialogvisiable: false,
      changeDialogvisiable: false,
      // 添加的小区入口
      entrytip: {
        n: ''
      },
      // 待添加的数据
      addData: {},
      //
      addFormRules: {
        n: [{ required: true, message: '请输入入口', trigger: 'blur' }]
      },
      changeFormRules: {
        name: [{ required: true, message: '请输入入口', trigger: 'blur' }]
      },
      // 要修改的入口名称
      n: '',
      // 要修改的入口id
      id: '',
      // 要修改的入口信息
      entyinfo: {
        id: '',
        name: ''
      },
      // 修改的入口信息传参
      changeData: {},
      // 后端返回图片后做的转换
      imgUrl: '',
      // 二维码对话框
      imgVisable: false
    }
  },
  created () {
    // 调用获取入口列表的函数
    this.getEntylist()
    this.getcomid()
  },
  methods: {
    // 获取当前小区id
    getcomid () {
      this.comid = window.sessionStorage.getItem('comid')
    },
    // 获取入口列表
    getEntylist () {
      // 从sessionStorage中获取,并修改格式
      this.DoorData = JSON.parse(window.sessionStorage.getItem('entry_list'))
      console.log('获取入口列表成功')
    },
    // 监听添加入口对话框关闭事件
    addialogClose () {
      this.addDialogvisiable = false
      this.$refs.addFormRef.resetFields()
    },
    addEnty () {
      // 发请求增加入口 注意参数
      this.addDate = {
        n: this.entrytip.n,
        comid: this.comid
      }
      // this.addData = JSON.stringify(addDate)
      this.$refs.addFormRef.validate(async valid => {
        const res = await this.$http.post(
          '/microsign/api/com/entry',
          this.addData
        )
        console.log(res)
        if (res.status !== 200) return this.$message.warning('添加失败')
        // 重新调用获取入口列表的函数
        this.getEntylist()
        this.addDialogvisiable = false
      })
    },
    changeEnty () {
      const changeDate = {
        id: this.id,
        comid: this.comid,
        n: this.entyinfo.name
      }
      this.changeData = JSON.stringify(changeDate)
      this.$refs.changeFormRef.validate(async valid => {
        const res = await this.$http.post(
          '/microsign/api/com/entry',
          this.changeData
        )
        if (res.status !== 200) return this.$message.warning('修改失败')
        this.getEntylist()
        this.$message.success('修改成功')
        this.changeDialogvisiable = false
      })
    },
    changeEntyVis (info) {
      this.entyinfo = info
      this.id = info.id
      this.changeDialogvisiable = true
    },
    async delEnty (id) {
      const resConfirm = await this.$confirm(
        '此操作将永久删除该信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (resConfirm === 'confirm') {
        // 发请求删除,重新获取入口列表
        let delInfo = {
          id: id
        }
        console.log(delInfo)
        // delInfo = JSON.stringify(delInfo)
        const res = await this.$http.post(
          '/microsign/api/com/entry/del',
          delInfo
        )
        if (res.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
      } else {
        this.$message.info('取消删除操作')
      }
      this.getEntylist()
    },
    // 获取对应入口的二维码图片
    async getPic (id) {
      // 发请求 拿图片
      // const res = await this.$http.get(
      //   `/microsign/api/com/qrcode/${this.comid}/${id}`
      // )
      // console.log(res)
      let url = `/microsign/api/com/qrcode/${this.comid}/${id}`
      this.$http
        .get(url, { responseType: 'arraybuffer' })
        .then(function (data) {
          console.log(data)
          this.imgUrl =
            'data:image/png;base64,' +
            btoa(
              new Uint8Array(data.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
          // 这里如果不清楚 new Uint8Array(data.data) 中data的指代，就看看最上面的那个图
        })
        .catch(function (err) {
          console.error(err)
        })
    }
  }
}
</script>

<style lang='less' scoped>
.el-row {
  width: 100%;
  height: 30px;
}
</style>
