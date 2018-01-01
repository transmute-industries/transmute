import { cloneDeep } from 'lodash'
import moment from 'moment'

import { Logic } from '../../../../transmute-framework'

import states from '../__mocks__/states'
import { isHeroBirthday } from '../__mocks__/jsonLogic'

/**
 * Logic tests
 */
describe('Logic event tests', () => {
  it('Logic.applyJsonLogic returns the result of jsonLogic.apply', () => {
    // Here we inject a date and isHeroBirthday property into each event
    // We then use json logic to evaluate a rule on each event
    // This approach is useful for systems where user's design complex rules about state
    let eventsOverTime = cloneDeep(states)

    let birthday = states[0].payload.hero.birthday
    let date = moment(birthday, 'YYYY-MM-DD').subtract(2, 'days')
    eventsOverTime.forEach((event: any) => {
      event.payload.date = date.format('YYYY-MM-DD')
      date = date.add(1, 'days')

      let check = Logic.applyJsonLogic(isHeroBirthday, event.payload)
      event.payload.isHeroBirthday = Logic.applyJsonLogic(isHeroBirthday, event.payload)

      if (check) {
        expect(eventsOverTime.indexOf(event)).toBe(2)
      }
    })
  })

  it('Logic.applyJsonLogicProjection map events to applyJsonLogic(rule, event)', () => {
    let eventsOverTime: any = cloneDeep(states)
    let birthday = states[0].payload.hero.birthday
    let date = moment(birthday, 'YYYY-MM-DD').subtract(2, 'days')
    eventsOverTime.forEach((event: any) => {
      event.payload.date = date.format('YYYY-MM-DD')
      date = date.add(1, 'days')
    })
    let states2 = eventsOverTime.map((event: any) => {
      return event.payload
    })
    let projection = Logic.applyJsonLogicProjection(isHeroBirthday, states2)
    expect(!projection[1])
    expect(projection[2])
  })
})
