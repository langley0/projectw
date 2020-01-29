<template>
  <v-app>
    <v-col align-self="center"> 
      <v-card
        max-width="400"
        height="800"
        class="mx-auto"
      >
        <router-view/>
      </v-card>
    </v-col>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
