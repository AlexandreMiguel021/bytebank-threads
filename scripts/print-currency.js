function generateCurrencyItems(name, value) {
	const currencyItems = []

	for (let mult = 1; mult <= 1000; mult *= 10) {
		const formattedValue = (value * mult).toFixed(2)
		currencyItems.push(`${mult} ${name}: R$${formattedValue}`)
	}

	return currencyItems
}

function printCurrencyList(currencyItems) {
	const list = document.querySelector('[data-list]')
	list.innerHTML = ''

	currencyItems.forEach((itemText) => {
		const item = document.createElement('li')
		item.textContent = itemText
		list.appendChild(item)
	})
}

export default function printCurrency(name, value) {
	const currencyItems = generateCurrencyItems(name, value)
	printCurrencyList(currencyItems)
}
