const jsonLogic = require("json-logic-js");

export namespace Logic {
  export const applyJsonLogic = (rule: any, state: any) => {
    return jsonLogic.apply(rule, state);
  };

  export const applyJsonLogicProjection = (jsonLogicRule: any, states: any[]) => {
    return states.map((objState: any) => {
      return applyJsonLogic(jsonLogicRule, objState);
    });
  };
}
