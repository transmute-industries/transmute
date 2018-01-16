import { IFSA } from '../../transmute-framework'

export namespace Interceptor {
  export const apply = async (transform: (event: IFSA) => IFSA, events: IFSA[]) => {
    return Promise.all(
      events.map((event: any) => {
        return transform(event)
      })
    )
  }

  export const applyAll = async (transforms: Array<(event: IFSA) => IFSA>, events: IFSA[]) => {
    let mutatedEvents = events
    for (let i = 0; i < transforms.length; i++) {
      mutatedEvents = await apply(transforms[i], mutatedEvents)
    }
    return await Promise.all(mutatedEvents)
  }
}
