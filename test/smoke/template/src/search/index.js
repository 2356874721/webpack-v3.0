'use strict'

import React from 'react'
import ReactDom from 'react-dom'
import './index.less'
import Logo from './image/test.jpeg'
import '../../common/index.js'
import { a } from '../../common/tree-shaking.js'
import { getQueryValue } from 'beast-sheriff-library'

class Search extends React.Component{
  constructor () {
    super(...arguments)
    this.state = {
      Content: null
    }
  }
  loadComponent () {
    import('../../common/comp.js').then((Content) => {
      this.setState({
        Content: Content.default
      })
    })
  }
  render() {
    const { Content } = this.state;
    const params = getQueryValue('aa')
    return  <div className="search-text">
              Search Text { a() }
              { Content ? <Content /> : null }
              { params }
              <img src={ Logo } onClick={ this.loadComponent.bind(this) } />
            </div>
  }
}

ReactDom.render(
  <Search/>,
  document.getElementById('root')
)