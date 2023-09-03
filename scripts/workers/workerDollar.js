const baseUrl = 'https://economia.awesomeapi.com.br'

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

    const currencyData = await response.json()
    postMessage(currencyData)
	} catch (error) {
		throw error
	}
}

addEventListener('message', () => {
	fetchCurrencyData()
	setInterval(() => {
		fetchCurrencyData()
	}, 5000)
})
