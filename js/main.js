class StoreClass{
    constructor(){
        this.items = [
            {
                name: 'item 1',
                price: 15.99,
                stock: 15
            },
            {
                name: 'item 2',
                price: 24.99,
                stock: 8
            }
        ];
        this.cart = [];
        this.totalCartItems = 0;
        this.totalCartPrice = 0.00;
    }
    addItemToCart(id, count){
        //check that the item added meets requirements
        if(!this.items[id]) throw new ClientError('That item doesn\'t exist.');
        if(count > this.items[id].stock) throw new ClientError('We currently do not have enough of that item in stock.');
        //modify cart variables
        //amount to add can't be a decimal
        count = count.toFixed(0);
        //check if item is already in cart
        if(this.cart.some(item=>this.items.includes(item))){
            //find array index of cart item
            let cartID = this.cart.findIndex((item)=>item.name == this.items[id].name);
            //get price of item
            let price = this.items[id].price;
            let priceToAdd = (price * count).toFixed(2);
            //increment cart counts
            this.cart[cartID].amount += count;
            this.totalCartItems += count;
            //increment cart prices
            this.cart[cartID].price += priceToAdd;
            this.totalCartPrice += priceToAdd;
        } else{
            //get price of item
            let price = this.items[id].price;
            let priceToAdd = (price * count).toFixed(2);
            //add new object to cart array
            this.cart.push({
                name: this.items[id].name,
                price: priceToAdd,
                amount: count
            });
            //increment cart counts
            this.totalCartItems += count;
            //increment cart prices
            this.totalCartPrice += priceToAdd;
        }
    }
    removeItemFromCart(id){
        //check that removing item meets requirements
        if(!this.cart[id]) throw new ClientError('You cannot remove an item that doesn\'t exist.');
        //update prices and counts
        this.totalCartItems -= this.cart[id].amount;
        this.totalCartPrice -= this.cart[id].price;
        //remove item from array
        this.cart.splice(id, 1);
    }
    changeCartItemAmount(id, count){
        //check that removing item meets requirements
        if(!this.cart[id]) throw new ClientError('You cannot remove an item that doesn\'t exist.');
        if(count < 1) this.removeItemFromCart(id);
        //count can't be a decimal
        count = count.toFixed(0);
        //find item array id
        let itemID = this.items.findIndex((item)=>item.name == this.cart[id].name);
        if(count > this.items[itemID].stock) throw new ClientError('We currently do not have enough of that item in stock.');
        //get prices and update counts
        let price = this.items[itemID].price
        let incPrice = (price * count).toFixed(2);
        this.cart[id].price = incPrice;
        this.cart[id].amount = count;
        this.totalCartPrice -= this.cart[id].price;
        this.totalCartPrice += incPrice;
        this.totalCartItems -= this.cart[id].amount;
        this.totalCartItems += count;
    }
}

class ClientError extends Error{
    constructor(message){
        //append error message to notification div
        document.getElementById('notificationMessage').innerHTML(message);
        //show notification div and hide after x seconds
        document.getElementById('notification').style('display', 'block');
        setTimeout(()=>{
            document.getElementById('notification').style('display', 'none');
        }, 4000);
    }
}

const Store = new StoreClass();
