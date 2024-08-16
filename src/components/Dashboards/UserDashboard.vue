<script setup>
//import PlayerMetricChartList from "../PlayerMetricChartList.vue";
import Schedule from "../components/Schedule.vue";
</script>

<template>
  <v-container>
    <h1>Player Statistics</h1>
    <v-row>
      <v-col cols="4"> </v-col>
      <v-row class="w-25 float-right" no-gutters>
        <!-- <PlayerMetricChartList :alias-id="1" :title-id="1" /> -->
        <Schedule />
      </v-row>
    </v-row>
  </v-container>
</template>
