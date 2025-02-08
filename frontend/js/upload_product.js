document.getElementById("product-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const productName = document.getElementById("product-name").value;
    const productDescription = document.getElementById("product-description").value;
    const productPrice = document.getElementById("product-price").value;
    const productImage = document.getElementById("product-image").files[0];

    if (!productImage) {
        alert("Please select an image.");
        return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("price", productPrice);
    formData.append("image", productImage);  // The name 'image' must match what Flask expects

    try {
        const response = await fetch("http://localhost:5000/products", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("upload-result").innerHTML = `
                <div class="alert alert-success">
                    ${result.message} <br>
                    <strong>Name:</strong> ${result.product.name} <br>
                    <strong>Price:</strong> ${result.product.price} <br>
                    <img src="${result.product.image_url}" alt="Product Image" class="img-fluid mt-2" style="max-width: 200px;">
                </div>
            `;
            document.getElementById("product-form").reset();
        } else {
            document.getElementById("upload-result").innerHTML = `
                <div class="alert alert-danger">
                    Error: ${result.error}
                </div>
            `;
        }
    } catch (error) {
        console.error("Error uploading the image:", error);
        document.getElementById("upload-result").innerHTML = `
            <div class="alert alert-danger">
                Error connecting to the server.
            </div>
        `;
    }
});
