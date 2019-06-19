import { assert } from 'chai'
import renderTime from '../src/filters/TimeDisplay'

describe('TimeDisplay filter', () => {
    it('expects a duration in hundredths of a second', () => {
        assert.equal(renderTime(1), '00:00.01')
        assert.equal(renderTime(100), '00:01.00')
    })

    it('carries over seconds to minutes', () => {
        assert.equal(renderTime(100 * 62), '01:02.00')
    })
})
