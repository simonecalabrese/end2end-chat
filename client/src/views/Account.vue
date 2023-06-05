<template>
  <div class="account h-screen bg-gray-900">
    <div class="text-center">
      <h1 class="text-gray-400 py-8 text-xl">Account</h1>
      <h1 class="text-gray-300 text-3xl" v-html="user.username"></h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data() {
    return {
      user: {}
    }
  },
  mounted() {
    const app = this
    app.user = JSON.parse(localStorage.getItem('user'))

    //login check
    if(app.user == null || app.user == 'null') {
      app.$router.push({name: 'Login'})
    }

  }
}
</script>