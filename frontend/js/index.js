document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    const searchProduct = document.getElementById('search-product');
    
    // Retrieve authentication token
    const token = localStorage.getItem('token');

    // Function to load products from the backend
    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:5000/products');
            if (response.ok) {
                const products = await response.json();
                displayProducts(products);
            } else {
                productList.innerHTML = '<p class="text-center">No products available.</p>';
            }
        } catch (error) {
            productList.innerHTML = '<p class="text-center">Failed to load products.</p>';
        }
    }

    // Function to display products in the grid
    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">$${product.price}</p>
                            <button class="btn btn-primary purchase-btn" 
                                    data-product-id="${product.id}">
                                Purchase
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productList.innerHTML += productHTML;
        });

        // Add event listeners to purchase buttons
        document.querySelectorAll('.purchase-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                if (!token) {
                    alert('You need to log in to make a purchase.');
                    window.location.href = 'login.html';
                } else {
                    const productId = event.target.getAttribute('data-product-id');
                    window.location.href = `purchase_product.html?id=${productId}`;
                }
            });
        });
    }

    // Search filter
    searchProduct.addEventListener('input', async () => {
        const query = searchProduct.value.toLowerCase();
        try {
            const response = await fetch('http://localhost:5000/products');
            if (response.ok) {
                const products = await response.json();
                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(query)
                );
                displayProducts(filteredProducts);
            } else {
                console.error('Failed to filter products. Status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        }
    });

    // Load products on page load
    await loadProducts();
});
