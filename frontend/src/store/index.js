import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userid: null,
  },
  getters: {
    userid: state => state.userid,
  },
  mutations: {
    updateUserID(state, userid) {
      Vue.set(state, 'userid', userid);
    },
  },
  actions: {
    fetchUserID({ commit }) {
      const userid = localStorage.getItem('userid')
      if (userid) {
        commit('updateUserID', userid);
      }
    },
  },
  modules: {
  }
})
