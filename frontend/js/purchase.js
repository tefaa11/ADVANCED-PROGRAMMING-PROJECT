document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    const productDetails = document.getElementById('product-details');

    // Load product details from the backend
    async function loadProduct() {
        const response = await fetch(`http://localhost:5000/products/${productId}`);
        if (response.ok) {
            const product = await response.json();
            displayProduct(product);
        } else {
            productDetails.innerHTML = '<p class="text-center">Product not found.</p>';
        }
    }

    // Display product details
    function displayProduct(product) {
        const productHTML = `
            <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">Price: $${product.price}</p>
                <button class="btn btn-success" id="purchase-btn">Purchase Now</button>
            </div>
        `;
        productDetails.innerHTML = productHTML;

        // Event to purchase the product
        document.getElementById('purchase-btn').addEventListener('click', () => {
            alert('Purchase completed successfully.');
            window.location.href = 'index.html';
        });
    }

    // Submit client reference
    document.getElementById('reference-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const reference = document.getElementById('client-reference').value;

        const response = await fetch(`http://localhost:5000/products/${productId}/references`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reference })
        });

        if (response.ok) {
            alert('Reference submitted successfully.');
        } else {
            alert('Error submitting the reference.');
        }
    });

    // Load the product when the page loads
    await loadProduct();
});
