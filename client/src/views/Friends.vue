<template>
  <div class="friends h-screen bg-gray-900" v-if="user.friends != undefined">
    <h1 class="text-lg text-center text-gray-300 py-3">Your friends</h1>
    <div
      :class="{ 'friends_list w-11/12 md:w-5/12 lg:w-3/12 mx-auto': true, 'lg:flex lg:flex-row lg:w-screen justify-center': user.friends.filter(item => item.confirmed == true).length > 1 }"
      v-if="user.friends.filter(item => item.confirmed == true).length > 0">
      <div v-for="(el, index) in user.friends.filter(item => item.confirmed == true)" :key="index"
        :class="{ 'lg:w-12/12': true, 'lg:w-3/12': user.friends.filter(item => item.confirmed == true).length > 1 }">
        <div
          :class="{ 'friend bg-gray-700 hover:bg-gray-600 flex flex-row p-6 my-4 shadow-lg rounded-lg cursor-pointer text-gray-200': true, 'lg:w-12/12 mx-3': user.friends.filter(item => item.confirmed == true).length > 1 }"
          v-if="el.confirmed == true" @click="$router.push({ name: 'Chat', params: { username: el.username } })">
          <div class="friend_img rounded-full w-20 h-20 bg-gray-900"
            :style="'background-image:url(https://avatars.dicebear.com/api/gridy/' + el.username + '.svg)'"></div>
          <div class="friend_name my-auto ml-3" v-html="el.username"></div>
        </div>
      </div>
    </div>
    <h1 class="text-lg text-center mb-1 mt-16 block text-gray-300">Invite friends</h1>
    <div class="w-11/12 md:w-7/12 lg:w-5/12 mx-auto flex flex-row">
      <input type="text" placeholder="Insert the username who want to invite"
        class="bg-gray-700 shadow p-3 m-1 focus:outline-none rounded w-10/12 text-gray-200" v-model="friendToInvite">
      <button class="p-3 bg-green-400 block rounded my-3 w-2/12 ml-2" :disabled="inviteLoading"
        @click="inviteFriend"><span v-show="!inviteLoading">Invite</span><i class="fa fa-spinner"
          v-show="inviteLoading"></i></button>
    </div>
    <p v-html="inviteError" class="text-red-500 text-center"></p>
    <p v-show="inviteSuccess" class="text-green-600 text-center">User invited correctly</p>
    <h1 class="text-lg text-center my-4 mt-16 block text-gray-300">Incoming people requests</h1>
    <div
      :class="{ 'invites_list w-11/12 md:w-5/12 lg:w-3/12 mx-auto': true, 'lg:flex lg:flex-row': user.friends.filter(item => item.confirmed == false).length > 1 }"
      v-if="user.friends.filter(item => item.confirmed == false).length > 0">
      <div v-for="(el, index) in user.friends.filter(item => item.confirmed == false)" :key="index" class="w-12/12">
        <div
          :class="{ 'invite bg-gray-600 hover:bg-gray-700 flex flex-row p-6 my-4 shadow-lg rounded-lg items-center w-12/12': true, 'lg:w-5/12': user.friends.filter(item => (item.confirmed == false && hasInvited == false)).length > 1 }"
          v-if="el.confirmed === false && el.hasInvited === false">
          <div class="invite_img rounded-full w-20 h-20 bg-gray-900 bg-cover"
            :style="'background-image:url(https://avatars.dicebear.com/api/gridy/' + el.username + '.svg)'"></div>
          <div class="invite_name my-auto mx-3 text-gray-200" v-html="el.username"></div>
          <button class="p-4 rounded bg-green-200 hover:bg-green-300 mx-1 ml-auto" style="height:fit-content"
            @click="acceptInvite(el.username)">Accept</button>
          <button class="p-4 rounded bg-yellow-200 hover:bg-yellow-300 mx-1 mr-0"
            style="height:fit-content">Reject</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="css">
.fa-spinner {
  animation: spinning .56s ease-in-out infinite;
}

@keyframes spinning {
  from {
    transform: rotateZ(0);
  }

  to {
    transform: rotateZ(360deg);
  }
}
</style>
<script>
import { io } from "socket.io-client";
import { mapGetters } from 'vuex'
export default {
  name: 'Friends',
  data() {
    return {
      friendToInvite: '',
      inviteLoading: false,
      inviteError: '',
      inviteSuccess: false,
      socket: io(import.meta.env.VITE_SOCKETIO_URL),
    }
  },
  methods: {
    inviteFriend() {
      const app = this
      app.inviteSuccess = false
      app.inviteLoading = true
      app.inviteError = ''
      app.axios.post('/users/friends/invite', {
        username: app.friendToInvite
      }).then(res => {
        if (res.data.error == undefined && res.data.error != true) {
          app.socket.emit('invite', { to: res.data, from: app.user })
          app.inviteSuccess = true
          app.inviteLoading = false
          app.friendToInvite = ''
        }
        else {
          app.inviteError = res.data.message
          app.inviteLoading = false
        }
      })
    },
    acceptInvite(username) {
      this.axios.post('/users/friends/add', {
        username: username
      }).then(res => {
        if (res.data.error == undefined && res.data.error != true) {
          this.user.friends.find(el => el.username == username).confirmed = true
        }
      })
    },
    socketEvents() {
      const app = this
      //connection
      if (app.user.username)
        app.socket.emit('User connected', { username: app.user.username, id: app.user._id })

      //Receiving invite
      app.socket.on('invite', msg => {
        app.user.friends.push({
          user_id: msg.from.id,
          username: msg.from.username,
          public_key: msg.from.public_key,
          created_at: new Date().toISOString(),
          confirmed: false,
          hasInvited: false
        })
        app.$forceUpdate()
      })
    }
  },
  computed: {
    ...mapGetters(['axios']),
    user: {
      get: function () {
        return this.$store.state.user
      },
      set: function (newValue) {
        this.$store.state.user = newValue
      }
    }
  },
  mounted() {
    const app = this
    let wait = setInterval(() => {
      if (app.user.friends) {
        app.socketEvents()
        clearInterval(wait)
      }
    }, 100)

  }
}
</script>