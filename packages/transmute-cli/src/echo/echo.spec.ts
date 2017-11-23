

import TransmuteCLI from '../index'

describe("Transmute Echo", () => {
  it("It should be a defined function", () => {
    expect(TransmuteCLI.echo).toBeDefined();
  });

  it("It should console.log", () => {
    TransmuteCLI.echo('hello', ()=>{
      // stub 
    })
  });
});
