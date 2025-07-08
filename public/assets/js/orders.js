window.addEventListener('DOMContentLoaded', loadOrders);

function loadOrders() {
  fetch('http://localhost:5000/api/orders')
    .then(response => response.json())
    .then(orders => {
      const tbody = document.querySelector('tbody');
      tbody.innerHTML = '';
      orders.forEach((order, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${order[1]}</td> <!-- shopify_order_id -->
            <td>${order[2]}</td> <!-- product_id (aap join karke product name bhi dikha sakte ho) -->
            <td>${order[3]}</td> <!-- quantity -->
            <td>PKR ${order[4]}</td> <!-- selling_price -->
            <td>${order[5]}</td> <!-- order_date -->
          </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(err => console.error('Error fetching orders:', err));
}
