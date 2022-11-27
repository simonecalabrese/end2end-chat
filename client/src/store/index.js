import { createStore } from 'vuex'
import axios from 'axios'
import { getCurrentUser } from './utils.js'
axios.defaults.baseURL = import.meta.env.VITE_API_URL

const store = createStore({
  state: {
    axios: axios,
    user: getCurrentUser()
  },
  getters: {
    axios(state) {
      return state.axios
    },
    user(state) {
      return state.user
    }
  },
  mutations: {
    setUser(state, newValue) {
      state.user = newValue;
    },
  },
  actions: {
  },
  modules: {
  }
})

export default store