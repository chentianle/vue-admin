<template>
  <div id="home_page">
    <home_admin v-if="userType === 0 || userType === 1" />
    <home_community v-if="userType === 2 || userType === 3" />
  </div>

</template>

<script>
  export default {
    data(){
      return{
        userType:0
      }
    },
    mounted(){
      this.userType = this.$store.state.user.hospitalId
    },
    components:{
      home_admin:()=> import('./homeModel/home_admin'),
      home_community:()=> import('./homeModel/home_community'),
    },
  }
</script>
