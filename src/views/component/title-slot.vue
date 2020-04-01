<template>
  <div class="slot">
    <div class="title">{{title}}</div>
    <div :class="type? 'body2' : 'body' ">
      <slot></slot>
    </div>
  </div>
</template>

<script>
    export default {
      name: "title_slot",
      props:['title', 'type']
    }
</script>

<style scoped>
  .slot{
    border: 1px solid rgb(8,57,95);
    margin: 10px;
  }
  .title{
    background: rgb(12,31,55);
    border-bottom: 1px solid rgb(8,57,95);
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 35px;
    letter-spacing: .2em;
  }
  .body{
    background: rgb(8,21,38);
    padding: 20px 20px 20px 10px;
  }
  .body2{
    background: rgb(8,21,38);
    padding: 0px 20px 5px 10px
  }
</style>
