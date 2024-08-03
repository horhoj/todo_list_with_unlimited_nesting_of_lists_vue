import type { CreateParentId, RowTreeNodeView } from './types';
import { ListPosition } from './types';
import { getUUID } from '@/utils/getUUID';
import type { DataItem } from '@/fakeApi/types';

export const makeRowTreeNodeViewList = (
  originalTree: DataItem[],
  createItemId: CreateParentId | null,
  editItemId: string | null
) => {
  let newDataItemId: string | null;
  const makeNew = (id: string): DataItem => ({
    id,
    name: '',
    count: 0,
    sum: 0,
    children: []
  });

  const result: RowTreeNodeView[] = [];
  let deep = 0;

  const tree = originalTree.slice();
  if (createItemId?.parentId === null) {
    newDataItemId = getUUID();
    tree.push(makeNew(newDataItemId));
  }

  const runner = (tree: DataItem[], prevListPosition: ListPosition[], parentId: string | null) => {
    tree.forEach(({ children, ...body }, index, arr) => {
      let listPosition: ListPosition = ListPosition.START;
      if (index < arr.length - 1 && index > 0) {
        listPosition = ListPosition.CENTER;
      }
      if (index === arr.length - 1) {
        listPosition = ListPosition.END;
      }
      if (arr.length > deep) {
        deep = arr.length;
      }
      const lastPrevPosition = prevListPosition[prevListPosition.length - 1];
      const prevListPositionClone = prevListPosition.slice();
      if (lastPrevPosition === ListPosition.END) {
        prevListPositionClone[prevListPosition.length - 1] = ListPosition.EMPTY;
      }
      if (lastPrevPosition === ListPosition.CENTER || lastPrevPosition === ListPosition.START) {
        prevListPositionClone[prevListPosition.length - 1] = ListPosition.BOUND;
      }

      const currentListPosition = [...prevListPositionClone, listPosition];
      result.push({
        body,
        listPosition: currentListPosition,
        isNew: newDataItemId === body.id,
        parentId,
        isEdit: editItemId === body.id
      });
      const actualChild = children.slice();
      if (createItemId?.parentId === body.id) {
        newDataItemId = getUUID();
        actualChild.push(makeNew(newDataItemId));
      }

      runner(actualChild, currentListPosition, body.id);
    });
  };

  runner(tree, [], null);

  return { result, deep };
};

export const getRowTreeParentElement = (list: DataItem[], parentId: string | null): DataItem[] | null => {
  if (parentId === null) {
    return list;
  }
  const stack = [...list];
  while (stack.length > 0) {
    const current = stack.shift();
    if (current !== undefined) {
      if (current.id === parentId) {
        return current.children;
      }
      stack.unshift(...current.children);
    }
  }

  return null;
};

export const getRowTreeElementPositionInParentList = (
  list: DataItem[],
  elementId: string
): { parentChildList: DataItem[]; index: number } | null => {
  interface StackItem {
    el: DataItem;
    parent: DataItem[];
    elIdx: number;
  }

  const stack: StackItem[] = list.map((el, i, arr) => ({
    el,
    parent: arr,
    elIdx: i
  }));

  while (stack.length > 0) {
    const current = stack.shift();
    if (current !== undefined) {
      if (current.el.id === elementId) {
        return { index: current.elIdx, parentChildList: current.parent };
      }
      stack.unshift(
        ...current.el.children.map((el, i, arr) => ({
          el,
          parent: arr,
          elIdx: i
        }))
      );
    }
  }
  return null;
};
