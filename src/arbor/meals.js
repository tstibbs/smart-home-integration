import axios from 'axios'

import {fetch} from './utils.js'

//if currently the weekend, show the whole of the next week, otherwise show this week
const sowAdjusters = [1, 0, -1, -2, -3, -4, 2]
const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export async function fetchMeals(username, password, school, studentId, menuId) {
	console.log({school, studentId, menuId})
	let date = new Date()
	date.setDate(date.getDate())
	console.log(date)
	const data = await fetch(
		username,
		password,
		school,
		`meal-ui/setup-meal-choices/meal-rotation-menu-id/${menuId}/student-id/${studentId}`
	)
	return getMealsForDate(data, date)
}

function getMealsForDate(data, date) {
	let sow = new Date(date)
	sow.setDate(sow.getDate() + sowAdjusters[date.getDay()])
	let sowDate = sow.toLocaleString('en-GB', {day: '2-digit'})
	let sowMonth = sow.toLocaleString('en-GB', {month: 'short'}).slice(0, 3)
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
