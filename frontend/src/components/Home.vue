<template>
  <section>
    <v-app-bar dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>BEL Wallet Demo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
    <v-container>
      <v-col v-for="(item, i) in coins" :key="i" cols="12">
        <v-card :color="item.color" dark>
          <v-card-title class="headline" v-text="item.name"></v-card-title>
          <v-card-subtitle v-text="item.amount + ' ' + item.symbol"></v-card-subtitle>
          <v-card-actions>
            <v-row justify="end">
              <v-btn text @click.stop="transfer(item)">송금하기</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-container>
    <v-dialog v-model="dialog" persistent max-width="400" >
      <v-card v-if="selected">
        <v-toolbar dark>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{selected.name }} 보내기</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-col>
            <div>노기태</div>
            <div>보유수량 0</div>
            <div>출금가능 0</div>
            <div>송금수수료 회원간 송금 면제</div>
            <div>송금한도 최대 10만원</div>
            <v-col cols="12">
                <v-text-field 
                    label="송금수량"
                    outlined
                    v-model="transferAmount"
                    >
                </v-text-field>
            </v-col>
            <v-btn dark block @click="send()">보내기</v-btn>
        </v-col>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
export default {
  name: "Home",
  data: () => ({
    dialog: false,
    selected: null,
    transferAmount: null,
    coins: [
      {
        name: "비트코인",
        symbol: "BTC",
        color: "#1F7087",
        amount: "1.0000"
      },
      {
        name: "이더리움",
        symbol: "ETH",
        color: "#952175",
        amount: "2.0000"
      }
    ]
  }),
  methods: {
    transfer: function(item) {
      this.selected = item;
      this.dialog = true;
      this.transferAmount = null;
    },
    send: function() {
        alert("미구현")
    }
  }
};
</script>