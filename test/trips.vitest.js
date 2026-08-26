import {describe, it, expect, vi, beforeEach} from 'vitest'
import axios from 'axios'
import {fetchOutstandingTripPaymentsForRest} from '../src/arbor/trips.js'
import tripsFixture from './fixtures/trips.json'
import {authenticator} from '../src/arbor/auth.js'

authenticator.setInitialCookieValue('')

const username = 'user-name'
const password = 'psword'
const school = 'sch-name'
const studentId = 'student-id'

// Tell Vitest to replace the real axios module with a mock object
vi.mock('axios')

describe('fetch arbor trips', () => {
	beforeEach(() => {
		// Reset call counts and state before each test
		vi.clearAllMocks()
	})

	it('test', async () => {
		axios.get.mockImplementation(async (url, data) => {
			if (url.includes(`/guardians/trip-ui/dashboard/student-id/${studentId}?format=javascript`)) {
				return {data: tripsFixture, status: 200}
			}

			return {data: {}, status: 404}
		})

		const outstandingPayments = await fetchOutstandingTripPaymentsForRest(username, password, school, studentId)
		expect(outstandingPayments).toEqual({data: []})
	})
})
