import printCurrency from './print-currency.js'

/**
 * @typedef {Object} CurrencyData
 * @property {number} ask
 * @property {Code} code
 */

/**
 * @typedef {'USD' | 'JYP'} Code
 */

const dollarChart = document.getElementById('dollarChart')
const yenChart = document.getElementById('yenChart')

const chartToDollar = new Chart(dollarChart, {
	type: 'line',
	data: {
		labels: [],
		datasets: [{ label: 'Dólar', data: [], borderWidth: 1 }]
	}
})

const chartToYen = new Chart(yenChart, {
	type: 'line',
	data: {
		labels: [],
		datasets: [{ label: 'Iene', data: [], borderWidth: 1 }]
	}
})

/**
 * @returns {Promise<void>}
 */
async function getCurrencyQuotes(currencyData) {
	try {
		updateCurrencyInfo(currencyData)
	} catch (error) {
		console.error('Ocorreu um erro:', error)
	}
}

/**
 * @param {CurrencyData} currencyData
 */
function updateCurrencyInfo(currencyData) {
	const time = getCurrentTime()
	const value = currencyData.ask
	const chart = getChart(currencyData.code)

	updateCurrencyChart(chart, time, value)
	printCurrency(currencyData.code, value)
}

/**
 * @param {Code} code 
 */
function getChart(code) {
	return { USD: chartToDollar, JPY: chartToYen }[code]
}

/**
 * @returns {string} A hora atual no formato HH:MM:SS.
 */
function getCurrentTime() {
	const date = new Date()
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')

	return `${hours}:${minutes}:${seconds}`
}

/**
 * @param {Chart} chartToDollar
 * @param {string} label
 * @param {number} value
 */
function updateCurrencyChart(chartToDollar, label, value) {
	chartToDollar.data.labels.push(label)
	chartToDollar.data.datasets.forEach((dataset) => {
		dataset.data.push(value)
	})

	chartToDollar.update()
}

/**
 * Workers
 */
const workerDollar = new Worker('./scripts/workers/workerDollar.js')
const workerYen = new Worker('./scripts/workers/workerYen.js')

workerDollar.postMessage('usd')
workerYen.postMessage('jpy')

workerDollar.addEventListener('message', (event) => {
	/** @type {CurrencyData} */
	const currencyData = event.data.USDBRL
	getCurrencyQuotes(currencyData)
})

workerYen.addEventListener('message', (event) => {
	/** @type {CurrencyData} */
	const currencyData = event.data.JPYBRL
	getCurrencyQuotes(currencyData)
})
