import {settings, select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './cartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = this.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = this.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = this.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = this.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = this.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = this.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = this.dom.wrapper.querySelector(select.cart.address);
  }

  add(menuProduct){

    const thisCart = this;

    /*generate HTML*/

    const generatedHTML = templates.cartProduct(menuProduct);

    /* create element using utilis.createElementFromHTML*/

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* add element to menu*/

    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }

  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click' , function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event) {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  } 

  update(){

    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.totalNumber = 0;
    thisCart.subTotalPrice = 0;

    for (let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subTotalPrice += product.price;
    }

    if (thisCart.subTotalPrice !== 0) {
      thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;
    }
    else {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    }

    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;

    for (let totalPrice of thisCart.dom.totalPrice) {
      totalPrice.innerHTML = thisCart.totalPrice; }
  }

  remove(cartProduct){

    const thisCart = this;

    const elementIndex = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(elementIndex, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
  
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    const payload = {
      address: thisCart.dom.address['value'],
      phone: thisCart.dom.phone['value'],
      totalPrice: thisCart.totalPrice,
      subTotalPrice: thisCart.subTotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    fetch(url, options);
  }
}

export default Cart;
