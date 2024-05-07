import React from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'

export const AppContext = React.createContext()

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_HOST,
  cache: new InMemoryCache(),
})

export class AppProvider extends React.Component {
  constructor(props) {
    super(props)
    this.setActiveCategory = (categoryName) => {
      this.setState({
        activeCategoryName: categoryName,
      })
    }
    this.setCartOpen = (open) => {
      this.setState({ cartOpen: open })
    }

    // Add new item to the cart
    this.addToCart = (item) => {
      let itemExists = false
      let newCart = this.state.cart.map((myItem) => {
        if (
          myItem.productId === item.productId &&
          JSON.stringify(myItem.selectedAttributes) === JSON.stringify(item.selectedAttributes)
        ) {
          itemExists = true
          return { ...myItem, count: myItem.count + 1 }
        }
        return myItem
      })

      if (!itemExists) {
        newCart.push(item)
      }

      this.setState({ cart: newCart, cartOpen: true })
    }

    // Incrememnt or decrement items in the cart
    this.editCart = (item, action) => {
      let newCart = this.state.cart.map((myItem) => {
        if (
          myItem.productId === item.productId &&
          myItem.selectedAttributes === item.selectedAttributes
        ) {
          const newCount = action === 'plusOne' ? myItem.count + 1 : myItem.count - 1
          return { ...myItem, count: newCount }
        }
        return myItem
      })

      newCart = newCart.filter((myItem) => myItem.count > 0)

      this.setState({ cart: newCart })
    }

    // Empty Cart
    this.emptyCart = () => {
      this.setState({ cart: [], cartOpen: false })
    }

    this.state = {
      activeCategoryName: 'all',
      setActiveCategory: this.setActiveCategory,

      cartOpen: false,
      setCartOpen: this.setCartOpen,
      cart: [],
      addToCart: this.addToCart,
      editCart: this.editCart,
      emptyCart: this.emptyCart,

      client: client,
    }
  }

  render() {
    return <AppContext.Provider value={this.state}>{this.props.children}</AppContext.Provider>
  }
}

export default AppContext
