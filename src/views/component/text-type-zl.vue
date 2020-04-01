<template>
  <div class="text-zl">
    <div class="name"><span>{{name}}</span></div>
    <div :style="{color}" class="value">{{value}} </div>
    <div :style="{color}" v-if="newNum" style="color: white;">较昨日 <span class="zt" >{{newNum > 0 ? '+ ' + newNum : newNum}}</span></div>
  </div>
</template>

<script>
    export default {
      name: "text-zl",
      props:{
        name:{
          type:String,
          default:''
        },
        value:{
          default:0
        },
        newNum:{
          default:0
        },
        color:{
          type:String,
          default:'#fff'
        }

      }
    }
</script>

<style scoped>
  .text-zl{
    background: linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) left top no-repeat,
    linear-gradient(to bottom, rgb(8,57,95), rgb(8,57,95)) left top no-repeat,
    linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) right top no-repeat,
    linear-gradient(to bottom, rgb(8,57,95), rgb(8,57,95)) right top no-repeat,
    linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) left bottom no-repeat,
    linear-gradient(to bottom, rgb(8,57,95), rgb(8,57,95)) left bottom no-repeat,
    linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) right bottom no-repeat,
    linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) right bottom no-repeat;
    background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
    width: 100%;
    /*background: linear-gradient(to bottom,rgb(45,123,169) 40%, rgb(25,26,59) 90%);*/
    padding: 13px 0 13px;
    margin:8px 10px;
    display: inline-block;
    text-align: center;
  }
  .name{
    /*letter-spacing: 5px;*/
    color: rgb(48,147,177);
    font-weight: 400;
  }
  .name span {
    background: linear-gradient(to bottom, rgb(81,253,237), rgb(69,172,244));
    -webkit-background-clip: text;
    color: transparent;
  }
  .value{
    position: relative;
    color: white;
    font-size: 38px;
    font-weight: 400;
    line-height: 48px;
  }
  .zt{
    /*position: absolute;*/
    font-size: 18px;
    /*bottom: 0;*/
  }

</style>
