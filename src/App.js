import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Layout from './components/Layout'
import CategoryWithRouter from './pages/Category'
import { AppProvider } from './providers/AppContextProvider'
import ProductDetailWithRouter from './pages/ProductDetail'

class App extends React.Component {
  render() {
    return (
      <AppProvider>
        <Router>
          <Layout>
            <Switch>
              <Route path="/category/:name" component={CategoryWithRouter} />
              <Route path="/product/:id" component={ProductDetailWithRouter} />
              <Redirect path="*" to="/category/all" />
            </Switch>
          </Layout>
        </Router>
      </AppProvider>
    )
  }
}

export default App
