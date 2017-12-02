import React, { Component } from "react";

import T from "../transmute";

import { getReadModel } from "./Helpers";

import { readModel } from "./Reducer";

let CONTRACT_ADDRESS = require("../PackageManager.ReadModel.json")
  .contractAddress;

const filterModelToLatest = readModel => {
  let onlyLatest = {};
  Object.keys(readModel.model).forEach(packageKey => {
    let meta = readModel.model[packageKey];
    if (
      !onlyLatest[meta.name] ||
      onlyLatest[meta.name].version < meta.version
    ) {
      onlyLatest[meta.name] = meta;
      onlyLatest[meta.name].index = packageKey;
    }
  });

  return onlyLatest;
};

class PackageManager extends Component {
  state = {
    contractAddress: CONTRACT_ADDRESS,
    readModel: {},
    packagesReadModel: JSON.stringify({}, null, 2)
  };

  onContractAddressChange = event => {
    this.setState({
      contractAddress: event.target.value
    });
  };

  loadPackageData = async () => {
    let eventStore = await T.EventStoreContract.at(this.state.contractAddress);
    let packagesReadModel = await getReadModel(
      T,
      eventStore,
      this.props.currentAddress
    );

    let latest = filterModelToLatest(packagesReadModel);

    console.log(latest);

    this.setState({
      latest: "http://localhost:8080/ipfs/" + latest["transmute-pm"].index,
      packagesReadModel: JSON.stringify(packagesReadModel, null, 2)
    });
  };

  render() {
    return (
      <div className="PackageManager">
        <h2>
          Packages,
          <button onClick={this.loadPackageData}>Load Package Data</button>
        </h2>
        <input
          name="contractAddress"
          value={this.state.contractAddress}
          onChange={this.onContractAddressChange}
        />
        <pre>{this.state.packagesReadModel}</pre>
        <a href={this.state.latest} target="_blank">latest</a>
      </div>
    );
  }
}

export default PackageManager;
