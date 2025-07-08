// Load products when products.html loads
window.addEventListener('DOMContentLoaded', loadProducts);

function loadProducts() {
  fetch('https://seasonwize-backend.huzaifa.repl.co/api/products')
    .then(response => response.json())
    .then(products => {
      const tbody = document.querySelector('tbody');
      tbody.innerHTML = ''; // clear old data

      products.forEach((prod, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${prod[1]}</td> <!-- name -->
            <td>PKR ${prod[2]}</td> <!-- cost_price -->
            <td>PKR ${prod[3]}</td> <!-- selling_price -->
            <td>${prod[4]}</td> <!-- stock -->
            <td>
              <button class="btn btn-sm btn-warning" onclick="editProduct(${prod[0]})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteProduct(${prod[0]})">Delete</button>
            </td>
          </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(err => console.error('Error fetching products:', err));
}

// Example: Delete product
function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`https://seasonwize-backend.huzaifa.repl.co/api/products/${id}`, { method: 'DELETE' })
      .then(() => loadProducts())
      .catch(err => console.error('Delete error:', err));
  }
}
