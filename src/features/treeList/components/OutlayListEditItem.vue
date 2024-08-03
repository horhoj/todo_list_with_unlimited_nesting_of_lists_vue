<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { RowTreeFormValues } from '../types';

const props = defineProps<{
  formValues: RowTreeFormValues;
  disabled: boolean;
}>();

const emit = defineEmits<{ (e: 'onSubmit', formValues: RowTreeFormValues): void }>();

const nameInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  nameInputRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  nameInputRef.value?.focus({ preventScroll: true });
});

const formValues = ref({ ...props.formValues });

const handleSubmit = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !props.disabled) {
    emit('onSubmit', { ...formValues.value });
  }
};
</script>

<template>
  <td class="td">
    <span class="field">
      <input
        class="input"
        ref="nameInputRef"
        @keydown="handleSubmit"
        v-model="formValues.name"
        :readonly="props.disabled"
      />
    </span>
  </td>
  <td class="td">
    <span className="field">
      <input class="input" @keydown="handleSubmit" v-model="formValues.count" :readonly="props.disabled" />
    </span>
  </td>
  <td class="td">
    <span className="field">
      <input class="input" @keydown="handleSubmit" v-model="formValues.sum" :readonly="props.disabled" />
    </span>
  </td>
</template>

<style scoped lang="scss">
.field {
  display: flex;
  gap: 5px;
  flex-direction: column;
  position: relative;
}

.error {
  position: absolute;
  color: red;
  display: block;
  font-size: 12px;
  background-color: #000;
  font-weight: 700;
  right: 10px;
  padding: 3px;
  border-radius: 4px;
  top: -14px;
}

.td {
  padding: 5px 12px;
}

.input {
  background-color: #272b33;
  border: 1px solid #666;
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
  width: 100%;
}
</style>
