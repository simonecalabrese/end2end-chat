<template>
  <div class="account h-screen bg-gray-900">
    <div class="text-center">
      <h1 class="text-gray-400 py-8 text-xl">Account</h1>
      <p class="text-gray-300"><strong>Name: </strong>{{ user.name }}</p>
      <p class="text-gray-300"><strong>Username: </strong>{{ user.username }}</p>
      <p class="text-gray-300"><strong>Email: </strong>{{ user.email }}</p>
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
    if (app.user == null || app.user == 'null') {
      app.$router.push({ name: 'Login' })
    }

  }
}
</script>