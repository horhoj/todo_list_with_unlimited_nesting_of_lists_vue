<script setup lang="ts">
import type { RowTreeNodeBody } from '../types';

const props = defineProps<{
  itemBody: RowTreeNodeBody;
}>();
</script>

<template>
  <td class="td">
    <span class="span">{{ props.itemBody.name }}</span>
  </td>
  <td class="td">{{ props.itemBody.count.toLocaleString() }}</td>
  <td class="td">{{ props.itemBody.sum.toLocaleString() }}</td>
</template>

<style lang="scss">
.td {
  padding: 5px 12px;
}
.span {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
  display: block;
  white-space: nowrap;
}
</style>
