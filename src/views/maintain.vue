<template>
  <div class="webfixWrap">
    <div class="imgWrap">
      <img src="../assets/image/webFix.jpg" alt="" />
      <p>网站维护中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Maintain",
};
</script>

<style lang="scss" scoped>
.webfixWrap {
  .imgWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 100%;
      height: 100%;
    }
    p {
      font-size: 30px;
      padding: 10px;
    }
  }
}
</style>
