import {describe, it, expect, vi, beforeEach} from 'vitest'
import axios from 'axios'
import {fetchAllArbor} from '../src/arbor/fetch-all.js'
import activePaymentsFixture from './fixtures/active-payments.json'
import tripsFixture from './fixtures/trips.json'
import {authenticator} from '../src/arbor/auth.js'

authenticator.setInitialCookieValue('')

const username = 'user-name'
const password = 'psword'
const school = 'sch-name'
const studentId = 'student-id'

// Tell Vitest to replace the real axios module with a mock object
vi.mock('axios')

describe('fetch all arbor data', () => {
	beforeEach(() => {
		// Reset call counts and state before each test
		vi.clearAllMocks()
	})

	it('test', async () => {
		axios.get.mockImplementation(async (url, data) => {
			if (url.includes(`customer-account-ui/active-payments/student-id/${studentId}`)) {
				return {data: activePaymentsFixture, status: 200}
			}
			if (url.includes(`/guardians/trip-ui/dashboard/student-id/${studentId}?format=javascript`)) {
				return {data: tripsFixture, status: 200}
			}

			return {data: {}, status: 404}
		})

		const data = await fetchAllArbor(username, password, [{school, studentId}])
		const [student1] = data
		expect(student1.mealBalance).toBe(5.67)
		expect(student1.outstandingPayments).toEqual([])
	})
})
