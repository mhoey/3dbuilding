const rows = 8
const cols = 10

const renderTableElements = (values) => {
    let tableMarkUp = []
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        tableMarkUp.push("<tr>")
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            tableMarkUp.push(`<td>${values[(rowIndex * rows) + (colIndex)]}</td>`)
        }
        tableMarkUp.push("</tr>")
    }
    return tableMarkUp.join("")
}

const renderTable = (values) => {
    const simTableElement = document.getElementById("simtable")
    simTableElement.innerHTML = renderTableElements(values)
}

const renderDistribution = (valueMap) => {
    const distributionList = document.getElementById("distr")
    distributionList.innerHTML = ""
    valueMap.entries().forEach(x => {
        let liElement = document.createElement("li")
        liElement.innerText = `Value ${x[0]} Count ${x[1]}`
        distributionList.appendChild(liElement)
    })
}

const initGraph = () => {
    const wrapperElement = document.getElementById("graphWrapper")
    const canvasElement = document.getElementById("graph")
    canvasElement.style.width=wrapperElement.clientWidth
    canvasElement.style.height=wrapperElement.clientHeight
    canvasElement.width = wrapperElement.clientWidth
    canvasElement.height = wrapperElement.clientHeight
}

const renderGraph = (distributionValues) => {
    const canvasElement = document.getElementById("graph")
    let cHeight = canvasElement.height
    let cWidth = canvasElement.width
   
    console.log(cWidth, cHeight)
    const xRatio = (cWidth)/80
    const yRatio = (cHeight)/11
    const ctx = canvasElement.getContext("2d")
    ctx.fillStyle = "#000000"
    //ctx.clearRect(0, 0, cWidth, cHeight)
    ctx.fillRect(0, 0, cWidth, cHeight)
    ctx.beginPath()
    ctx.strokeStyle = "#0000ff"
    ctx.lineWidth = 2
    ctx.moveTo(xRatio, cHeight-(distributionValues[0]*yRatio))
    for(let index=1; index<80; index++) {
        ctx.lineTo(xRatio*index, cHeight-(distributionValues[index]*yRatio))
    }
    ctx.stroke()
}

const normalize = (value, max) => {
    return value / max * 9.99
}

const parabolicValues = (total, samples) => {
    const average = total / samples
    const values = new Array(samples)

    // Create parabolic distribution centered at average
    // Using a parabola that peaks at the center
    const maxDeviation = average * 0.5

    for (let i = 0; i < samples; i++) {
        // Normalize position from -1 to 1
        const t = (i / (samples - 1)) * 2 - 1

        // Parabolic function: 1 - t²
        // This gives higher values near center, lower at edges
        const parabola = 1 - (t * t)

        // Scale deviation and add to average
        const deviation = parabola * maxDeviation
        values[i] = average + deviation - (maxDeviation / 2)
    }

    // Adjust to match exact total
    const currentSum = values.reduce((a, b) => a + b, 0)
    const adjustment = (total - currentSum) / samples

    return values.map(v => v + adjustment)
}

// Init heat values
let zeroValues = Array(rows * cols).fill(0)
renderTable(zeroValues)
initGraph()
renderGraph(zeroValues)


// Base average
const baseConsumption = 50 * 33 * 80
const calcTotal = (degrees) => {
    return (20 - (degrees)) * baseConsumption
}

const calcDistribution = (degrees) => {
    let total = calcTotal(degrees)
    let distributedValues = parabolicValues(total, 80)
    let calcSum = 0
    distributedValues.map(x => calcSum += x)
    distributedValues = distributedValues.map(x => Math.floor(normalize(x, 67620) * 1000) / 1000)
    return distributedValues
}



document.getElementById("ttotal").innerText = calcTotal(10)


document.getElementById("trange").value = 20

document.getElementById("trange").addEventListener("input",
    (inputEvent) => {
        let rangeValue = inputEvent.target.value
        document.getElementById("tvalue").innerText = rangeValue
        let distributedValues = calcDistribution(rangeValue)
        let maxValue = Math.max(...distributedValues)
        renderTable(distributedValues)
        renderGraph(distributedValues)
        document.getElementById("ttotal").innerText = `${calcTotal(rangeValue)} / ${maxValue}`
    }
)