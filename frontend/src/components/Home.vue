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
              <v-btn text @click.stop="getCoin(item)">코인받기</v-btn>
              <v-btn text @click.stop="transfer(item)">송금하기</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card @click="coinlist_dialog = true">
          <v-row justify="center">
            <v-col cols="5">
              <v-card-text v-text="'+코인추가'"></v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-container>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card v-if="selected">
        <v-toolbar dark>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{selected.name }} 보내기</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-col>
          <v-row dense>
            <v-col>받을분</v-col>
            <v-col>
              <v-select dense v-model="target" :items="this.friends" required />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>보유수량</v-col>
            <v-col>{{selected.amount}}</v-col>
          </v-row>
          <v-row dense>
            <v-col>송금수수료</v-col>
            <v-col>회원간 송금 면제</v-col>
          </v-row>
          <v-row dense>
            <v-col>송금한도</v-col>
            <v-col>무제한</v-col>
          </v-row>
          <v-col cols="12">
            <v-text-field label="송금수량" outlined v-model="transferAmount"></v-text-field>
          </v-col>
          <v-btn dark block @click="send(selected, target, transferAmount)">보내기</v-btn>
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog v-model="coinlist_dialog" max-width="400">
      <v-card>
        <v-toolbar dark>
          <v-btn icon dark @click="coinlist_dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>코인추가</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-col v-for="(data, symbol) in symbols" :key="symbol">
          <v-card
            v-if="!coins.find((e) => e.symbol === symbol)"
            :color="data.color"
            @click="addCoin(symbol)"
          >
            <v-card-title v-text="symbol" />
            <v-card-subtitle v-text="data.name" />
          </v-card>
        </v-col>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Home",
  computed: {
    ...mapGetters({ userid: "userid" })
  },
  data: () => ({
    dialog: false,
    friends: [],
    friendsToId: {},
    target: null,
    coinlist_dialog: false,
    selected: null,
    transferAmount: null,
    coins: [],
    symbols: {
      BTC: {
        name: "비트코인",
        color: "#1F7087"
      },
      ETH: {
        name: "이더리움",
        color: "#952175"
      }
    }
  }),
  methods: {
    transfer: function(item) {
      axios.get("/api/" + this.userid + "/friends").then(res => {
        this.friends = res.data.friends.map(e => e.name);
        this.friendsToId = {};
        for(const e of res.data.friends) {
          this.friendsToId[e.name] = e.id;
        }

        this.selected = item;
        this.dialog = true;
        this.transferAmount = null;
      });
    },
    getCoin: function(item) {
      axios.post("/api/" + this.userid + "/coin/__devget", { symbol: item.symbol}).then(res => {
        if (res.status === 200) {
          item.amount = res.data.amount;
        }
      });
    },
    send: function(item, target, amount) {
      if (Number(item.amount) < (amount)) {
        alert("입력한 수량이 너무 큽니다");
      } else {
        // 타겟을 찾는다
        const targetID = this.friendsToId[target];
        axios.post("/api/" + this.userid + "/coin/send", { target: targetID, symbol: item.symbol, amount: amount}).then(res => {
          if (res.status === 200) {
            item.amount = res.data.amount;
            alert("송금이 완료되었습니다");
            this.dialog = false;
          }
        })
      }
    },
    addCoin: function(symbol) {
      axios
        .post("/api/" + this.userid + "/coin/add", { symbol: symbol })
        .then(res => {
          if (res.status === 200 && res.data.success) {
            const data = this.symbols[res.data.symbol];
            this.coins.push({
              symbol: symbol,
              amount: res.data.amount,
              name: data.name,
              color: data.color
            });
          }

          this.coinlist_dialog = false;
        });
    }
  },
  created() {
    // 초기 로딩을 한다
    axios.get("/api/" + this.userid + "/coin/all").then(res => {
      for (const data of res.data.coins) {
        const symbol_data = this.symbols[data.symbol];
        if (symbol_data) {
          this.coins.push({
            name: symbol_data.name,
            symbol: data.symbol,
            color: symbol_data.color,
            amount: data.amount
          });
        }
      }
    });
  }
};
</script>