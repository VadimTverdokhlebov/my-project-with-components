import pubSub from '../PubSub.js';
import { store } from '../store/store.js';
import { addProduct } from '../store/actionCreators/addProduct.js';
export default class ProductCard {

    root;
    elementMenu;

    #state = {
        quantity: 1,
    };

    constructor(root, elementMenu) {
        this.root = root;
        this.elementMenu = elementMenu;

        this.innerDiv = document.createElement('div');
        this.innerDiv.id = `#innerDiv${this.elementMenu.id}`;

        this.root.prepend(this.innerDiv);

        this.render();
    }

    render() {
        const html = /*html*/

            `<div class="product">
            <img class="foodLogo" src="http://localhost:3000/images/markets/subway.png">
        
            <img class="foodPicture" src="http://localhost:3000/${this.elementMenu.image}">
        
        <div class="foodName">${this.elementMenu.name}</div>

        <div class="foodLine">
            <p class="foodStructure">${this.elementMenu.description}</p>
        </div>

        <p class="foodPrice">Цена: ${this.elementMenu.price} руб.</p>
        <p class="foodCount">КОЛИЧЕСТВО</p>

        <form class="formAddBasket" id="addBasket" method="POST">
            <div class="foodCounter">

                <button id="btn2${this.elementMenu.id}" type="button">
                    <img alt="-" src="http://localhost:3000/images/minus.png" class="buttonMinus"/>
                </button>
                    <input class="quantity" type="text" value="${this.#state.quantity}">
                <button id="btn1${this.elementMenu.id}" type="button">
                    <img alt="+" src="http://localhost:3000/images/plus.png" class="buttonPlus"/>
                </button>
                </div>
                
                <input class="buttonBuy" id="buttonId${this.elementMenu.id}" type="button" value = "В КОРЗИНУ">
        </form>
        </div>`

        this.innerDiv.innerHTML = html;
        this.buttonToBaskedAddEventListener()
        this.buttonsAddEventListener();
    }

    buttonToBaskedAddEventListener() {
        this.innerDiv.querySelector(`#buttonId${this.elementMenu.id}`)
            .addEventListener('click', () => {
                // pubSub.publish("addProductToBasket", this.elementMenu);
                store.dispatch(addProduct(this.elementMenu.id, this.#state.quantity));
            })
    }

    buttonsAddEventListener() {
        this.innerDiv.querySelector(`#btn1${this.elementMenu.id}`)
            .addEventListener("click", this.increment.bind(this));

        this.innerDiv.querySelector(`#btn2${this.elementMenu.id}`)
            .addEventListener("click", this.decrement.bind(this));
    }

    increment() {
        if (this.#state.quantity < 20) {
            this.state = {
                ...this.#state,
                quantity: this.#state.quantity + 1,
            };
        }
    }

    decrement() {
        if (this.#state.quantity > 1) {
            this.state = {
                ...this.#state,
                quantity: this.#state.quantity - 1,
            };
        }
    }

    set state(newState) {
        this.#state = newState;
        this.elementMenu.quantity = this.#state.quantity;
        this.render();

        pubSub.publish('quantityChanged', {
            productId: this.elementMenu.id,
            count: this.#state.quantity
        });
    }
}
