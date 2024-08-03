import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useRequest } from '@/hooks/useRequest';
import { API } from '@/api/api';
import { getRowTreeElementPositionInParentList, getRowTreeParentElement, makeRowTreeNodeViewList } from './helpers';
import type { DataBodyItem, DataItem } from '@/fakeApi/types';
import type { CreateParentId, RowTreeFormValues } from './types';

export const useTreeListStoreStore = defineStore('treeListStore', () => {
  const createParentId = ref<CreateParentId | null>(null);
  const editId = ref<string | null>(null);
  const dataItemList = ref<DataItem[]>([]);

  const fetchDataRequest = useRequest({
    requestCb: async () => {
      dataItemList.value = await API.getDataList();
    }
  });

  const addItemRequest = useRequest({
    requestCb: async (parentId: string | null, body: DataBodyItem) => {
      const res = await API.addItem(parentId, body);

      if (res === null) {
        throw new Error('Ошибка АПИ: не удалось создать элемент!');
      }

      const parentElement = getRowTreeParentElement(dataItemList.value, parentId);
      if (parentElement === null) {
        throw new Error('Не найден список элементов родителя');
      }
      parentElement.push({ id: res.id, ...body, children: [] });

      createParentId.value = null;
    }
  });

  const patchItemRequest = useRequest({
    requestCb: async (values: RowTreeFormValues, id: string) => {
      const res = await API.patchItem(id, values);

      if (res === null) {
        throw new Error('Ошибка АПИ: не удалось отредактировать элемент!');
      }
      const position = getRowTreeElementPositionInParentList(dataItemList.value, id);
      if (position === null) {
        throw new Error('Не найден позиция в списке элементов родителя');
      }
      position.parentChildList[position.index] = { ...position.parentChildList[position.index], ...values };
      editId.value = null;
    }
  });

  const deleteItemRequest = useRequest({
    requestCb: async (id: string) => {
      const res = await API.deleteItem(id);

      if (res === null) {
        throw new Error('Ошибка АПИ: не удалось создать элемент!');
      }

      const position = getRowTreeElementPositionInParentList(dataItemList.value, id);
      if (position === null) {
        throw new Error('Не найден позиция в списке элементов родителя');
      }
      position.parentChildList.splice(position.index, 1);
    }
  });

  const isLoading = computed(
    () =>
      fetchDataRequest.isLoading.value ||
      addItemRequest.isLoading.value ||
      deleteItemRequest.isLoading.value ||
      patchItemRequest.isLoading.value
  );

  const dataList = computed(() => {
    return dataItemList.value === null
      ? null
      : makeRowTreeNodeViewList(dataItemList.value, createParentId.value, editId.value);
  });

  const storeInit = () => fetchDataRequest.run();

  const storeClear = () => (dataItemList.value = []);

  const handleCancel = () => {
    createParentId.value = null;
    editId.value = null;
  };

  const handleCreate = (parentId: CreateParentId | null) => {
    editId.value = null;
    createParentId.value = parentId;
  };

  const handleCreateSubmit = (values: RowTreeFormValues, parentId: string | null) => {
    addItemRequest.run(parentId, values);
  };

  const handleDelete = (id: string) => {
    deleteItemRequest.run(id);
  };

  const handleEdit = (id: string) => {
    createParentId.value = null;
    editId.value = id;
  };

  const handleEditSubmit = (values: RowTreeFormValues, id: string) => {
    patchItemRequest.run(values, id);
  };

  return {
    dataList,
    isLoading,
    storeInit,
    storeClear,
    handleCreate,
    handleCreateSubmit,
    handleDelete,
    handleCancel,
    handleEdit,
    handleEditSubmit
  };
});
