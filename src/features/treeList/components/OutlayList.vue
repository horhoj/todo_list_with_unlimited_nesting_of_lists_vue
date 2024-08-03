<script setup lang="ts">
import ListItemIcon from '@/assets/ListItemIcon.vue';
import { type RowTreeFormValues, type RowTreeNodeView } from '../types';
import OutlayListViewItem from './OutlayListViewItem.vue';
import ListConnection from './ListConnection.vue';
import OutlayListEditItem from './OutlayListEditItem.vue';
import TrashItemIcon from '@/assets/TrashItemIcon.vue';
import CancelIcon from '@/assets/CancelIcon.vue';

const props = defineProps<{
  dataList: RowTreeNodeView[];
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'onCreate', parentId: string | null): void;
  (e: 'onCreateSubmit', values: RowTreeFormValues, parentId: string | null): void;
  (e: 'onDelete', id: string): void;
  (e: 'onCancel'): void;
  (e: 'onEdit', id: string): void;
  (e: 'onEditSubmit', values: RowTreeFormValues, id: string): void;
}>();

const makeNewFormValues = (): RowTreeFormValues => ({ name: '', count: 0, sum: 0 });
const makeEditFormValues = ({ body: { count, name, sum } }: RowTreeNodeView): RowTreeFormValues => ({
  count,
  name,
  sum
});
</script>

<template>
  <div class="outlay-list-wrapper">
    <table class="outlay-list">
      <thead>
        <tr>
          <th>
            <span class="level-header-wrapper">
              <button title="Создать корневой элемент" @click="emit('onCreate', null)" :disabled="props.disabled">
                <ListItemIcon />
              </button>
              <span>Уровень</span>
            </span>
          </th>
          <th>Наименование</th>
          <th>Кол-во</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr
          className="tr"
          title="Двойной щелчёк для изменения"
          v-for="dataItem in props.dataList"
          :key="dataItem.body.id"
          @dblclick="emit('onEdit', dataItem.body.id)"
          role="button"
        >
          <td class="level-td">
            <ListConnection :listPosition="dataItem.listPosition">
              <div class="icons-wrapper">
                <button
                  title="Создать дочерний элемент"
                  @click="!dataItem.isNew && !dataItem.isEdit && emit('onCreate', dataItem.body.id)"
                  :disabled="props.disabled"
                >
                  <ListItemIcon />
                </button>
                <button
                  title="Удалить элемент и все его дочерние элементы"
                  @click="emit('onDelete', dataItem.body.id)"
                  v-if="!dataItem.isEdit && !dataItem.isNew"
                  :disabled="props.disabled"
                >
                  <TrashItemIcon />
                </button>
                <button
                  title="Отменить"
                  @click="emit('onCancel')"
                  v-if="dataItem.isNew || dataItem.isEdit"
                  :disabled="props.disabled"
                >
                  <CancelIcon />
                </button>
              </div>
            </ListConnection>
          </td>
          <OutlayListViewItem
            :item-body="dataItem.body"
            v-if="!dataItem.isEdit && !dataItem.isNew"
            :key="dataItem.body.id"
          />
          <OutlayListEditItem
            :disabled="props.disabled"
            :form-values="makeNewFormValues()"
            @on-submit="(values) => emit('onCreateSubmit', values, dataItem.parentId)"
            v-if="!dataItem.isEdit && dataItem.isNew"
            :key="dataItem.body.id"
          />
          <OutlayListEditItem
            :disabled="props.disabled"
            :form-values="makeEditFormValues(dataItem)"
            @on-submit="(values) => emit('onEditSubmit', values, dataItem.body.id)"
            v-if="dataItem.isEdit && !dataItem.isNew"
            :key="dataItem.body.id"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.outlay-list-wrapper {
  padding: 0 10px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.outlay-list {
  width: 100%;

  border-collapse: collapse;

  & > thead > tr {
    min-height: 50px !important;

    & > th {
      height: 50px;
      text-align: left;
      color: #a1a1aa;
      padding: 5px 12px;

      &:nth-child(1) {
        // min-width: 300px;
      }

      &:nth-child(2) {
        width: 100%;
        min-width: 400px;
      }

      &:nth-child(3) {
        min-width: 200px;
      }

      &:nth-child(4) {
        min-width: 200px;
      }

      &:nth-child(5) {
        min-width: 200px;
      }

      &:nth-child(6) {
        min-width: 200px;
      }
    }
  }

  & > tbody > tr {
    border-top: 1px solid #414144;

    & > td {
      min-height: 60px;
      padding: 5px 12px;
    }
  }
}

.level-td {
  display: flex;
}

.icons-wrapper {
  display: flex;
  gap: 2px;
  border-radius: 6px;
  justify-content: space-between;
  background-color: #414144;
  width: fit-content;

  & > button {
    background-color: #414144;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #555;
    }
  }
}

.edit {
}

.level-header-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;

  & > button {
    position: relative;
    z-index: 2;
    background-color: #414144;
    border: none;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;

    &:hover {
      background-color: #555;
    }
  }
}
</style>
