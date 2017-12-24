
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from 'soltsice';

/**
 * EventStoreLib API
 */
export class EventStoreLib extends SoltsiceContract {
    static get Artifacts() { return require('../../node_modules/transmute-contracts/build/contracts/EventStoreLib.json'); }

    static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = EventStoreLib.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    static async New(deploymentParams: W3.TC.TxParams, ctorParams?: {}, w3?: W3, link?: SoltsiceContract[]): Promise<EventStoreLib> {
        let contract = new EventStoreLib(deploymentParams, ctorParams, w3, link);
        await contract._instancePromise;
        return contract;
    }

    static async At(address: string | object, w3?: W3): Promise<EventStoreLib> {
        let contract = new EventStoreLib(address, undefined, w3, undefined);
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
            EventStoreLib.Artifacts,
            ctorParams ? [] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:member-ordering
    public writeEvent = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (self: any, _eventType: string, _keyType: string, _valueType: string, _key: string, _value: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.writeEvent(self, _eventType, _keyType, _valueType, _key, _value, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (self: any, _eventType: string, _keyType: string, _valueType: string, _key: string, _value: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.writeEvent.sendTransaction(self, _eventType, _keyType, _valueType, _key, _value, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (self: any, _eventType: string, _keyType: string, _valueType: string, _key: string, _value: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.writeEvent.request(self, _eventType, _keyType, _valueType, _key, _value).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (self: any, _eventType: string, _keyType: string, _valueType: string, _key: string, _value: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.writeEvent.estimateGas(self, _eventType, _keyType, _valueType, _key, _value).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public readEvent(self: any, _eventId: BigNumber | number, txParams?: W3.TC.TxParams): Promise<any> {
        return new Promise((resolve, reject) => {
            this._instance.readEvent
                .call(self, _eventId, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
}
