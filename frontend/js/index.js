document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    const searchProduct = document.getElementById('search-product');

    // Function to load products from the backend
    async function loadProducts() {
        const response = await fetch('http://localhost:5000/products');
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        } else {
            productList.innerHTML = '<p class="text-center">No products available.</p>';
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
                            <a href="purchase_product.html?id=${product.id}" class="btn btn-primary">Purchase</a>
                        </div>
                    </div>
                </div>
            `;
            productList.innerHTML += productHTML;
        });
    }

    // Search filter
    searchProduct.addEventListener('input', async () => {
        const query = searchProduct.value.toLowerCase();
        const response = await fetch('http://localhost:5000/products');
        if (response.ok) {
            const products = await response.json();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query)
            );
            displayProducts(filteredProducts);
        }
    });

    // Load products on page load
    await loadProducts();
});
