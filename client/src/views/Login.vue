<template>
  <div class="login py-12 h-screen bg-gray-900">
    <h1 class="text-2xl py-5 text-center text-gray-300">Login</h1>
    <div @keyup.enter="login"
      class="flex flex-col w-11/12 md:w-5/12 lg:w-3/12 bg-gray-700 rounded-lg shadow-lg p-8 m-auto">
      <input type="text" v-model="username" class="bg-gray-600 rounded text-gray-200 shadow p-3 m-1 focus:outline-none"
        placeholder="Username" autofocus>
      <input type="password" v-model="password"
        class="bg-gray-600 rounded text-gray-200 shadow p-3 m-1 focus:outline-none" placeholder="Password">
      <button @click="login" class="p-3 bg-green-400 block rounded my-3">Login</button>
      <p class="text-red-500" v-html="loginError"></p>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import Buffer from 'buffer';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      loginError: '',
      Buffer: Buffer.Buffer,
      socket: io(import.meta.env.VITE_SOCKETIO_URL)
    }
  },
  computed: {
    axios: {
      get: function () {
        return this.$store.state.axios
      },
      set: function (newValue) {
        this.$store.state.axios = newValue
      }
    },
    user: {
      get: function () {
        return this.$store.state.user
      },
      set: function (newValue) {
        this.$store.state.user = newValue
      }
    }
  },
  methods: {
    login() {
      const app = this
      app.axios.post('/auth/login', {
        username: app.username,
        password: app.password
      }).then(res => {
        if (res.data.error == undefined && res.data.error != true) {
          localStorage.setItem('access_token', res.data.access_token)
          app.axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
          app.axios.get('/profile').then(res => {
            localStorage.setItem('user', JSON.stringify(res.data))
            app.user = res.data
            //Encrypt private_key
            crypto.subtle.importKey(
              "raw",
              app.Buffer.from(app.password + app.user.addToPass, 'utf8').buffer,
              {
                name: "AES-CTR",
                counter: app.user.private_key.iv,
                length: 64
              },
              true,
              ["decrypt"]
            ).then(res => {
              let key = res
              key.algorithm.counter = app.user.private_key.iv
              crypto.subtle.decrypt({
                name: 'AES-CTR', counter: app.Buffer.from(app.user.private_key.iv, 'hex').buffer,
                length: 64
              }, key, app.Buffer.from(app.user.private_key.content, 'hex').buffer).then(res => {
                app.user.private_key = app.Buffer.from(res).toString('utf8')
                localStorage.setItem('private_key', app.user.private_key)
                app.$router.push({ name: 'Friends' })
              })
              app.socket.emit('User connected', { username: app.user.username, id: app.user._id })
            });
          })
        }
        else {
          app.username = ''
          app.password = ''
          app.loginError = res.data.message
        }
      })
    }
  }
}
</script>