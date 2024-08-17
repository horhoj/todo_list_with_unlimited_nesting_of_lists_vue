<script setup lang="ts">
import { computed } from 'vue';
import { ListPosition } from '../types';
import { getUUID } from '@/utils/getUUID';

const props = defineProps<{
  listPosition: ListPosition[];
}>();

const data = computed(() => props.listPosition.map((position) => ({ position, id: getUUID() })));
</script>

<template>
  <div className="list-connection">
    <template v-for="dataItem in data" :key="dataItem.id">
      <div className="connect">
        <template v-if="dataItem.position === ListPosition.BOUND">
          <div className="center-vertical-line" />
        </template>
        <template v-if="dataItem.position === ListPosition.START">
          <div className="center-vertical-line" />
          <div className="center-horizontal-half-line" />
        </template>
        <template v-if="dataItem.position === ListPosition.CENTER">
          <div className="center-vertical-line" />
          <div className="center-horizontal-half-line" />
        </template>
        <template v-if="dataItem.position === ListPosition.END">
          <div className="center-horizontal-half-line" />
          <div className="center-vertical-half-line" />
        </template>
      </div>
    </template>
    <div className="icon-wrapper" @dblclick="(e) => e.stopPropagation()">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-connection {
  min-height: 30px;
  display: flex;
  padding-right: 30px;
}

.connect {
  width: 30px;
  height: 100%;
  position: relative;
}

.center-vertical-line {
  position: absolute;

  left: 50%;
  top: -50%;
  width: 2px;
  height: 200%;
  background-color: #666;
}

.center-vertical-half-line {
  position: absolute;
  left: 50%;
  top: -50%;
  width: 2px;
  height: 100%;
  background-color: #666;
}

.center-horizontal-half-line {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 2px;
  background-color: #666;
}

.icon {
  width: 20px;
  height: 20px;
  background-color: #c6c6c6;
}

.icon-wrapper {
  position: relative;
  z-index: 2;
  padding-left: 30px;
  width: 30px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
