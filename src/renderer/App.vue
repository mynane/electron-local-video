<template>
  <div id="app" class="theme-light">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'simple-player'
}
</script>

<style lang="scss" global>
.theme-light .frame span.top {
    background-color: #f3bab7;
}
.theme-light .frame span.min {
    background-color: #32dc36;
}
.theme-light .frame span.max {
    background-color: #ffbe2a;
}
.theme-light .frame span.close {
    background-color: #ff5f56;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.drag {
  -webkit-app-region: drag;
}
.float {
  position: absolute;
}
.left {
  float: left;
}
.right {
  float: right;
}
</style>
