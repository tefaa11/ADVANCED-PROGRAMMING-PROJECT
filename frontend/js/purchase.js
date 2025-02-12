document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productDetails = document.getElementById('product-details');
    const referenceForm = document.getElementById('reference-form');
    const referenceInput = document.getElementById('client-reference');

    // Retrieve user information from localStorage
    const username = localStorage.getItem('username');
    const purchasedProducts = JSON.parse(localStorage.getItem('purchasedProducts')) || [];

    // Check if the user has already purchased this product
    const hasPurchased = purchasedProducts.includes(productId);

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
                <button class="btn btn-success" id="purchase-btn" ${hasPurchased ? 'disabled' : ''}>Purchase Now</button>
            </div>
        `;
        productDetails.innerHTML = productHTML;

        // Handle purchase logic
        const purchaseBtn = document.getElementById('purchase-btn');
        if (!hasPurchased) {
            purchaseBtn.addEventListener('click', async () => {
                // Prompt for additional information
                const phone = prompt('Enter your phone number:');
                if (!phone) {
                    alert('Phone number is required to complete the purchase.');
                    return;
                }

                const address = prompt('Enter your address:');
                if (!address) {
                    alert('Address is required to complete the purchase.');
                    return;
                }

                const bank = prompt('Enter the bank you are using for payment:');
                if (!bank) {
                    alert('Bank information is required to complete the purchase.');
                    return;
                }

                // Prepare purchase data
                const purchaseData = {
                    product_id: productId,
                    username: username,
                    phone: phone,
                    address: address,
                    bank: bank
                };

                console.log('Purchase data:', purchaseData);

                // Send purchase data to the backend (assuming you have an endpoint for purchases)
                const response = await fetch(`http://localhost:5000/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(purchaseData)
                });

                if (response.ok) {
                    alert('Purchase completed successfully.');

                    // Store purchased product
                    purchasedProducts.push(productId);
                    localStorage.setItem('purchasedProducts', JSON.stringify(purchasedProducts));

                    // Reload page to update UI
                    location.reload();
                } else {
                    alert('Error processing your purchase. Please try again.');
                }
            });
        }
    }

    // Reference submission: Only enable if the user has purchased
    if (!hasPurchased) {
        referenceForm.style.display = "none"; // Hide form if the product is not purchased
    }

    // Submit reference
    referenceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const reference = referenceInput.value;

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

    // Load product when the page is loaded
    await loadProduct();
});
