import {fetchMealBalance} from './mealAccount.js'
import {fetchOutstandingTripPayments} from './trips.js'

export async function fetchAllArbor(username, password, students) {
	if (!Array.isArray(students)) {
		throw new Error("param 'students' should be an array of objects like {school, studentId}")
	}
	const results = []
	//deliberately not run in parallel to avoid sending too many requests at the same time
	for (const {school, studentId} of students) {
		results.push(await fetchOneStudent(username, password, school, studentId))
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
