import {fetchMealBalance} from './mealAccount.js'
import {fetchOutstandingTripPayments} from './trips.js'
import {authenticator} from './auth.js'

export async function fetchAllArborForRest(username, password, students) {
	authenticator.invalidateCookies()
	return await fetchAllArbor(username, password, students)
}

export async function fetchAllArbor(username, password, students) {
	const results = {}
	//deliberately not run in parallel to avoid sending too many requests at the same time
	for (const [studentName, {school, studentId}] of Object.entries(students)) {
		results[studentName] = await fetchOneStudent(username, password, school, studentId)
	}
	return results
}

async function fetchOneStudent(username, password, school, studentId) {
	const mealBalance = await fetchMealBalance(username, password, school, studentId)
	const outstandingPayments = await fetchOutstandingTripPayments(username, password, school, studentId)
	return {
		mealBalance,
		outstandingPayments
	}
}
