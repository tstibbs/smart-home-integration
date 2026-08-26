import {describe, it, expect, vi, beforeEach} from 'vitest'
import axios from 'axios'
import {fetchMealBalance} from '../src/arbor/mealAccount.js'
import activePaymentsFixture from './fixtures/active-payments.json'
import {authenticator} from '../src/arbor/auth.js'

authenticator.setInitialCookieValue('')

const username = 'user-name'
const password = 'psword'
const school = 'sch-name'
const studentId = 'student-id'

// Tell Vitest to replace the real axios module with a mock object
vi.mock('axios')

describe('fetch meal balance', () => {
	beforeEach(() => {
		// Reset call counts and state before each test
		vi.clearAllMocks()
	})

	it('test', async () => {
		axios.get.mockImplementation(async (url, data) => {
			if (url.includes(`customer-account-ui/active-payments/student-id/${studentId}`)) {
				return {data: activePaymentsFixture, status: 200}
			}

			return {data: {}, status: 404}
		})

		const mealBalance = await fetchMealBalance(username, password, school, studentId)
		expect(mealBalance).toBe(5.67)
	})
})
