import {describe, it, expect, vi, beforeEach} from 'vitest'
import {fetchOutstandingTripPaymentsForRest} from '../src/arbor/trips.js'
import tripsFixture from './fixtures/trips.json'
import {authenticator} from '../src/arbor/auth.js'
import {axiosInstance} from '../src/restUtils.js'
import AxiosMockAdapter from 'axios-mock-adapter'
const axiosMock = new AxiosMockAdapter(axiosInstance)

authenticator.setInitialCookieValue('')

const username = 'user-name'
const password = 'psword'
const school = 'sch-name'
const studentId = 'student-id'

describe('fetch arbor trips', () => {
	beforeEach(() => {
		// Reset call counts and state before each test
		vi.clearAllMocks()
	})

	it('test', async () => {
		axiosMock.onGet(new RegExp(`/trip-ui/dashboard/student-id/${studentId}`)).reply(200, tripsFixture)

		const outstandingPayments = await fetchOutstandingTripPaymentsForRest(username, password, school, studentId)
		expect(outstandingPayments).toEqual({data: []})
	})
})
