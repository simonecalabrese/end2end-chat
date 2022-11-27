<template>
  <div id="app" :style="($route.name == 'Chat') ? 'height:100vh;overflow:hidden;' : ''">
    <!-- This example requires Tailwind CSS v2.0+ -->
    <nav class="bg-gray-800" @mouseleave="dropdown = false">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <button type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu" aria-expanded="false" @click="menuDropdown = !menuDropdown">
              <span class="sr-only">Open main menu</span>
              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0 flex items-center">
              <!--LOGO image here-->
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <router-link :to="{name: 'Friends'}"
                  :class="{'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium':true, 'bg-gray-900 text-white':$route.name=='Friends'}"
                  aria-current="page" @click="dropdown = false" v-if="Object.keys(user).length > 0">Friends
                </router-link>
                <!-- <router-link :to="{name: 'Chat'}" :class="{'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium':true, 'bg-gray-900 text-white':$route.name=='Chat'}" @click="dropdown = false" v-if="Object.keys(user).length > 0">Chat</router-link> -->
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <!-- Profile dropdown -->
            <div class="ml-3 relative z-50">
              <div>
                <router-link :to="{name: 'Register'}" v-if="Object.keys(user).length == 0"
                  :class="{'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium':true, 'bg-gray-900 text-white':$route.name=='Register'}"
                  @click="dropdown = false">Register</router-link>
                <router-link :to="{name: 'Login'}" v-if="Object.keys(user).length == 0"
                  :class="{'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium':true, 'bg-gray-900 text-white':$route.name=='Login'}"
                  @click="dropdown = false">Login</router-link>

                <button v-if="Object.keys(user).length > 0" type="button" @mouseover="dropdown = true"
                  class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="sr-only">Open user menu</span>
                  <router-link :to="{name: 'Account'}" v-html="user.username"
                    class="text-gray-200 text-base my-auto mx-2 align-middle"></router-link>
                  <img class="h-8 w-8 rounded-full"
                    :src="'https://avatars.dicebear.com/api/gridy/'+user.username+'.svg'" alt="">
                </button>

              </div>
              <div
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-600 ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1"
                v-show="dropdown">
                <!-- Active: "bg-gray-100", Not Active: "" -->
                <router-link :to="{name: 'Account'}"
                  class="inline-block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-500"
                  role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</router-link>
                <button @click="logout"
                  class="inline-block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-500"
                  role="menuitem" tabindex="-1" id="user-menu-item-1">Log out</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div :class="{'sm:hidden': true, 'block':menuDropdown, 'hidden': !menuDropdown}" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link :to="{name: 'Friends'}"
            :class="{'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium':true, 'bg-gray-900 text-white': $route.name == 'Friends'}"
            @click="dropdown = false" v-if="Object.keys(user).length > 0">Friends</router-link>
          <!-- <router-link :to="{name: 'Chat'}" :class="{'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium':true, 'bg-gray-900 text-white': $route.name == 'Chat'}" @click="dropdown = false" v-if="Object.keys(user).length > 0">Chat</router-link> -->
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>


<script>
export default {
  name: 'App',
  data() {
    return {
      dropdown: false,
      menuDropdown: false
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
    logout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('private_key')
      localStorage.removeItem('user')
      if (this.$route.name !== 'Login')
        this.$router.push({ name: 'Login' })
    }
  },
  mounted() {
    if (location.href.split('/').length === 4 && location.href.split('/')[3] === '') {
      //route is Home
      this.$router.push({ name: 'Login' })
    }
    //Login check
    let access_token = localStorage.getItem('access_token')
    let privk = localStorage.getItem('private_key')
    let user = localStorage.getItem('user')
    if (access_token) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      this.axios.get('/profile').then(res => {
        localStorage.setItem('user', JSON.stringify(res.data))
        this.user = res.data
      }).catch(e => {
        if(e.response.status === 401) {
          this.logout()
        }
        else if (e.response.status !== 401 && (!access_token || !privk || !user)) {
          this.logout()
        }
      })
    }
  }
}
</script>