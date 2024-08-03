<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { RowTreeFormValues } from '../types';
import * as yup from 'yup';

const props = defineProps<{
  formValues: RowTreeFormValues;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'onSubmit', formValues: RowTreeFormValues): void;
  (e: 'onCancel'): void;
}>();

const VALIDATION_IS_EMPTY_MSG = 'не заполнено';
const VALIDATION_IS_NOT_STRING = 'не строка';
const VALIDATION_IS_NOT_NUMBER = 'не число';
const VALIDATION_IS_NOT_INTEGER = 'не целое число';
const VALIDATION_VERY_BIG_NUMBER = 'слишком большое число';
const VALIDATION_MAX_NUMBER = 999999999999999;

const integerValidator = (n: number | undefined): boolean =>
  typeof n === 'number' && new RegExp('^[0-9]+$').test(n.toString());

const validationSchema: yup.ObjectSchema<RowTreeFormValues> = yup.object({
  name: yup.string().typeError(VALIDATION_IS_NOT_STRING).required(VALIDATION_IS_EMPTY_MSG),
  count: yup
    .number()
    .typeError(VALIDATION_IS_NOT_NUMBER)
    .max(VALIDATION_MAX_NUMBER, VALIDATION_VERY_BIG_NUMBER)
    .test('isInteger', VALIDATION_IS_NOT_INTEGER, integerValidator)
    .required(VALIDATION_IS_EMPTY_MSG),
  sum: yup
    .number()
    .typeError(VALIDATION_IS_NOT_NUMBER)
    .max(VALIDATION_MAX_NUMBER, VALIDATION_VERY_BIG_NUMBER)
    .required(VALIDATION_IS_EMPTY_MSG)
});

const nameInputRef = ref<HTMLInputElement | null>(null);

const handleCancelKeyPressed = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && !props.disabled) {
    emit('onCancel');
  }
};

onMounted(() => {
  nameInputRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  nameInputRef.value?.focus({ preventScroll: true });
  window.addEventListener('keyup', handleCancelKeyPressed);
});

onUnmounted(() => {
  window.removeEventListener('keyup', handleCancelKeyPressed);
});

const formValues = ref<RowTreeFormValues>({ ...props.formValues });
const formFieldsTouched = ref<Record<keyof RowTreeFormValues, boolean>>({ count: false, name: false, sum: false });

const errorList = computed(() => {
  try {
    validationSchema.validateSync(formValues.value, { abortEarly: false });
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      const errorList: Record<string, string> = {};
      e.inner.forEach((error) => {
        if (error.path) {
          errorList[error.path] = error.errors.join(', ');
        }
      });

      return errorList;
    }
  }
  return null;
});

const handleTouch = (field: keyof RowTreeFormValues) => {
  formFieldsTouched.value[field] = true;
};

const handleSubmit = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !props.disabled) {
    formFieldsTouched.value['name'] = true;
    formFieldsTouched.value['count'] = true;
    formFieldsTouched.value['sum'] = true;

    if (errorList.value === null) {
      emit('onSubmit', { ...formValues.value });
    }
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
        @blur="() => handleTouch('name')"
      />
      <span className="error" v-if="errorList !== null && errorList['name'] && formFieldsTouched['name']">{{
        errorList['name']
      }}</span>
    </span>
  </td>
  <td class="td">
    <span className="field">
      <input
        class="input"
        @keydown="handleSubmit"
        v-model="formValues.count"
        :readonly="props.disabled"
        @blur="() => handleTouch('count')"
      />
      <span className="error" v-if="errorList !== null && errorList['count'] && formFieldsTouched['count']">{{
        errorList['count']
      }}</span>
    </span>
  </td>
  <td class="td">
    <span className="field">
      <input
        class="input"
        @keydown="handleSubmit"
        v-model="formValues.sum"
        :readonly="props.disabled"
        @blur="() => handleTouch('sum')"
      />
      <span className="error" v-if="errorList !== null && errorList['sum'] && formFieldsTouched['sum']">{{
        errorList['sum']
      }}</span>
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
