<template>
  <div>
    <remote-js src="//cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></remote-js>
    <remote-js src="//cdn.jsdelivr.net/npm/echarts-gl/dist/echarts-gl.min.js"></remote-js>
    <remote-js src="//cdn.jsdelivr.net/npm/echarts-stat/dist/ecStat.min.js"></remote-js>
    <remote-js src="//cdn.jsdelivr.net/npm/echarts/dist/extension/dataTool.min.js"></remote-js>
    <remote-js src="//cdn.jsdelivr.net/npm/echarts/map/js/china.js"></remote-js>
    <remote-js src="//cdn.jsdelivr.net/npm/echarts/map/js/world.js"></remote-js>
<!--    <remote-js src="//api.map.baidu.com/api?v=2.0&ak=dCQ5x8UeiE0wRdCEyNxUS6Gd0GdN4A34"></remote-js>-->
    <remote-js src="//cdn.jsdelivr.net/npm/echarts/dist/extension/bmap.min.js"></remote-js>
  </div>
</template>
<script>
  export default {
    components: {
      'remote-js': {
        render (createElement) {
          return createElement('script', {attrs: {type: 'text/javascript', src: this.src}})
        },
        props: {
          src: {type: String, required: true}
        }
      }
    }
  }
</script>
