<template>
  <div class="transictionWrap">
     <Selection />
  </div>
</template>

<script>

import Selection from './selection.vue'
export default {
name:"Transiction",
  components: {
    Selection,
  },
  data() {
    return {
      
    }
  },
 
}
</script>

<style lang='scss' scoped>
.transictionWrap{
    padding: 0 1.928571rem /* 27/14 */;
    
}
</style>