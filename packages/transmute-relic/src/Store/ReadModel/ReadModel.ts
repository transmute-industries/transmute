import { W3 } from "soltsice";
import { IFSA } from "../EventTypes";

import { Store } from "../Store";

import { IReadModel, IReadModelAdapter, IReadModelState } from "./ReadModelTypes";

const STATE_REQUIRED_PROPS = ["contractAddress", "readModelType", "readModelStoreKey"];

import { Adapter } from "../Adapter";

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

  sync = async (
    store: Store.GenericEventStore,
    adapter: Adapter,
    web3: W3,
    fromAddress: string
  ) => {
    let events = await Store.readFSAs(store, adapter, web3, fromAddress, this.state.lastEvent || 0);
    this.applyEvents(events);
    return this.state;
  };
}
