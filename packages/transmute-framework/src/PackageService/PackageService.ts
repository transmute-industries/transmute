import { EventStoreAdapter, PackageManager, W3 } from "../transmute-framework";

export default class PackageService {
  constructor(
    public packageManager: PackageManager,
    public eventStoreAdapter: EventStoreAdapter
  ) {
    console.log("created...");
  }

  public static New = async (fromAddress: string) => {
    let newPM = await PackageManager.New(W3.TC.txParamsDefaultDeploy(fromAddress), {
      _multisig: fromAddress
    });
    return newPM;
  };
}
