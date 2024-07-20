class InventoryManagement {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('inventoryData1')) || {
            products: [
                { name: 'Bag', quantity: 120 },
                { name: 'Book', quantity: 75 },
                { name: 'Toy', quantity: 200 },
                { name: 'Laptop', quantity: 50 },
                { name: 'Keybord', quantity: 300 },
                { name: 'Mouse', quantity: 150 },
                { name: 'Water Bottle', quantity: 180 },
                { name: 'Charger', quantity: 60 },
                { name: 'Switch Box', quantity: 90 },
                { name: 'T-shirt', quantity: 45 }
            ],
            recipients: [
                { name: 'Karthick', product: 'Bag', quantity: 5 },
                { name: 'Karthick', product: 'Book', quantity: 10 },
                { name: 'Mukesh', product: 'Bag', quantity: 1 },
                { name: 'Mukesh', product: 'Book', quantity: 1 },
                { name: 'Mukesh', product: 'Toy', quantity: 1 },
                { name: 'Theetshitha', product: 'Bag', quantity: 3 },
                { name: 'Gunashri', product: 'Book', quantity: 7 },
                { name: 'Viji', product: 'Toy', quantity: 4 },
                { name: 'Hari', product: 'T-shirt', quantity: 6 },
                { name: 'Pattabi', product: 'Laptop', quantity: 8 },
                { name: 'Prakash', product: 'Mouse', quantity: 1 }
            ]
        };

        this.init();
    }

    init() {
        this.displayTopProducts();
        this.createBarChart();
        this.displayRecipientDetails();

        document.getElementById('add-product-btn').addEventListener('click', () => this.openModal('add'));
        document.getElementById('update-inventory-btn').addEventListener('click', () => this.openModal('update'));
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    saveData() {
        localStorage.setItem('inventoryData1', JSON.stringify(this.data));
    }

    displayTopProducts() {
        const products = [...this.data.products].sort((a, b) => b.quantity - a.quantity).slice(0, 3);
        const dashboardContent = document.querySelector('.inventoryDashBoardContent');
        dashboardContent.innerHTML = '';
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'inventoryDashBoardContentProduct';
            div.innerHTML = `<h3>${product.name}<i class="fa-solid fa-cart-plus"></i></h3><h3 class="inventoryDashBoardContentProductQuantity">${product.quantity}</h3>`;
            dashboardContent.appendChild(div);
        });
    }

    createBarChart() {
        const ctx = document.getElementById('inventoryChart').getContext('2d');
        const labels = this.data.products.map(product => product.name);
        const data = this.data.products.map(product => product.quantity);
        const barColors = ["red", "green", "blue", "orange", "brown", "purple", "yellow", "pink", "gray", "cyan"];

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: barColors,
                    data: data,
                    borderWidth: 1 // Optional: add border to the bars for better visibility
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 50 // Optional: adjust step size for y-axis
                        }
                    }
                }
            }
        });
    }

    displayRecipientDetails() {
        const tbody = document.querySelector('#recipients-table tbody');
        tbody.innerHTML = '';
        this.data.recipients.forEach(recipient => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${recipient.name}</td><td>${recipient.product}</td><td>${recipient.quantity}</td>`;
            tbody.appendChild(tr);
        });
    }

    openModal(type) {
        const modal = document.getElementById('modal');
        const title = document.getElementById('modal-title');
        const recipientFields = document.querySelectorAll('.recipient-field');
        modal.style.display = 'block';
        if (type === 'add') {
            title.textContent = 'Add Product';
            recipientFields.forEach(field => field.style.display = 'none');
        } else {
            title.textContent = 'Update Inventory';
            recipientFields.forEach(field => field.style.display = 'block');
        }
    }

    closeModal() {
        const modal = document.getElementById('modal');
        const form = document.getElementById('form');
        modal.style.display = 'none';
        form.reset();
    }

    handleSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('modal-title').textContent;
        const productName = document.getElementById('product-name').value;
        const productQuantity = parseInt(document.getElementById('product-quantity').value);
        const recipientName = document.getElementById('recipient-name').value;

        if (title === 'Add Product') {
            this.addProduct(productName, productQuantity);
        } else {
            this.updateInventory(recipientName, productName, productQuantity);
        }

        this.saveData();
        this.displayTopProducts();
        this.createBarChart();
        this.displayRecipientDetails();
        this.closeModal();
    }

    addProduct(name, quantity) {
        const product = this.data.products.find(product => product.name === name);
        if (product) {
            product.quantity += quantity;
        } else {
            this.data.products.push({ name, quantity });
        }
    }

    updateInventory(recipientName, productName, quantity) {
        const product = this.data.products.find(product => product.name === productName);
        if (product && product.quantity >= quantity) {
            product.quantity -= quantity;
            this.data.recipients.push({ name: recipientName, product: productName, quantity });
        } else {
            alert('Insufficient product quantity.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new InventoryManagement());
