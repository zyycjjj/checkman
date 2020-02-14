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

  data () {
    return {
      sign_in: 0,
      sign_out: 0
    }
  },
  mounted () {
    this.$sse('/microsign/api/push/adm', { format: 'json' })
      .then(sse => {
        // Store SSE object at a higher scope
        msgServer = sse

        // Catch any errors (ie. lost connections, etc.)
        sse.onError(e => {
          console.error('lost connection; giving up!', e)

          // This is purely for example; EventSource will automatically
          // attempt to reconnect indefinitely, with no action needed
          // on your part to resubscribe to events once (if) reconnected
          sse.close()
        })

        // Listen for messages without a specified event

        sse.subscribe('sign_in', (message, rawEvent) => {
          this.sign_in++
        })

        sse.subscribe('sign_in', (message, rawEvent) => {
          this.sign_out++
        })
      })
      .catch(err => {
        // When this error is caught, it means the initial connection to the
        // events server failed.  No automatic attempts to reconnect will be made.
        console.error('Failed to connect to server', err)
      })
  },
  beforeDestroy () {
    msgServer.close()
  }
}
</script>

<style>

</style>
