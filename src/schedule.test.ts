import mockdate from 'mockdate'

import { LightSchedule } from './schedule'

testTime(7, 0, -1, 1)
testTime(7, 3, 0, 5)
testTime(10, 57, 95, 100)
testTime(11, 0, 99, 101)
testTime(12, 0, 99, 101)
testTime(17, 0, 99, 101)
testTime(17, 3, 97, 100)
testTime(20, 57, 0, 5)
testTime(21, 0, -1, 1)

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

function testTime(
  hour: number,
  minute: number,
  lower: number,
  upper: number
): void {
  test(`is between ${lower}% and ${upper}% @ ${hour}:${minute
    .toString()
    .padStart(2, '0')}`, () => {
    mockdate.set(new Date(1, 1, 1, hour, minute))
    const schedule = new LightSchedule()
    expect(schedule.current).toBeGreaterThan(lower)
    expect(schedule.current).toBeLessThan(upper)
  })
}
