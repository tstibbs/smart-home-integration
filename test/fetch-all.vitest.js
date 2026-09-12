import {describe, it, expect, vi, beforeEach} from 'vitest'
import {fetchAllArbor} from '../src/arbor/fetch-all.js'
import activePaymentsFixture from './fixtures/active-payments.json'
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

describe('fetch all arbor data', () => {
	beforeEach(() => {
		// Reset call counts and state before each test
		vi.clearAllMocks()
	})

	it('test', async () => {
		axiosMock
			.onGet(new RegExp(`/customer-account-ui/active-payments/student-id/${studentId}`))
			.reply(200, activePaymentsFixture)
		axiosMock.onGet(new RegExp(`/trip-ui/dashboard/student-id/${studentId}`)).reply(200, tripsFixture)

		const data = await fetchAllArbor(username, password, {student1: {school, studentId}, student2: {school, studentId}})
		expect(data).toStrictEqual({
			student1: {
				mealBalance: 5.67,
				outstandingPayments: []
			},
			student2: {
				mealBalance: 5.67,
				outstandingPayments: []
			}
		})
	})
})
