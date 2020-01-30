<template>
    <v-container fluid fill-height>
      <v-row justify="center" style="height:100%">
        <v-col cols="6" align-self="center">
          <v-img src="../assets/BEL_LOGO(BLACK).png"></v-img>
        </v-col>
        <v-col cols="12" align-self="end">
          <v-btn color="secondary" block @click="loginForm=true">계정입력</v-btn>
        </v-col>
      </v-row>
      <v-dialog v-model="loginForm" persistent max-width="400">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-toolbar dark>
            <v-btn icon dark @click="loginForm = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>로그인</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-col>
            <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
            <v-btn :disabled="!valid" color="success" class="mr-4" block @click="login">로그인</v-btn>
          </v-col>
        </v-form>
      </v-card>
    </v-dialog>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",

  data: () => ({
    loginForm: false,
    valid: false,
    name: "",
    nameRules: [
      v => !!v || "이름을 입력해주세요",
      v => (v && v.length >= 2) || "두글자 이상이어야 합니다"
    ]
  }),
  methods: {
    login: function() {
      if (this.name && this.name.length > 1) {
        axios.post("/api/login", { name: this.name }).then(res => {
          if (res.status === 200 && res.data.success) {
            // id 를 추가한다
            this.$store.commit("updateUserID", res.data.id);
          } else {
            alert(res);
          }
        });
      }
    }
  }
};
</script>