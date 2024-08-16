<script setup>
import moment from "moment";
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  show: Boolean,
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["show-event"]);

const eventData = ref(null);
const loaded = ref(false);

const height = computed(() => {
  const length =
    eventData.value.endTime.diff(eventData.value.startTime, "minutes") / 60;
  return `height: ${Math.floor(length * 52)}px;`;
});

const topOffset = computed(() => {
  return `margin-top: ${
    (eventData.value.startTime.minutes() / 15) * (52 / 4)
  }px;`;
});

const emitShow = () => {
  emit("show-event", eventData.value.id);
};

onMounted(() => {
  eventData.value = props.data;
  eventData.value.startTime = moment(eventData.value.startTime);
  eventData.value.endTime = moment(eventData.value.endTime);
  loaded.value = true;
});
</script>

<template>
  <v-card
    v-if="loaded"
    class="w-100 pa-1"
    :style="height + topOffset"
    :color="eventData.team.teamColor"
    @click="emitShow"
  >
    <v-card-text class="pa-0 ma-0 text-subtitle-1">
      {{ eventData.team.name }}
    </v-card-text>
    <v-card-text class="pa-0 ma-0 text-subtitle-2">
      {{ eventData.reservationType }}
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
