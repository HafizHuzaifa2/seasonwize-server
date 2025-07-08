window.addEventListener('DOMContentLoaded', loadExpenses);

function loadExpenses() {
    fetch('https://seasonwize-backend.huzaifa.repl.co/api/expenses')
        .then(response => response.json())
        .then(expenses => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            expenses.forEach((exp, index) => {
                const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${exp[1]}</td> <!-- category -->
            <td>PKR ${exp[2]}</td> <!-- amount -->
            <td>${exp[3]}</td> <!-- expense_date -->
            <td>${exp[4]}</td> <!-- description -->
          </tr>
        `;
                tbody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(err => console.error('Error fetching expenses:', err));
}
