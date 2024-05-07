import React, { Component } from "react";
import { AppContext } from "../providers/AppContextProvider";
import { twMerge } from "tailwind-merge";
import { CREATE_ORDER } from "../graphql/mutations";

export default class CartOverlay extends Component {
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.editCart = this.editCart.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.state = {
      orderIsBeingPlaced: false,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    const { setCartOpen } = this.context;
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      !this.props.cartButtonRef.current.contains(event.target)
    ) {
      setCartOpen(false);
    }
  }

  editCart(item, action) {
    this.context.editCart(item, action);
  }

  placeOrder() {
    this.setState({ orderIsBeingPlaced: true });
    const cart = this.context.cart;

    const order = cart.map((item) => {
      return {
        productId: parseInt(item.productId),
        count: item.count,
        selectedAttributes: Object.entries(item.selectedAttributes).map(
          (item) => ({
            attrId: parseInt(item[0]),
            itemId: parseInt(item[1]),
          })
        ),
      };
    });
    
    this.context.client
      .mutate({
        mutation: CREATE_ORDER,
        variables: {
          order: order,
        },
      })
      .then(() => setTimeout(() => {}, 2000))
      .then(() => {
        this.setState({ orderIsBeingPlaced: false });
        this.context.emptyCart();
      });
  }

  render() {
    const { cartOpen, cart } = this.context;
    return (
      <div
        ref={(node) => (this.wrapperRef = node)}
        className={twMerge(
          "absolute right-0 top-10 z-30 space-y-10 bg-white px-8 py-8",
          cartOpen || "hidden"
        )}
      >
        {cart.length === 0 ? (
          <p className="text-lg capitalize">Your cart is empty!</p>
        ) : (
          <>
            <div className="text-xl">
              <span className="font-bold ">My Bag.</span> {cart.length} Item
              {cart.length > 1 && "s"}
            </div>

            {cart.map((cartItem, index) => (
              <div
                key={cartItem.productId + index}
                className="flex justify-between space-x-3"
              >
                <div className="space-y-1">
                  <div className="space-y-1">
                    <p className="text-lg">{cartItem.product.name}</p>
                    <p className="text-lg font-semibold">
                      {cartItem.product.prices[0]?.currency?.symbol +
                        cartItem.product.prices[0]?.amount}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {cartItem.product.attributes?.length > 0 &&
                      cartItem.product.attributes.map((attr) => (
                        <div key={attr.id} className="space-y-2">
                          <p>{attr.name}:</p>
                          <div className="space-x-1">
                            {attr.items.map((item) => {
                              return (
                                <div
                                  key={item.id}
                                  style={
                                    attr.type === "swatch"
                                      ? {
                                          backgroundColor:
                                            item.value.toLowerCase(),
                                        }
                                      : {}
                                  }
                                  className={twMerge(
                                    "inline-block cursor-default",
                                    attr.type === "swatch"
                                      ? "h-5 w-5"
                                      : "border border-black px-2 py-0.5 uppercase",
                                    cartItem.selectedAttributes[attr.id] ===
                                      item.id &&
                                      attr.type !== "swatch" &&
                                      "bg-black text-white",
                                    cartItem.selectedAttributes[attr.id] ===
                                      item.id &&
                                      attr.type === "swatch" &&
                                      "ring ring-green-600"
                                  )}
                                >
                                  {attr.type !== "swatch" && item.value}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center justify-between">
                    <button
                      onClick={() => this.editCart(cartItem, "plusOne")}
                      className="flex h-6 w-6 items-center justify-center border border-black p-1 hover:bg-black hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                    <span className="text-xl">{cartItem.count}</span>
                    <button
                      onClick={() => this.editCart(cartItem, "minusOne")}
                      className="flex h-6 w-6 items-center justify-center border border-black p-1 hover:bg-black hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <img
                      src={cartItem.product.gallery[0]}
                      alt="product"
                      className="h-full w-40 object-scale-down"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* total */}
            <div className="flex justify-between text-xl font-bold">
              <p>Total</p>
              <p>
                $
                {Number(
                  cart
                    .reduce(
                      (acc, current) =>
                        acc + current.count * current.product.prices[0]?.amount,
                      0
                    )
                    .toFixed(2)
                )}
              </p>
            </div>
            <button
              onClick={this.placeOrder}
              className={twMerge(
                "w-full  py-4 font-semibold uppercase text-white",
                this.state.orderIsBeingPlaced
                  ? "cursor-not-allowed bg-green-300"
                  : "bg-green-500"
              )}
            >
              {this.state.orderIsBeingPlaced ? "Loading" : "Place Order"}
            </button>
          </>
        )}
      </div>
    );
  }
}
