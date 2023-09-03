import printCurrency from './print-currency.js'

/**
 * @typedef {Object} CurrencyData
 * @property {Object} USDBRL
 * @property {number} USDBRL.ask
 */

const dollarChart = document.getElementById('dollarChart')

const chartToDollar = new Chart(dollarChart, {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				label: 'Dólar',
				data: [],
				borderWidth: 1
			}
		]
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
	const value = currencyData.USDBRL.ask

	updateCurrencyChart(chartToDollar, time, value)
	printCurrency('Dólar', value)
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

const workerDollar = new Worker('./scripts/workers/workerDollar.js')

workerDollar.postMessage('usd')

workerDollar.addEventListener('message', (event) => {
	/** @type {CurrencyData} */
	const currencyData = event.data
	getCurrencyQuotes(currencyData)
})
