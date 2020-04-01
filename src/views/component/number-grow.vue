<template>
  <div class="number-grow-warp">
    <span ref="numberGrow" :style="{color}" :data-time="time" class="number-grow" :data-value="value">0</span>
  </div>
</template>

<script>
  export default {
    props: {
      color: {
        type: String,
        default: '#fff'
      },
      time: {
        type: Number,
        default: 1
      },
      value: {
        type: Number,
        default: 1000
      }
    },
    methods: {
      numberGrow (ele) {
        if(this.value < 191 ){
          ele.innerHTML = this.value
          return
        }
        let _this = this
        let step = parseInt((_this.value * 10) / (_this.time * 1000))
        let current = 0
        let start = 0
        let t = setInterval(function () {
          start += step
          if (start > _this.value) {
            clearInterval(t)
            start = _this.value
            t = null
          }
          if (current === start) {
            return
          }
          current = start
          ele.innerHTML = current.toString().replace(/(\d)(?=(?:\d{4}[+]?)+$)/g, '$1,')
        }, 10)
      }
    },
    mounted () {
      this.numberGrow(this.$refs.numberGrow)
    }
  }
</script>

<style>
  .number-grow-warp{
    transform: translateZ(0);
  }
  /*.number-grow {*/
  /*  font-family: Arial-BoldMT;*/
  /*  font-size: 45px;*/
  /*  margin: 10px 0 10px;*/
  /*  display: block;*/
  /*  line-height: 50px;*/
  /*  letter-spacing: 15px;*/
  /*}*/
  .number-grow {
    font-family: Arial-BoldMT;
    font-size: 29px;
    margin: 10px 0 10px;
    display: block;
    line-height: 29px;
    letter-spacing: 15px;
  }
</style>
