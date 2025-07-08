window.addEventListener('DOMContentLoaded', loadSuppliers);

function loadSuppliers() {
  fetch('https://seasonwize-server-production.up.railway.app/api/suppliers')
    .then(response => response.json())
    .then(suppliers => {
      const tbody = document.querySelector('tbody');
      tbody.innerHTML = '';
      suppliers.forEach((sup, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${sup[1]}</td> <!-- name -->
            <td>${sup[2]}</td> <!-- contact_info -->
          </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(err => console.error('Error fetching suppliers:', err));
}
