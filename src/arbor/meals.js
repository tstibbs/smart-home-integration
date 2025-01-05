import axios from 'axios'

import {request} from '../restUtils.js'
import {auth} from './auth.js'

//if currently the weekend, show the whole of the next week, otherwise show this week
const sowAdjusters = [1, 0, -1, -2, -3, -4, 2]
const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export async function fetchMeals(username, password, school, studentId) {
	console.log({school, studentId})
	let date = new Date()
	date.setDate(date.getDate())
	console.log(date)
	let cookies = await auth(username, password, school)
	let {data} = await fetchData(cookies, school, studentId)
	return getMealsForDate(data, date)
}

async function fetchData(cookies, school, studentId) {
	//TODO I have no idea what the meal-rotation-menu-id and term-id numbers actually refer to.
	let url = `https://${school}.arbor.sc/guardians/meal-ui/setup-meal-choices/meal-rotation-menu-id/6/student-id/${studentId}/term-id/71?format=javascript`

	return await request(() =>
		axios.get(url, {
			headers: {
				Cookie: cookies
			}
		})
	)
}

function getMealsForDate(data, date) {
	let sow = new Date(date)
	sow.setDate(sow.getDate() + sowAdjusters[date.getDay()])
	let sowDate = sow.toLocaleString('en-GB', {day: '2-digit'})
	let sowMonth = sow.toLocaleString('en-GB', {month: 'short'})
	let sowYear = sow.getFullYear()

	let sowRegex = new RegExp(`Week beginning ${sowDate}.+${sowMonth}.+${sowYear}`)
	console.log(sowRegex)
	let week = data.content[0].content.find(({props}) => sowRegex.test(props?.title)).content
	let meals = daysOfTheWeek.reduce((days, dayName) => {
		let meal = week.find(({props}) => props?.fieldLabel == dayName)?.props.value
		days[dayName] = meal != null ? meal : 'No information'
		return days
	}, {})
	console.log(meals)
	return meals
}
