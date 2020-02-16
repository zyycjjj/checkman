<template>
  <div>
    <h1>动态显示</h1>
    <div>签入人数{{ sign_in  }}</div>
    <div>签出人数{{ sign_out  }}</div>

    <h4 class="red" v-if="alert_code==1">非本小区人员报警 </h4>
    <h4 class="red" v-else-if="alert_code==2">疑似感染者报警 </h4>
    <h4 class="red" v-else-if="alert_code==3">非本小区且疑似感染者报警 </h4>
    <p>    建议有一个醒目的提醒，几秒钟后自动消除</p>
  </div>
</template>
<script>
let msgServer
export default {

  props: {
    sign_in: Number,
    sign_out: Number,
    alert_code: Number
  },
  created () {
    this.sign_in = 0
    this.sign_out = 0
    this.alert_code = 0
  },
  methods: {

    ssereg () {
      this.$sse('/microsign/api/push/group/' + window.sessionStorage.getItem('groupid'), { format: 'json' })
        .then(sse => {
          msgServer = sse

          sse.onError(e => {
            this.ssereg()
          })
          // Listen for messages without a specified event

          sse.subscribe('sign_in', (message, rawEvent) => {
            this.sign_in++
          })

          sse.subscribe('sign_out', (message, rawEvent) => {
            this.sign_out++
          })

          sse.subscribe('alert', (message, rawEvent) => {
            this.alert_code = message.code
          })
        })
    }
  },
  mounted () {
    this.ssereg()
  },
  beforeDestroy () {
    msgServer.close()
  }
}
</script>

<style>

</style>
