import mockdate from 'mockdate'

import { LightSchedule } from './schedule'

testTime(7, 0, 0)
testTime(7, 1, 1)
testTime(10, 59, 254)
testTime(11, 0, 255)
testTime(12, 0, 255)
testTime(17, 0, 255)
testTime(17, 1, 254)
testTime(20, 59, 1)
testTime(21, 0, 0)

test('updates automatically', () => {
  jest.useFakeTimers()
  mockdate.set(new Date(1, 1, 1, 7, 0))
  const schedule = new LightSchedule()

  expect(schedule.current).toBe(0)

  mockdate.set(new Date(1, 1, 1, 7, 3))
  jest.advanceTimersToNextTimer()

  expect(schedule.current).toBeGreaterThan(0)
})

test('calls subscribers on update', (done) => {
  jest.useFakeTimers()
  mockdate.set(new Date(1, 1, 1, 7, 0))
  const schedule = new LightSchedule()

  expect(schedule.current).toBe(0)

  schedule.subscribe((v) => {
    expect(v).toBeGreaterThan(0)
    done()
  })

  mockdate.set(new Date(1, 1, 1, 7, 3))
  jest.advanceTimersToNextTimer()
})

function testTime(hour: number, minute: number, expected: number): void {
  test(`is ${expected} @ ${hour}:${minute.toString().padStart(2, '0')}`, () => {
    mockdate.set(new Date(1, 1, 1, hour, minute))
    const schedule = new LightSchedule()
    expect(schedule.current).toBe(expected)
  })
}
