"use strict";
import * as _ from "lodash";

import { assert, expect, should } from "chai";

import * as Common from "./Common";
describe("Common", () => {
  beforeAll(async () => {});
  let obj = {
    a: {
      b: [1, 2, 5],
      c: {
        d: 4
      }
    }
  };

  describe(".flatten", () => {
    it("should return the flat object, ready to be many EsEventProperties", () => {
      let flatObj: any = Common.flatten(obj);
      // add more tests
    });
  });

  describe(".unflatten", () => {
    it("should return a fat object, ready to be a payload", () => {
      let flatObj = Common.flatten(obj);
      let fatObj: any = Common.unflatten(flatObj);
      // add more tests
    });
  });

  describe(".guessTypeFromValue", () => {
    it("should return U for a number", () => {
      let t = Common.guessTypeFromValue(10);
      assert(t === "U");
    });

    it("should return A for an address", () => {
      let t = Common.guessTypeFromValue(
        "0x1a63f28550ae27e0a192d91d073ea4e97dd089b0"
      );
      assert(t === "A");
    });

    it("should return S for a string", () => {
      let t = Common.guessTypeFromValue("hello");
      assert(t === "S");
    });

    it("should return I for an object", () => {
      let t = Common.guessTypeFromValue({ a: 0 });
      assert(t === "I");
    });
  });

  describe(".convertValueToType", () => {
    it("should convert U number to bytes32", () => {
      let t = Common.convertValueToType("U", 1337);
      assert(
        t ===
          "0x0000000000000000000000000000000000000000000000000000000000000539"
      );
    });

    it("should convert U number to bytes32", () => {
      let t = Common.convertValueToType(
        "A",
        "0x1a63f28550ae27e0a192d91d073ea4e97dd089b0"
      );
      assert(
        t ===
          "0x0000000000000000000000001a63f28550ae27e0a192d91d073ea4e97dd089b0"
      );
    });

    it("should convert I number to bytes32", () => {
      let t = Common.convertValueToType(
        "I",
        "Qmc1JeeB3FheBYaMRFcwT6v5pwmhxeh7pGmVNuQPekA7m9"
      );
      assert(
        t ===
          "0xcb0ee664da7621cc4cb7891609b0a2f745444a593cb28c3207171b38c8a7e710"
      );
    });
  });

  describe(".getValueFromType", () => {
    it("should return U for a number", () => {
      let t = Common.getValueFromType(
        "U",
        "0x0000000000000000000000000000000000000000000000000000000000000539"
      );
      assert(t === 1337);
    });

    it("should return A for an address", () => {
      let t = Common.getValueFromType(
        "A",
        "0x0000000000000000000000001a63f28550ae27e0a192d91d073ea4e97dd089b0"
      );
      assert(t === "0x1a63f28550ae27e0a192d91d073ea4e97dd089b0");
    });

    it("should return I for a string", () => {
      let t = Common.getValueFromType(
        "I",
        "0xcb0ee664da7621cc4cb7891609b0a2f745444a593cb28c3207171b38c8a7e710"
      );
      assert(t === "Qmc1JeeB3FheBYaMRFcwT6v5pwmhxeh7pGmVNuQPekA7m9");
    });
  });
});
