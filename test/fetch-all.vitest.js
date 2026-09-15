import {describe, it, expect, vi, beforeEach} from 'vitest'
import {fetchAllArbor} from '../src/arbor/fetch-all.js'
import activePaymentsFixture from './fixtures/active-payments-positive.json'
import noTripsFixture from './fixtures/trips-none.json'
import oneTripFixture from './fixtures/trips-one.json'
import tripDetailsFixture from './fixtures/trip-details.json'
import {authenticator} from '../src/arbor/auth.js'
import {axiosInstance} from '../src/restUtils.js'
import AxiosMockAdapter from 'axios-mock-adapter'
const axiosMock = new AxiosMockAdapter(axiosInstance)

authenticator.setInitialCookieValue('')

const username = 'user-name'
const password = 'psword'
const school = 'sch-name'
const studentId1 = 'student-id1'
const studentId2 = 'student-id2'

describe('fetch all arbor data', () => {
	beforeEach(() => {
		// Reset call counts and state before each test
		vi.clearAllMocks()
	})

	it('test', async () => {
		axiosMock
			.onGet(new RegExp(`/customer-account-ui/active-payments/student-id/${studentId1}`))
			.reply(200, activePaymentsFixture)
		axiosMock
			.onGet(new RegExp(`/customer-account-ui/active-payments/student-id/${studentId2}`))
			.reply(200, activePaymentsFixture)
		axiosMock.onGet(new RegExp(`/trip-ui/dashboard/student-id/${studentId1}`)).reply(200, noTripsFixture)
		axiosMock.onGet(new RegExp(`/trip-ui/dashboard/student-id/${studentId2}`)).reply(200, oneTripFixture)
		axiosMock.onGet(new RegExp(`/trip-ui/overview/trip-id/123/student-id/${studentId2}`)).reply(200, tripDetailsFixture)

		const data = await fetchAllArbor(username, password, {
			student1: {school, studentId: studentId1},
			student2: {school, studentId: studentId2}
		})
		expect(data).toStrictEqual({
			student1: {
				mealBalance: 5.67,
				outstandingPayments: []
			},
			student2: {
				mealBalance: 5.67,
				outstandingPayments: [['(optional) Museum Trip', '£6.78']]
			}
		})
	})
})
