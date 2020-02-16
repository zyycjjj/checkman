<template>
  <div>
  <h1>动态显示</h1>
  <div>签入人数{{ sign_in  }}</div>
  <div>签出人数{{ sign_out  }}</div>
  </div>
</template>
<script>
let msgServer
export default {
  props: {
    sign_in: Number,
    sign_out: Number
  },
  created () {
    this.sign_in = 0
    this.sign_out = 0
  },
  methods: {
    ssereg () {
      this.$sse('/microsign/api/push/adm', { format: 'json' })
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
