export interface IReadModelState {
  lastEvent: number | null;
  readModelType: string;
  readModelStoreKey: string;
  contractAddress: string;
  model: any;
}

export interface IReadModelAdapter {
  getItem(id: string): Promise<IReadModelState>;
  setItem(id: string, value: any): Promise<IReadModelState>;
}

export interface IReadModel {
  state: IReadModelState
  adapter: IReadModelAdapter
  reducer: any
}
