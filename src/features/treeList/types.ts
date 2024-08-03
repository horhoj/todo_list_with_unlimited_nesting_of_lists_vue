import type { DataItem } from '@/fakeApi/types';

export enum ListPosition {
  START = '+',
  END = '-',
  CENTER = '>',
  EMPTY = '#',
  BOUND = '|'
}

export type RowTreeNodeBody = Omit<DataItem, 'children'>;

export interface RowTreeNodeView {
  body: RowTreeNodeBody;
  listPosition: ListPosition[];
  isNew: boolean;
  parentId: string | null;
  isEdit: boolean;
}

export interface CreateParentId {
  parentId: string | null;
}

export type RowTreeFormValues = Omit<RowTreeNodeBody, 'id'>;
