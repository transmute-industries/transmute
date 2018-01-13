
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from 'soltsice';

/**
 * StringUtils API
 */
export class StringUtils extends SoltsiceContract {
    static get Artifacts() { return require('../contracts/StringUtils.json'); }

    static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = StringUtils.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    static async New(deploymentParams: W3.TC.TxParams, ctorParams?: {}, w3?: W3, link?: SoltsiceContract[]): Promise<StringUtils> {
        let contract = new StringUtils(deploymentParams, ctorParams, w3, link);
        await contract._instancePromise;
        return contract;
    }

    static async At(address: string | object, w3?: W3): Promise<StringUtils> {
        let contract = new StringUtils(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    protected constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            StringUtils.Artifacts,
            ctorParams ? [] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public bytesToUInt(v: string, txParams?: W3.TC.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.bytesToUInt
                .call(v, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public uintToBytes(v: BigNumber | number, txParams?: W3.TC.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.uintToBytes
                .call(v, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
}
