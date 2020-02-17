<template>
  <div class="container">
  <el-row :gutter="40" class="panel-group">
    <el-col :span="24"><div class="grid-content">
    <el-button type="success" class="header">实时数据</el-button>
    </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../components/SvgIcon/peoples.svg" class="card-panel-icon" alt />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">签入人数</div>
          <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
           <span class="signin">{{ sign_in }}</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../components/SvgIcon/peoples.svg" class="card-panel-icon" alt />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">签出人数</div>
          <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
           <span class="signin">{{ sign_out }}</span>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="40" class="panel-group">
    <el-col :span="24"><div class="grid-content">
    <el-button type="danger" class="header">本小区预警</el-button>
    </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col2">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <img src="../components/SvgIcon/peoples.svg" class="card-panel-icon" alt />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">非本小区人员</div>
              <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
              <span class="signin"></span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col2">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <img src="../components/SvgIcon/peoples.svg" class="card-panel-icon" alt />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">疑似感染者</div>
              <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
              <span class="signin"></span>
            </div>
          </div>
        </el-col>
        <!-- <div>
          <audio id="audio" src="../components/audio/alert.wav" controls="controls" autoplay></audio>
        </div> -->
  </el-row>
   <el-row :gutter="40" class="panel-group">
      <el-col :span="24"><div class="grid-content">
    <el-button type="danger" class="header">外来人员预警</el-button>
    </div>
    </el-col>
     <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col2">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <img src="../components/SvgIcon/peoples.svg" class="card-panel-icon" alt />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">疑似感染者(外)</div>
              <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
              <span class="signin"></span>
            </div>
          </div>
        </el-col>
   </el-row>
    <div class="footer">
        <div class="footer-content">
            <div class="footer-record ">
                鲁ICP备19031576号-1
            </div>
            <div class="footer-company">
              <a href="www.zhiquwl.com" style="color:#333333">©2019-2022 淄博智趣物联科技有限公司 版权所有</a>
          </div>
        </div>
</div>
   <el-dialog :visible.sync="dialogVisible" width="500px" height="200px" :title="dialogType==='edit'?'Edit Register':'疑似者预警'" @close="close">
      <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <img src="../components/SvgIcon/peoples.svg" class="card-panel-icon" alt />
            </div>
             <h4 class="alertText">{{alertText}}</h4>
            <audio id="voice" src="../components/audio/alertclassic.mp3" autoplay></audio>
        </div>
      <!-- <el-form :model="regis" class="regisdialog" status-icon :rules="rules2" ref="regis" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="regis.nickName" placeholder=""/>
        </el-form-item>
      </el-form> -->
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirm()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import CountTo from 'vue-count-to'
let msgServer
export default {
  // components: {
  //   CountTo
  // },
  data () {
    return {
      // realNum: {
      //   sign_in: Number,
      //   sign_out: Number,
      //   alert_code: Number
      // },
      sign_in: Number,
      sign_out: Number,
      alert_code: Number,
      dialogType: '警告',
      dialogVisible: false,
      alertText: ''
      // imgUrl: '../assets/imgs/peoples.svg'
    }
  },
  // props: {
  //   sign_in: Number,
  //   sign_out: Number,
  //   alert_code: Number
  // },
  created () {
    this.sign_in = 0
    this.sign_out = 0
    this.alert_code = 0
    if (this.alert_code === 0) {
      this.dialogVisible = true
    }
  },
  mounted () {
    this.$sse(
      '/microsign/api/push/group/' + window.sessionStorage.getItem('groupid'),
      { format: 'json' }
    ).then(sse => {
      msgServer = sse
      sse.onError(e => {})

      sse.subscribe('alert', (message, rawEvent) => {
        this.alert_code = message.code
        if (this.alert_code === 1) {
          this.alertText = '警报：非本小区人员闯入！！！'
          this.dialogVisible = true
        }
        if (this.alert_code === 2) {
          this.alertText = '警报： 存在疑似感染者'
          this.dialogVisible = true
        }
        if (this.alert_code === 3) {
          this.alertText = '警报：非本小区人员闯入且疑似感染'
          this.dialogVisible = true
        }
      })

      sse.subscribe('sign_in', (message, rawEvent) => {
        this.sign_in++
      })

      sse.subscribe('sign_out', (message, rawEvent) => {
        this.sign_out++
      })
    })
  },
  methods: {
    // getUrl () {
    //   let inurl = 'http://localhost:8081/src/components'
    //   this.imgUrl = inurl
    // }
    // voice.addEventListener('canplay', () => {
    // audio.play()
    // }),
    confirm () {
      if (this.dialogVisible) {
        this.dialogVisible = false
      } else {
      }
    },
    close () {
      this.dialogVisible = false
    }
  },
  beforeDestroy () {
    msgServer.close()
  }
}
</script>

<style >
.panel-group {
  margin-top: 18px;
}
.header {
  width: 200px;
  height: 50px;
  padding-bottom: 10px;
  font-size: 15px;
  font-weight: 300;
}
.footer {
  position: absolute;
  width: 88%;
  bottom: 2.5em;
  background: #4d4d4d;
}
.footer-content {
  font-size: 16px;
  text-align: center;
}
.card-panel-icon {
  position:relative;
  float: left;
  width:50px;
  font-size: 48px;
}
.card-panel-col {
  margin-bottom: 32px;
}
.signin{
  width:30px;
  height:30px;
  font-size: 1.5rem
}
.panel-group .card-panel  {
    /* color: #40c9c6; */
}
.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
}
.card-panel:hover {
  color: #fff;
}
.card-panel-icon-wrapper {
  color: #fff;
}
.icon-people {
  background: #40c9c6;
}
.icon-message {
  background: #36a3f7;
}
.icon-money {
  background: #f4516c;
}
.icon-shopping {
  background: #34bfa3;
}
.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}

.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
}
.card-panel-description2 {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
  background: #f4516c;
}
.card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}
.card-panel-num {
  font-size: 20px;
}
</style>
