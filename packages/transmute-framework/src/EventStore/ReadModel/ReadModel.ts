import { ITransmuteFramework } from '../../transmute-framework'

import * as Common from '../Utils/Common'

import * as _ from 'lodash'

export class ReadModel {
  constructor(public framework: ITransmuteFramework) {}

  /**
   * @type {Function} readModelGenerator - transform an event stream into a json object
   * @param {Object} readModel - a json object representing the state of a given model
   * @param {Function} reducer - a function which reduces events into a read model state object
   * @param {Object[]} events - events from an eventStore contract
   */
  readModelGenerator = (
    readModel: Common.IReadModel,
    reducer: any,
    events: Array<Common.IFSAEvent>
  ): Common.IReadModel => {
    if (!readModel) {
      throw Error('readModelGenerator was passed a broken readModel!' + JSON.stringify(readModel))
    }
    if (!reducer) {
      throw Error('readModelGenerator was passed a broken reducer!' + JSON.stringify(reducer))
    }
    if (!events) {
      throw Error('readModelGenerator was passed a broken events!' + JSON.stringify(events))
    }
    events.forEach(event => {
      readModel = reducer(readModel, event)
    })
    if (readModel === undefined) {
      throw Error('the reducer function returned undefined instead of a valid state object.')
    }
    return readModel
  }

  maybeSyncReadModel = async (
    eventStore: any,
    fromAddress: string,
    readModel: Common.IReadModel,
    reducer: any
    eventResolverConfig?: Common.IEventResolverConfig
  ): Promise<Common.IReadModel> => {
    if (!readModel) {
      throw Error('Cannot sync because readModel is broken: ' + JSON.stringify(readModel))
    }
    let eventCount = (await eventStore.eventCount.call({
      from: fromAddress,
    })).toNumber()

    return this.framework.Persistence.store
      .getItem(readModel.readModelStoreKey)
      .then(async (_readModel: Common.IReadModel) => {
        if (!_readModel) {
          // console.log('This read model has not been stored yet, lets initialize its index values')
          _readModel = readModel
          _readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
        }
        if (_readModel.lastEvent === eventCount) {
          _readModel = this.framework.Persistence.store.setItem(_readModel.readModelStoreKey, _readModel)
        } else {
          let startIndex = _readModel.lastEvent !== null ? _readModel.lastEvent + 1 : 0
          let events = await this.framework.EventStore.readFSAs(eventStore, fromAddress, startIndex)

          if (eventResolverConfig) {
            if (eventResolverConfig.filters) {
              eventResolverConfig.filters.forEach(_filter => {
                events = _.filter(events, _filter)
              })
            }
            if (eventResolverConfig.mappers) {
              eventResolverConfig.mappers.forEach(_mapper => {
                events = events.map(_mapper)
              })
              events = await Promise.all(events)
            }
          }

          _readModel = this.readModelGenerator(_readModel, reducer, events)
          if (!_readModel) {
            throw Error('failed to get a read model from the generator!')
          }
        }
        return this.framework.Persistence.store.setItem(_readModel.readModelStoreKey, _readModel) as Common.IReadModel
      })
  }

  getCachedReadModel = async (eventStore: any, fromAddress: string, readModel: Common.IReadModel, reducer: any) => {
    readModel.contractAddress = eventStore.address
    readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
    readModel = await this.maybeSyncReadModel(eventStore, fromAddress, readModel, reducer)
    return readModel as Common.IReadModel
  }
}
