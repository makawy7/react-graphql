import { gql } from '@apollo/client'


export const CREATE_ORDER = gql`
  mutation createOrder($order: [OrderInput!]!) {
    createOrder(order: $order) {
      order_status
    }
  }
`
