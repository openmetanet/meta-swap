<template>
  <div id='app'>
    <!-- <img src="./assets/image/fix.png" alt="">
    <div >升级中，请稍后交易...</div> -->
  <keep-alive>
   <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view> 
  </div>
</template>

<script>

export default {
  name:"App",
  components: {
  },
  data() {
    return {
     
    }
  },
  computed: {
  },
  watch: {},
  methods: {

      autoChange() {
      switch (navigator.language?.substring(0,2).toLowerCase() || navigator.browserLanguage?.substring(0,2).toLowerCase()) {
        case "en":
          this.$i18n.locale = "en";
          this.$store.commit("setLang",this.$i18n.locale);
          break;
        case "zh":
          this.$i18n.locale = "zh";
          this.$store.commit("setLang",this.$i18n.locale);
          break;
        default:
          break;
      }
    },
    isMobile(){
      let userAgentInfo =navigator.userAgent.toLowerCase()
      let agents=["android", "iphone","symbianos", "windows phone","ipad", "ipod"];
      let ismobile= agents.some(ele=>{
        return userAgentInfo.indexOf(agents[ele]) >=0
      })
      this.$store.commit('getUserAgent',ismobile)
     
    }
  },
  created() {
    this.autoChange()
    this.isMobile()
  },

  mounted() {
    
  },
}
</script>

<style lang='scss'>
html body{
  font-size: 14px;
  font-family: "PingFang SC sans-serif","PingFang SC",sans-serif,"-apple-system-font","RobotoRegular","Droid Sans","Avenir","Helvetica","Arial";
  text-size-adjust: 100% !important;
 
}
#app{
  width: 100vw;
  font-family:PingFang SC sans-serif;
  font-weight: bold;
  // height: 100vh;
  // background-color: #fff;
  // opacity: 0.45;
  // z-index: 2;
  // left: 0;
  // top: 0;
  // position: fixed;
  // img{
  //   width: 100%;
  //   height: 100%;
  // }
  // div{
  //   width: 35.714286rem /* 500/14 */;
   
  //   margin-left:-17.857143rem /* 250/14 */;
    
  //   position: absolute;
  //   top: 5%;
  //   left: 50%;
  //   font-size: 3.571429rem /* 50/14 */;
  //   color: red;
  //   font-family: SF Pro Medium !important;
  //   font-weight: bold;
  //   z-index: 999;
  // }

  
  
}
.van-popup.van-popover.van-popover--dark{
 .van-popover__content{
   .van-popover__action{
     width: 3.571429rem /* 50/14 */ !important;
     padding: 0 .714286rem /* 10/14 */ !important;
   }
 }
}
// @media screen and (max-width: 750px){
//   #app{
//     div{
//     width: 22.857143rem /* 320/14 */;
//     margin-left:-11.428571rem /* 160/14 */;
//     font-size: 2.142857rem /* 30/14 */;
   
//     }
//   }
// }
// @media screen and (min-width: 413px) and (max-width: 749px){
//   .van-popup.van-popover.van-popover--dark{
//   left: 320px !important ;
 
// }
// }
// @media screen and (max-width: 750px){
//   .van-popup.van-popover.van-popover--dark{
//   left: 785px !important ;
//   .van-popover__arrow{
//     left:50%
//   }
// }
// }
// @media screen and (max-width: 325px){
//   .van-popup.van-popover.van-popover--dark{
//   left: 225px !important ;
 
// }
// }
</style>
