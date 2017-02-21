import React from 'react'
import { render } from 'react-dom'
// import { combineReducers } from 'redux'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Immutable from 'immutable'
import { Router, browserHistory } from 'react-router'

import rootReducer from 'lib/shared/reducers'
import routes from 'lib/shared/routes'

let initialState = window.__INITIAL_STATE__

/* Handcrafting an Isomorphic Redux Application tutorial uses immutable.js in
 * state objects. A gotcha/ hack in code that has not got much attention is
 * where redux's createStore initial stores with initialStates.
 *
 * The method takes usual Javascript Objects and won't accept immutable objects
 * Tutorial hacked a solution that converts immutable state object into plain
 * object then coverts it back which feels hacky and trivial.
 * In effect what is done is to create a plain object that contains immutable
 * objects.
 *
 * Object.keys(initialState).forEach(
 *   key => {
 *     initialState[key] = Immutable.fromJS(initialState[key])
 *   }
 * )
 *
 * With the use of redux-immutable these become unnessessary. Simply storing
 * immutable objects in window.__INITIAL_STATE__ and use the version of
 * createStore that redux-immutable provides that accept immutable.js as
 * initialState parameter.
 */

const store = createStore(rootReducer, Immutable.fromJS(initialState))

console.log('before (server render)')
console.log(document.body.innerHTML)

render(
  <Provider store={store}>
    <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('react-view')
)

console.log('after (client update)')
console.log(document.body.innerHTML)
