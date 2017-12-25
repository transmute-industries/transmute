export namespace Interceptor {
  export const apply = async (transform: any, events: any) => {
    return Promise.all(
      events.map((event: any) => {
        return transform(event)
      })
    )
  }

  export const applyAll = async (transforms: Array<(event: any) => any>, events: any) => {
    let mutatedEvents = events
    transforms.forEach(async transform => {
      mutatedEvents = await apply(transform, mutatedEvents)
    })
    return Promise.all(mutatedEvents)
  }
}
