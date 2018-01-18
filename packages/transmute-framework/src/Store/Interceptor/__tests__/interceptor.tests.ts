import { Interceptor, EventStoreAdapter } from '../../../transmute-framework'

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
          adapter: 'N'
        }
      }
    ]

    let interceptedEvents = await Interceptor.apply((event: any) => {
      // Imagine doing more complicated async writing in here...
      if (event.meta.adapter === 'I') {
        Object.keys(event.payload).forEach(payloadKey => {
          event.payload[payloadKey] = 'Qme7DMBUe1EjXAKoEXzNh7G7NgMeGw9i2uLfB9bKVR7hHZ'
        })
      }
      if (event.meta.adapter === 'N') {
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
          heavy1: 'Qme7DMBUe1EjXAKoEXzNh7G7NgMeGw9i2uLfB9bKVR7hHZ',
          heavy2: 'Qme7DMBUe1EjXAKoEXzNh7G7NgMeGw9i2uLfB9bKVR7hHZ',
          heavy3: 'Qme7DMBUe1EjXAKoEXzNh7G7NgMeGw9i2uLfB9bKVR7hHZ'
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
          adapter: 'N'
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
          adapter: 'N'
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
