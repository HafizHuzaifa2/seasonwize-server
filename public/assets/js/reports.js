let salesChartRef = null;
let expenseChartRef = null;
let profitChartRef = null;

function renderChart(id, label, labels, data, color, chartRefName) {
    const canvas = document.getElementById(id);
    if (!canvas) return console.error(`Canvas with ID '${id}' not found.`);

    const ctx = canvas.getContext('2d');

    if (window[chartRefName]) {
        window[chartRefName].destroy();
    }

    window[chartRefName] = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{ label, data, borderColor: color, fill: false, tension: 0.4 }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
}

function exportCSV() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    let url = `https://seasonwize-backend.huzaifa.repl.co/api/reports/export/csv`;
    if (fromDate && toDate) url += `?from=${fromDate}&to=${toDate}`;
    window.open(url, '_blank');
}

function exportPDF() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    let url = `https://seasonwize-backend.huzaifa.repl.co/api/reports/export/pdf`;
    if (fromDate && toDate) url += `?from=${fromDate}&to=${toDate}`;
    window.open(url, '_blank');
}

async function loadReports() {
    try {
        const from = document.getElementById('fromDate').value;
        const to = document.getElementById('toDate').value;

        let url = 'https://seasonwize-backend.huzaifa.repl.co/api/reports';
        if (from && to) {
            url += `?from=${from}&to=${to}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!data.labels || !data.salesData || !data.expenseData || !data.profitData) {
            return console.error('Missing expected data keys in response:', data);
        }

        renderChart('salesChart', 'Sales (PKR)', data.labels, data.salesData, 'rgb(75, 192, 192)', 'salesChartRef');
        renderChart('expenseChart', 'Expenses (PKR)', data.labels, data.expenseData, 'rgb(255, 99, 132)', 'expenseChartRef');
        renderChart('profitChart', 'Profit (PKR)', data.labels, data.profitData, 'rgb(255, 206, 86)', 'profitChartRef');
    } catch (err) {
        console.error('Failed to load reports:', err);
    }
}

window.addEventListener('DOMContentLoaded', loadReports);
