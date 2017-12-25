import { Interceptor } from '../Interceptor'
import { Adapter } from '../../Adapter'

/**
 * Interceptor test
 */
describe('Interceptor test', () => {
  it('apply can transform events ', async () => {
    let events = [
      {
        type: 'TEST_1',
        payload: {
          heavy1: {
            hello: 'world'
          },
          heavy2: {
            hello: 'world'
          },
          heavy3: {
            hello: 'world'
          }
        },
        meta: {
          adapter: 'I'
        }
      },
      {
        type: 'TEST_2',
        payload: {
          heavy1: {
            hello: 'world'
          },
          heavy2: {
            hello: 'world'
          },
          heavy3: {
            hello: 'world'
          }
        },
        meta: {
          adapter: 'L'
        }
      }
    ]

    let interceptedEvents = await Interceptor.apply((event: any) => {
      // Imagine doing more complicated async writing in here...
      if (event.meta.adapter === 'I') {
        Object.keys(event.payload).forEach(payloadKey => {
          event.payload[payloadKey] = 'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen'
        })
      }
      if (event.meta.adapter === 'L') {
        Object.keys(event.payload).forEach(payloadKey => {
          event.payload[payloadKey] = '2248ee2fa0aaaad99178531f924bf00b4b0a8f4e'
        })
      }
      return event
    }, events)

    const expectedResult = [
      {
        type: 'TEST_1',
        payload: {
          heavy1: 'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen',
          heavy2: 'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen',
          heavy3: 'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen'
        },
        meta: {
          adapter: 'I'
        }
      },
      {
        type: 'TEST_2',
        payload: {
          heavy1: '2248ee2fa0aaaad99178531f924bf00b4b0a8f4e',
          heavy2: '2248ee2fa0aaaad99178531f924bf00b4b0a8f4e',
          heavy3: '2248ee2fa0aaaad99178531f924bf00b4b0a8f4e'
        },
        meta: {
          adapter: 'L'
        }
      }
    ]
    expect(interceptedEvents).toEqual(expectedResult)
    let interceptedEvents2 = await Interceptor.apply((event: any) => {
      // Imagine doing more complicated async reading in here...
      Object.keys(event.payload).forEach(payloadKey => {
        if (payloadKey.indexOf('heavy') !== -1) {
          event.payload[payloadKey] = {
            hello: 'world'
          }
        }
      })

      return event
    }, events)
    expect(interceptedEvents2).toEqual(events)
  })

  it('applyAll uses apply', async () => {
    let events = [
      {
        type: 'TEST_1',
        payload: {
          heavy1: {
            hello: 'world'
          }
        },
        meta: {
          adapter: 'I'
        }
      },
      {
        type: 'TEST_2',
        payload: {
          heavy1: {
            hello: 'world'
          }
        },
        meta: {
          adapter: 'L'
        }
      }
    ]

    let results = await Interceptor.applyAll(
      [
        (event: any) => {
          return event
        },
        (event: any) => {
          return event
        }
      ],
      events
    )

    expect(results).toEqual(events)
  })
})
