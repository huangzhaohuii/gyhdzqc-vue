<template>
  <div class="test" ref="msg">

  </div>
</template>

<script>
  export default {
    name : 'Message',
    data() {
      return {
        websock: null,
        username: null,
        websock: null,
        count: 0
      }
    },
    created() {
      this.username = this.$store.state.username;
    },
    mounted(){
      // this.initWebSocket();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://127.0.0.1:8080/websocket/admin";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
      console.log(this.websock)
        if (this.websock.readyState===1) {
          let actions = {"test":"12345"};
          this.websocketsend(JSON.stringify(actions));
        }
        
      },
      websocketonerror(){//连接建立失败重连
        for(var i=0;i<3;i++){
          this.initWebSocket();
        }
      },
      websocketonmessage(e){ //数据接收
        console.log(e.data)
        this.count = e.data  
        this.$emit('count', e.data)
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
    },
  }
</script>