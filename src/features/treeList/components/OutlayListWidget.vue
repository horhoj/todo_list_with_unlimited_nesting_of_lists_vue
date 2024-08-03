<script setup lang="ts">
import Spinner from '@/ui/Spinner.vue';
import OutlayList from './OutlayList.vue';
import { useTreeListStoreStore } from '../treeListStore';
import { onMounted, onUnmounted } from 'vue';

const store = useTreeListStoreStore();
onMounted(() => store.storeInit());
onUnmounted(() => store.storeClear());

const handleDelete = (id: string) => {
  store.handleCancel();
  setTimeout(() => {
    if (confirm('Удалить элемент?')) {
      store.handleDelete(id);
    }
  }, 100);
};
</script>

<template>
  <Spinner :is-show="store.isLoading" />
  <div className="helper">
    *** Для редактирования элемента дважды кликнете по нужной строке. По нажатию Escape можно выйти из режима
    редактирования или создания нового элемента. Для создания элемента или его удаления (вместе с дочерними), нажмите
    иконки в соответствущей строке
  </div>
  <OutlayList
    v-if="store.dataList?.result"
    :data-list="store.dataList.result"
    @on-create="(parentId) => store.handleCreate({ parentId })"
    @on-create-submit="store.handleCreateSubmit"
    :disabled="store.isLoading"
    @on-delete="handleDelete"
    @on-cancel="store.handleCancel"
    @on-edit="store.handleEdit"
    @on-edit-submit="store.handleEditSubmit"
  />
</template>

<style lang="scss">
.helper {
  padding: 20px;
  color: #666;
}
</style>
