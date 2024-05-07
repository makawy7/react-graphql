import { gql } from '@apollo/client'

export const GET_CATEGORIES = gql`
  query categories {
    categories {
      id
      name
      __typename
    }
  }
`

export const GET_CATEGORY = gql`
  query category($name: String!) {
    category(name: $name) {
      id
      name
      __typename
    }
  }
`

export const GET_PRODUCTS = gql`
  query products($category_name: String) {
    products(category_name: $category_name) {
      id
      name
      slug
      inStock
      gallery
      prices {
        amount
        currency {
          symbol
        }
      }
      attributes {
        id
        name
        type
        items {
          id
          value
          value
        }
      }
    }
  }
`

export const GET_PRODUCT = gql`
  query product($slug: String) {
    product(slug: $slug) {
      id
      name
      inStock
      gallery
      description
      prices {
        amount
        currency {
          symbol
        }
      }
      attributes {
        id
        name
        type
        items {
          id
          value
          value
        }
      }
    }
  }
`