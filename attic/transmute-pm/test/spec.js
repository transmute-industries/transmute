
var PackageManagerFactory = artifacts.require("./PackageManagerFactory.sol");
var PackageManager = artifacts.require("./PackageManager.sol");

const chai = require("chai");
const expect = chai.expect;
const TransmuteFramework = require("transmute-framework").default;

const avatar = require("../lib");

const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

contract("works with framework", accounts => {
  let T;
  let factory;
  let packageManger;

  before(async () => {
    T = TransmuteFramework.init({
      providerUrl: "http://localhost:8545",
      ipfsConfig: {
        host: "localhost",
        port: "5001",
        options: {
          protocol: "http"
        }
      },
      TRANSMUTE_API_ROOT: "http://localhost:3001"
    });

    factory = await PackageManagerFactory.deployed();
  });

  after(async () => {
    // sometimes truffle test hangs... likely due to rpc activity...
    process.exit(0);
  });

  it("factory can create an package manager", async () => {
    let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
    packageManger = await PackageManager.at(events[0].payload.address);
  });

  it("package manager can publish a directory as a package", async () => {
    let fsaEvent = await avatar.publish(T, packageManger, accounts[0], process.cwd());
    expect(fsaEvent.type).to.equal("PACKAGE_PUBLISHED");
    return fsaEvent;
  });

  it("library can list all published packages", async () => {
    let readModel = await avatar.list(T, packageManger, accounts[0]);
  });

  it("library can install packages from package manager", async () => {
    await avatar.install(T, packageManger, accounts[0], './test/data');
  });
});
