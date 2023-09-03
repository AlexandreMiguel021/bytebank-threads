import printCurrency from './print-currency.js'

const baseUrl = 'https://economia.awesomeapi.com.br'
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
 * @throws {Error} 
 * @returns {Promise<CurrencyData>}
 */
async function fetchCurrencyData() {
	try {
		const response = await fetch(`${baseUrl}/json/last/USD-BRL`)

		if (!response.ok) {
			throw new Error('Não foi possível obter os dados.')
		}

		return await response.json()
	} catch (error) {
		throw error
	}
}

/**
 * @returns {Promise<void>}
 */
async function getCurrencyQuotes() {
	try {
		const currencyData = await fetchCurrencyData()
		updateCurrencyInfo(currencyData)
	} catch (error) {
		console.error('Ocorreu um erro:', error)
	}
}

/**
 * @typedef {Object} CurrencyData
 * @property {Object} USDBRL 
 * @property {number} USDBRL.ask
 */

/**
 * @param {CurrencyData} currencyData
 */
function updateCurrencyInfo(currencyData) {
	const time = getCurrentTime()
	const value = currencyData.USDBRL.ask

	updateCurrencyChart(chartToDollar, time, value)
	printCurrency('Dolar', value)
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
 * @param {number} data 
 */
function updateCurrencyChart(chartToDollar, label, data) {
	chartToDollar.data.labels.push(label)
	chartToDollar.data.datasets.forEach((dataset) => {
		dataset.data.push(data)
	})

	chartToDollar.update()
}

setInterval(() => {
	getCurrencyQuotes()
}, 10000)

getCurrencyQuotes()
