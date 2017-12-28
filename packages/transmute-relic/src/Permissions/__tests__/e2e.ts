// import { Store } from "../../Store";
import { getSetupAsync } from "../../__mocks__/setup";

import { Permissions } from "../Permissions";

/**
 * Permissions
 */
describe("Permissions ", () => {



  it("permissions are cool", async () => {
    let {
      relic,
      storeInstances,
      accounts,
      adapter,
      nodeStorageReadModelAdapter
    } = await getSetupAsync();

    // console.log(storeInstances.unsafe.eventCount )
    // console.log(storeInstances.rbac.eventCount )

    let receipt = await Permissions.setAddressRole(
      storeInstances.rbac,
      accounts[0],
      accounts[1],
      'demon'
    );
    console.log('yolo: ', receipt);
    expect(true);
  });


  // it("permissions are cool", async () => {
  //   let {
  //     relic,
  //     storeInstances,
  //     accounts,
  //     adapter,
  //     nodeStorageReadModelAdapter
  //   } = await getSetupAsync();

  //   // console.log(storeInstances.unsafe.eventCount )
  //   // console.log(storeInstances.rbac.eventCount )

  //   let rm = await Permissions.getReadModel(
  //     storeInstances.rbac,
  //     adapter,
  //     nodeStorageReadModelAdapter,
  //     relic.web3,
  //     accounts[0]
  //   );
  //   console.log(rm.state);
  //   expect(true);
  // });
});
