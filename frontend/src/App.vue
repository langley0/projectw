<template>
  <v-app>
    <v-col align-self="center"> 
      <v-card
        max-width="400"
        height="800"
        class="mx-auto"
      >
        <home v-if="userid"/>
        <login v-else/>
      </v-card>
    </v-col>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import Login from './components/Login'
import Home from './components/Home'

export default {
  name: 'App',
  components: {
    login: Login,
    home: Home,
  },
  computed: {
    ...mapGetters({ userid: 'userid' })
  },
  data: () => ({
  }),
  created() {
    // 로그인 상태 검사를 한다
    this.$store.dispatch('fetchUserID');
  }
};
</script>
