import React from 'react';
import { Provider } from "react-redux";
import { createStore } from 'redux';
import reducer from './redux/reducer'
import { Switch, HashRouter as Router, Route, Redirect } from 'react-router-dom'
import "./assets/styles/public.less"
import Login from "./views/login/login"
import NotFound from "./views/404/404"
import NotAuthorized from "./views/403/403"
import Main from "./components/layout/main"
let store = createStore(reducer);
function App() {
  return (
    <div className='app'>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/main" component={Main} />
            <Route path="/404" component={NotFound} />
            <Route path="/403" component={NotAuthorized} />
            <Redirect to="404" />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
