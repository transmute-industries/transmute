import { ITransmuteFramework } from "../../../transmute-framework";

import * as Common from "../../Utils/Common";
import { ReadModel } from "../ReadModel";

const jsonLogic = require("json-logic-js");

export class PatchLogic extends ReadModel {
  constructor(public framework: ITransmuteFramework) {
    super(framework);
  }

  applyJsonLogic = (rule, data) => {
    return jsonLogic.apply(rule, data);
  };

  applyJsonLogicProjection = (jsonLogicRule, objectStates) => {
    return objectStates.map(objState => {
      return this.applyJsonLogic(jsonLogicRule, objState);
    });
  };
}
