import {describe, it, expect, vi, beforeEach} from 'vitest'
import {fetchMealBalance} from '../src/arbor/mealAccount.js'
import activePaymentsFixture from './fixtures/active-payments-negative.json'
import {authenticator} from '../src/arbor/auth.js'
import {axiosInstance} from '../src/restUtils.js'
import AxiosMockAdapter from 'axios-mock-adapter'
const axiosMock = new AxiosMockAdapter(axiosInstance)

authenticator.setInitialCookieValue('')

const username = 'user-name'
const password = 'psword'
const school = 'sch-name'
const studentId = 'student-id'

describe('fetch meal balance', () => {
	beforeEach(() => {
		// Reset call counts and state before each test
		vi.clearAllMocks()
	})

	it('test', async () => {
		axiosMock
			.onGet(new RegExp(`/guardians/customer-account-ui/active-payments/student-id/${studentId}`))
			.reply(200, activePaymentsFixture)

		const mealBalance = await fetchMealBalance(username, password, school, studentId)
		expect(mealBalance).toBe(-3.2)
	})
})
