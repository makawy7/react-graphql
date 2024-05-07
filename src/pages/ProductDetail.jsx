import React from "react";
import { AppContext } from "../providers/AppContextProvider";
import { withRouter } from "react-router";
import { GET_PRODUCT } from "../graphql/queries";
import parse from "html-react-parser";
import { twMerge } from "tailwind-merge";
import ImageSlider from "../components/ImageSlider";
import LoadingSpinner from "../components/LoadingSpinner";

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productLoading: true,
      product: {},
      selectedAttributes: {},
    };

    this.addToCart = this.addToCart.bind(this);
  }

  static contextType = AppContext;

  componentDidMount() {
    this.context.client
      .query({
        query: GET_PRODUCT,
        variables: {
          slug: this.props.match.params.id,
        },
      })
      .then((data) =>
        this.setState({
          productLoading: false,
          product: data.data.product,
        })
      );
  }

  addToCart() {
    if (
      Object.keys(this.state.selectedAttributes).length ===
      this.state.product.attributes?.length
    ) {
      const item = {
        productId: this.state.product.id,
        selectedAttributes: this.state.selectedAttributes,
        product: this.state.product,
        count: 1,
      };
      this.context.addToCart(item);
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.selectedAttributes !== this.state.selectedAttributes) {
  //     console.log(this.state.selectedAttributes['Size'])
  //   }
  // }

  selectAttribute(attrId, itemId) {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attrId]: itemId,
      },
    }));
  }

  render() {
    const product = this.state.product;
    return this.state.productLoading ? (
      <LoadingSpinner />
    ) : this.state.product === null ? (
      <div className="w-full flex justify-center">
        <div className="text-4xl">No Product Found</div>
      </div>
    ) : (
      <div className="flex space-x-28 pt-8">
        <div className="slider-container flex space-x-4">
          {product?.gallery?.length > 1 ? (
            <ImageSlider product={product} />
          ) : (
            <div className="cursor-pointer">
              <img
                src={product.gallery[0]}
                alt="product"
                className="h-[512px] object-cover"
              />
            </div>
          )}
        </div>
        <div className="space-y-6 font-raleway">
          <h1 className="text-2xl font-semibold">{product.name}</h1>

          {product.attributes?.length > 0 &&
            product.attributes.map((attr) => (
              <div key={attr.id} className="space-y-2">
                <p className="font-bold">{attr.name}:</p>
                <div className="space-x-2">
                  {attr.items.map((item) => (
                    <button
                      onClick={() => this.selectAttribute(attr.id, item.id)}
                      key={item.id}
                      style={
                        attr.type === "swatch"
                          ? { backgroundColor: item.value.toLowerCase() }
                          : {}
                      }
                      className={twMerge(
                        attr.type === "swatch"
                          ? "h-10 w-10"
                          : "border border-black px-5 py-2 uppercase",
                        this.state.selectedAttributes[attr.id] === item.id &&
                          attr.type !== "swatch" &&
                          "bg-black text-white",
                        this.state.selectedAttributes[attr.id] === item.id &&
                          attr.type === "swatch" &&
                          "ring ring-green-600"
                      )}
                    >
                      {attr.type !== "swatch" && item.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          <div className="space-y-2">
            <p className="font-bold">Price:</p>
            <p
              className={twMerge(
                `text-2xl font-bold`,
                product.inStock === false && "text-gray-300"
              )}
            >
              {product.prices[0]?.currency?.symbol + product.prices[0]?.amount}
            </p>
          </div>
          <button
            onClick={this.addToCart}
            className={twMerge(
              `w-full py-3 font-semibold uppercase text-white`,
              product.inStock &&
                Object.keys(this.state.selectedAttributes).length ===
                  this.state.product.attributes?.length
                ? "bg-green-500"
                : "cursor-not-allowed bg-green-300"
            )}
          >
            Add to cart
          </button>
          <div className="max-w-sm">{parse(product.description)}</div>
        </div>
      </div>
    );
  }
}

const ProductDetailWithRouter = withRouter(ProductDetail);

export default ProductDetailWithRouter;
