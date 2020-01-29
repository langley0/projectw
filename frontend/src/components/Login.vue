<template>
  <v-container fluid fill-height>
    <v-row justify="center" style="height:100%">
      <v-col cols="6" align-self="center">
        <v-img src="../assets/BEL_LOGO(BLACK).png"></v-img>
      </v-col>
      <v-col cols="12" align-self="end">
        <v-btn color="secondary" block @click="login">계정입력</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",

  data: () => ({}),
  methods: {
    login: function() {
      this.$router.replace("/home");
    }
  }
};
</script>