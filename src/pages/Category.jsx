import React from "react";
import ProductCard from "../components/ProductCard";
import { withRouter } from "react-router";
import AppProvider from "../providers/AppContextProvider";
import { GET_CATEGORY, GET_PRODUCTS } from "../graphql/queries";
import LoadingSpinner from "../components/LoadingSpinner";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryExists: false,
      productsLoading: true,
      products: [],
    };
    this.updateCategory = this.updateCategory.bind(this);
    this.loadProducts = this.loadProducts.bind(this);
  }
  static contextType = AppProvider;

  componentDidMount() {
    this.updateCategory();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.setState({ productsLoading: true });
      this.updateCategory();
    }
  }

  updateCategory() {
    this.context.setActiveCategory(this.props.match.params.name);
    // Check if category exists
    this.context.client
      .query({
        query: GET_CATEGORY,
        variables: {
          name: this.props.match.params.name,
        },
      })
      .then((data) => {
        if (data.data.category !== null) {
          this.loadProducts();
        } else {
          this.setState({
            productsLoading: false,
          });
        }
      });
  }

  loadProducts() {
    this.context.client
      .query({
        query: GET_PRODUCTS,
        variables: {
          category_name: this.props.match.params.name,
        },
      })
      .then((data) =>
        this.setState({
          productsLoading: false,
          products: data.data.products,
        })
      );
  }
  render() {
    const { activeCategoryName } = this.context;
    return (
      <div className="space-y-16 font-raleway">
        <h1 className="text-4xl uppercase">{activeCategoryName}</h1>
        {this.state.productsLoading ? (
          <LoadingSpinner />
        ) : this.state.products.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(388px,1fr))] justify-between gap-8">
            {this.state.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="text-4xl">No Products Found</div>
          </div>
        )}
      </div>
    );
  }
}

const CategoryWithRouter = withRouter(Category);

export default CategoryWithRouter;
