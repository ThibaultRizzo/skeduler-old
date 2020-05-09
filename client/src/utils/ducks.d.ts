import { PayloadAction } from 'typesafe-actions';

export interface Identified {
  id: number;
}
export type ResolveFunction<V> = (value: V) => void;

export type RejectFunction = (reason?: any) => void;

export interface AsyncRequest<V> {
  readonly resolve?: ResolveFunction<V>;
  readonly reject?: RejectFunction;
}

export type AsyncActionCreator<R, S, T> = (
  request: R,
  resolve: ResolveFunction<S>,
  reject: RejectFunction,
) => PayloadAction<string, T>;


export interface ItemSaveRequest<T> {
  readonly item: T;
  readonly creationMode: boolean;
}

export interface AsyncItemLoadRequest<T> extends AsyncRequest<T> {
  readonly id: number;
}
export interface AsyncItemSaveRequest<T> extends ItemSaveRequest<T>, AsyncRequest<T> { }

export interface AsyncItemDeleteRequest extends AsyncRequest<number | null> {
  readonly id: number;
}
