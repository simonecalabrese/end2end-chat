<template>
  <div class="chat bg-gray-900 h-screen pt-6">
    <div :class="{ 'loading-overlay relative overflow-y-hidden': pageLoading }"
      class="chat-container w-12/12 md:w-10/12 lg:w-8/12 overflow-y-auto overflow-x-hidden relative rounded-xl shadow-xl mx-auto bg-gray-700">
      <div class="overflow-y-auto p-4 messages_list" ref="messageList">
        <div v-if="pageLoading" class="z-50 h-full relative flex flex-col items-center">
          <h1 class="text-center text-gray-300 mt-4"><i class="fa fa-spinner"></i></h1>
          <h1 class="text-center text-gray-300">Decrypting your messages...</h1>
        </div>
        <div class="absolute top-0 left-0 right-0 z-1 text-center bg-gray-800">
          <h1 class="text-xl mt-2 h-6 text-gray-200" v-html="receiverSelected.username"></h1>
          <span class="text-gray-400 text-sm h-6 items-center flex align-middle justify-center"><span
              v-if="typingStatus">Is typing...</span></span>
        </div>
        <div v-for="(el, index) in messages" :key="index" class="flex flex-row">
          <div
            :class="{ 'message p-3 rounded shadow-sm text-sm m-2 max-w-xs lg:max-w-lg': true, 'ml-auto mr-0': el.author == user.username, 'ml-0 mr-auto': el.author == receiverSelected.username }"
            v-if="(el.copy === true && el.author === user.username) || (el.copy === false && el.author === receiverSelected.username)">
            <span v-html="el.text" class="block"></span>
            <span v-html="new Date(el.created_at).toLocaleTimeString()" class="text-gray-500"></span>
          </div>
        </div>
      </div>
      <div
        class="input container absolute bottom-0 right-0 left-0 bg-gray-800 p-3 flex flex-row justify-center align-middle items-center"
        style="max-width:unset!important">
        <p :class="{ 'text-sm mr-2 text-gray-400': true, 'text-red-400': messageToSend.length > maxMessageLength }"
          v-html="messageToSend.length + '/' + maxMessageLength"></p>
        <input type="text" max="190"
          class="shadow-lg rounded bg-gray-600 text-gray-200 p-3 inline-block w-11/12 focus:outline-none"
          v-model="messageToSend" @keyup.enter="sendMessage()" @keydown="typing()">
        <div @click="sendMessage()">
          <i class="fas fa-paper-plane text-gray-500 hover:text-gray-600 text-2xl cursor-pointer ml-3"></i>
        </div>

      </div>
    </div>
  </div>
</template>
<style lang="css">
.chat-container {
  height: calc(100vh - 118px);
  max-width: unset !important;
  overflow-y: auto;
}

.messages_list {
  height: calc(100vh - 180px);
  padding-top: 60px;
}

.message {
  background: rgb(188, 255, 222);
  word-break: break-word;
}

.loading-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .75);
  z-index: 1;
}
</style>
<script>
import { mapGetters } from 'vuex'
import { io } from "socket.io-client";
import Buffer from 'buffer'
export default {
  name: 'Chat',
  data() {
    return {
      messages: [],
      maxMessageLength: 190,
      privateKeyFormatted: {},
      publicKeyFormatted: {},
      receiverPublicKeyFormatted: {},
      receiverSelected: {},
      messageToSend: '',
      pageLoading: true,
      socket: io(import.meta.env.VITE_SOCKETIO_URL),
      typingStatus: false,
      tout: {},
      Buffer: Buffer.Buffer
    }
  },
  props: ['username'],
  computed: {
    ...mapGetters(['axios', 'user'])
  },
  methods: {
    typing() {
      this.socket.emit('private typing', this.receiverSelected.username)
    },
    socketEvents() {
      const app = this
      // emit user connection event
      app.socket.emit('User connected', { username: app.user.username, id: app.user._id })
      // incoming event whene the receiver sends a new message
      app.socket.on('private message', async (msg) => {
        try {
          let res = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, app.privateKeyFormatted, app.Buffer.from(msg.text, 'base64'))
          msg.text = app.Buffer.from(res).toString()
          app.messages.push(msg)
          setTimeout(() => app.$refs.messageList.scrollTop = app.$refs.messageList.clientHeight + 99999, 100)
        }
        catch { }
      })

      // incoming event whene the receiver is typing
      app.socket.on('private typing', () => {
        app.typingStatus = true;
        clearTimeout(app.tout);
        app.tout = setTimeout(() => {
          app.typingStatus = false;
        }, 2300);
      })
    },
    async getMessages() {
      const res = await this.axios.get('/messages/' + this.receiverSelected.username)
      this.messages = res.data
    },
    async sendMessage() {
      const app = this
      if (app.messageToSend.length <= app.maxMessageLength) {
        // encrypt message to send using receiver public key
        const encryptedText = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, app.receiverPublicKeyFormatted, app.Buffer.from(app.messageToSend, 'utf8'));
        // encrypt message to send using sender public key
        const encryptedTextCopy = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, app.publicKeyFormatted, app.Buffer.from(app.messageToSend, 'utf8'));

        const res = await app.axios.post('/messages', {
          receiver: app.receiverSelected.username,
          text: app.Buffer.from(encryptedText).toString('base64'),
          textCopy: app.Buffer.from(encryptedTextCopy).toString('base64')
        })

        if (res.data.error == undefined && res.data.error != true) {
          // send to receiver through Socket.io
          app.socket.emit('private message', res.data.mex)

          let mex = res.data.copy
          mex.text = app.messageToSend
          app.messages.push(mex)
          app.messageToSend = ''
          setTimeout(() => app.$refs.messageList.scrollTop = app.$refs.messageList.clientHeight + 99999, 100)
        }
        else {
          console.log("Errore during send your message")
        }
      }
    },
    str2ab(str) {
      // convert a string into an ArrayBuffer
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    },
    async importPrivateKey(pem) {
      /*
      Import a PEM encoded RSA private key, to use for RSA-PSS signing.
      Takes a string containing the PEM encoded key, and returns a Promise
      that will resolve to a CryptoKey representing the private key.
      */
      const app = this
      // fetch the PEM string part between header and footer
      const pemHeader = "-----BEGIN PRIVATE KEY-----";
      const pemFooter = "-----END PRIVATE KEY-----";
      let pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length).split(/\s+/).join('').replace(/\s/g, '');
      // base64 decode the string to get the binary data
      let pemlength = pemContents.length
      const binaryDerString = window.atob(pemContents.substr(0, pemlength - 1));
      // convert from a binary string to an ArrayBuffer
      const binaryDer = app.str2ab(binaryDerString);
      try {
        const res = await window.crypto.subtle.importKey(
          "pkcs8",
          binaryDer,
          {
            name: "RSA-OAEP",
            hash: "SHA-256",
          },
          true,
          ["decrypt"]
        )

        // save formatted imported private key as CryptoKey
        app.privateKeyFormatted = res
        // decrypt all the sent/received messages in the chat
        app.messages.forEach(async el => {
          try {
            const dcrptdTxt = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, app.privateKeyFormatted, app.Buffer.from(el.text, 'base64'));
            el.text = app.Buffer.from(dcrptdTxt).toString()
          }
          catch { }
        })
        setTimeout(() => {
          if (app.$refs.messageList)
            app.$refs.messageList.scrollTop = app.$refs.messageList.clientHeight + 99999, 50
        })
      }
      catch (e) {
        alert("Something went wrong...", JSON.stringify(e))
      }
    },
    async importPublicKey(pem) {
      /*
      Import a PEM encoded RSA private key, to use for RSA-PSS signing.
      Takes a string containing the PEM encoded key, and returns a Promise
      that will resolve to a CryptoKey representing the private key.
      */
      const app = this
      // fetch PEM string part between header and footer
      const pemHeader = "-----BEGIN PUBLIC KEY-----";
      const pemFooter = "-----END PUBLIC KEY-----";
      let pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length).split(/\s+/).join('').replace(/\s/g, '');
      try {
        const res = await window.crypto.subtle.importKey(
          "spki",
          app.Buffer.from(pemContents, 'base64').buffer,
          {
            name: "RSA-OAEP",
            hash: "SHA-256",
          },
          true,
          ["encrypt"]
        )

        // return formatted imported receiver public key as CryptoKey
        return res
      }
      catch (e) {
        alert("Something went wrong...", JSON.stringify(e))
        return null;
      }
    }
  },
  async beforeMount() {
    const app = this
    setTimeout(async () => {
      // check if username route parameter exists
      if (app.username != undefined && app.user.friends) {
        app.receiverSelected = app.user.friends.find(el => el.username == app.username)
        if (app.receiverSelected) {
          app.receiverPublicKeyFormatted = await app.importPublicKey(app.receiverSelected.public_key)
          await app.getMessages()
          // import private key
          app.user.private_key = localStorage.getItem('private_key')
          try {
            await app.importPrivateKey(app.user.private_key)
            app.publicKeyFormatted = await app.importPublicKey(app.user.public_key)
          }
          catch { }
          app.socketEvents()
        } else {
          app.$router.push({ name: 'PageNotFound' })
        }
      } else {
        app.$router.push({ name: 'PageNotFound' })
      }
      app.pageLoading = false
    }, 1000)
  }
}
</script>