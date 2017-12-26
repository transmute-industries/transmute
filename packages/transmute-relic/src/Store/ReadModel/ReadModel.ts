import { IFSA } from "../EventTypes";

import { Store } from '../Store'

import { IReadModel, IReadModelAdapter, IReadModelState } from "./ReadModelTypes";

const STATE_REQUIRED_PROPS = ["contractAddress", "readModelType", "readModelStoreKey"];

export class ReadModel implements IReadModel {

  constructor(
    public adapter: IReadModelAdapter,
    public reducer: any,
    public state: IReadModelState
  ) {
    if (adapter.getItem === undefined) {
      throw new Error("adapter.getItem is not defined. adapter must implement IReadModelAdapter");
    }

    if (reducer === undefined) {
      throw new Error("reducer is not defined. pass a reducer to the constructor.");
    }

    if (state === undefined) {
      throw new Error("state is not defined. pass a default state to the constructor.");
    }

    this.requireStateToHaveDefaultProperties(state);

  }

  requireStateToHaveDefaultProperties = (state: IReadModelState | any) => {
    STATE_REQUIRED_PROPS.forEach(prop => {
      if (
        state[prop] === undefined ||
        state[prop] === "" ||
        state[prop] === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error(
          `state.${prop} is not defined. make sure its defined before creating a read model.`
        );
      }
    });

    if (state.readModelStoreKey !== `${state.readModelType}:${state.contractAddress}`) {
      throw new Error(
        `state.readModelStoreKey is not formatted correctly. it should be ${state.readModelType}:${
          state.contractAddress
        }`
      );
    }
  };

  applyEvents = (events: IFSA[]) => {
    events.forEach((event: IFSA) => {
      this.state = this.reducer(this.state, event);
    });
  };

  sync = () =>{
    this.state = undefined as any;
  }
}
