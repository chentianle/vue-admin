<template>
  <transition name="fade">
    <div :class="'global_size--'+text">
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  export default {
    computed: {
      text: {
        get () { return this.$store.state.common.layoutSize }
      }
    },
    mounted() {
      console.log('是1',this.$store.state.user.hospitalId)
      console.log('是2',this.$store.state.user.id)
    }
  }
</script>
