import React from 'react'
import Header from './Header'

class Layout extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div className="mx-auto mb-32 max-w-[1440px] max-2xl:px-8">{this.props.children}</div>
      </>
    )
  }
}

export default Layout
