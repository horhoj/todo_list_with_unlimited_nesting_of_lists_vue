<script setup lang="ts">
import type { RowTreeNodeBody } from '../types';

const props = defineProps<{
  itemBody: RowTreeNodeBody;
}>();
</script>

<template>
  <td class="td">{{ props.itemBody.name }}</td>
  <td class="td">{{ props.itemBody.count.toLocaleString() }}</td>
  <td class="td">{{ props.itemBody.sum.toLocaleString() }}</td>
</template>

<style lang="scss">
.td {
  padding: 5px 12px;
}
</style>
