class Product {
    // title;
    // imageUrl;
    // description;
    // price;

    constructor(title, image, desc, price) {
        this.title = title;
        this.imageUrl = image;
        this.description = desc;
        this.price = price;
    }
}

class ElementAttribute {
    constructor(attrName, attrValue){
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true){
        this.hookId = renderHookId;
        if(shouldRender){
            this.render();
        }
    }

    render() {}

    createRootElement(tag, cssClasses, attributes){
        const rootElement = document.createElement(tag);
        if(cssClasses){
            rootElement.className = cssClasses;
        }
        if(attributes && attributes.length > 0){
            for(const attr of attributes){
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component{
    item = [];

    set cartItems(value){
        this.item = value;
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
    }

    get totalAmount() {
        const sum = this.item.reduce(
            (prevValue, cartItem) => prevValue + cartItem.price, 0
        );
        return sum;
    }

    constructor (renderHookId){
        super(renderHookId);
    }

    addProduct(product){
        const updatedItems = [...this.item];
        updatedItems.push(product);
        this.cartItems = updatedItems;
        
    }

    render(){
        const cartEl = this.createRootElement('section', 'cart')
        cartEl.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now!</button>
        `;
        this.totalOutput = cartEl.querySelector('h2');
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId){
        super(renderHookId, false); 
        this.product = product;
        this.render()
    }

    addToCart(){
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement('li', 'product-item'); 
        prodEl.innerHTML = `
            <div>
                <img src="${this.product.imageUrl}" alt="${this.product.title}" >
                <div class="product-item__content">
                    <h2>${this.product.title}</h2>
                    <h3>\$${this.product.price}</h3>
                    <p>${this.product.description}</p>
                    <button>Add to Cart</button>
                </div>
            </div>
            `;
            const addCartButton = prodEl.querySelector('button');
            addCartButton.addEventListener('click', this.addToCart.bind(this));
    }
}

class ProductList extends Component {
    products = [];

    constructor(renderHookId) {
        super(renderHookId);
        this.fetchProduct();
    }

    fetchProduct(){
        this.products = [
            new Product(
                'A Pillow', 
                'https://ae01.alicdn.com/kf/HTB1VOqscZyYBuNkSnfoq6AWgVXaC/Garlands-Of-Summer-Flower-With-Butterfly-Printed-Cotton-Cushion-Cover-European-Design-Throw-Pillow-Case-For.jpg', 
                'A soft pillow', 
                19.99
            ),
            new Product(
                'A Carpet', 
                'https://www.mcardles.com.au/wp-content/uploads/2018/03/How-Long-Does-It-Take-A-Carpet-To-Dry-After-Cleaning-And-Why-Is-This-important.jpg', 
                'A good quality carpet which you might like.',
                89.99
            )
        ];
        this.renderProduct();
    }

    renderProduct() {
        for(const prod of this.products){
            new ProductItem(prod, 'prod-list');
        }
    }

    render() {
        this.createRootElement('ul', 'product-list', [
            new ElementAttribute('id', 'prod-list')
        ]);
        if(this.products && this.products.length > 0){
            this.renderProduct();
        }
        
    }
}


class Shop {
    constructor(){
       this.render(); 
    }

    render(){
        this.cart = new ShoppingCart('app');
        new ProductList('app');
    }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCart(product){
        this.cart.addProduct(product);
    }
}

App.init();