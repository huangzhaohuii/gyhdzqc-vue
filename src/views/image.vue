<template>
    <div class="image-class">
    </div>
</template>

<script>
export default {
    data(){
        return {
           count:"",//倒计时
        }
    },
    created(){
        this.countDown()
    },
    methods:{
        //倒计时
        countDown(){
            const TIME_COUNT = 3;
            if(!this.timer){
                this.count = TIME_COUNT;
                this.show = false;
                this.timer = setInterval(()=>{
                if(this.count > 0 && this.count <= TIME_COUNT){
                    this.count--;
                }else{
                    this.show = true;
                    clearInterval(this.timer);
                    this.timer = null;
                    //跳转的页面写在此处
                    this.$router.push({ path: this.redirect || "/" });
                }
            },1000)
            }

        }
    }
}
</script>

<style scoped>
.image-class {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/temporary_image.png");
  background-size: 100% 105%;
}
</style>