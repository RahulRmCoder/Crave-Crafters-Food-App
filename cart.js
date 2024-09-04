window.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
  });
  
  function loadCartItems() {
    const cartTableBody = document.getElementById('cartTableBody');
    const totalAmountElement = document.getElementById('totalAmount');
    const totalElement = document.getElementById('total');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    cartTableBody.innerHTML = ''; // Clear existing cart items
    let totalAmount = 0; // Initialize total amount
  
    if (cart.length === 0) {
        // If cart is empty, display a message
        const emptyRow = cartTableBody.insertRow();
        const emptyCell = emptyRow.insertCell();
        emptyCell.colSpan = 6;
        emptyCell.textContent = 'Your cart is empty.';
    } else {
        // Populate the cart table with items
        cart.forEach(item => {
            const row = cartTableBody.insertRow();
            const removeCell = row.insertCell();
            const imageCell = row.insertCell();
            const nameCell = row.insertCell();
            const priceCell = row.insertCell();
            const quantityCell = row.insertCell();
            const subtotalCell = row.insertCell();
  
            // Add remove button
            const removeButton = document.createElement('i');
            removeButton.classList.add('far', 'fa-times-circle');
            removeButton.addEventListener('click', () => {
                removeFromCart(item.name);
            });
            removeCell.appendChild(removeButton);
  
            // Add image (using promises for proper image loading)
            const image = document.createElement('img');
            image.alt = item.name;
            imageCell.appendChild(image);
  
            // Check for image existence (try various formats)
            let imagePath = `${item.name}.jpg`; // No need for "images/" here
            loadImage(imagePath).then(img => {
                image.src = imagePath;
            }).catch(() => {
                imagePath = `${item.name}.jpeg`;
                loadImage(imagePath).then(img => {
                    image.src = imagePath;
                }).catch(() => {
                    imagePath = `${item.name}.png`;
                    loadImage(imagePath).then(img => {
                        image.src = imagePath;
                    }).catch(() => {
                        imagePath = `${item.name}.gif`;
                        loadImage(imagePath).then(img => {
                            image.src = imagePath;
                        }).catch(() => {
                            imagePath = `${item.name}.webp`; // Try WebP
                            loadImage(imagePath).then(img => {
                                image.src = imagePath;
                            }).catch(() => {
                                imagePath = `${item.name}.avif`; // Try AVIF
                                loadImage(imagePath).then(img => {
                                    image.src = imagePath;
                                }).catch(() => {
                                    imagePath = "placeholder.jpg"; // Default image if not found
                                    image.src = imagePath;
                                });
                            });
                        });
                    });
                });
            });
  
            nameCell.textContent = item.name;
            priceCell.textContent = '₹' + item.price;
  
            // Add quantity input
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.classList.add('quantity');
            quantityInput.value = item.quantity;
            quantityInput.min = '1';
            quantityCell.appendChild(quantityInput);
  
            // Add subtotal
            const subtotal = item.price * item.quantity;
            subtotalCell.textContent = '₹' + subtotal;
  
            // Add subtotal to total amount
            totalAmount += subtotal;
  
            // Event listener for quantity change
            quantityInput.addEventListener('change', () => {
                const newQuantity = parseInt(quantityInput.value);
                const newSubtotal = item.price * newQuantity;
                subtotalCell.textContent = '₹' + newSubtotal;
                updateCartItemQuantity(item.name, newQuantity);
                loadCartItems(); // Reload the cart to update the total amount
            });
        });
  
        // Update total amount in the UI
        totalAmountElement.textContent = '₹' + totalAmount;
        totalElement.textContent = '₹' + totalAmount;
    }
  }
  
  // Function to load an image and return a promise
  function loadImage(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = imagePath;
    });
  }
  
  // Function to remove an item from the cart
  function removeFromCart(itemName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCartItems(); // Reload the cart items after removing
  }
  
  // Function to update the quantity of an item in the cart
  function updateCartItemQuantity(itemName, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
  