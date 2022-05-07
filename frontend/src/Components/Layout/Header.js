import React, { Fragment } from "react";
import { Route, Link } from "react-router-dom";
import Search from "./Search";

import "../../App.css";

// here we cannot directly keep the search component as search component takes history of browser.
// to get history of browser we should import router into header component then we can use history object
// here we cannot use history directly as search component is not directly under app.js component its winded over Header and then into Route  component.
// so tag history data to render prop of route and pull out history and then pass that history to search component as props.
const Header = () => {
  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/images/logo.png" />
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          {/* <Route render={({ history }) => <Search history={history} />} /> */}

          <Route render={({ history }) => <Search history={history} />} />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/login" className="btn ml-4" id="login_btn">
            Login
          </Link>

          <span id="cart" className="ml-3">
            Cart
          </span>
          <span className="ml-1" id="cart_count">
            2
          </span>
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;

// very very importnant note
// inside of render for route keep typing carefully for the arrow function dont give parantesis to component if given the component will not render properly

// so the search route will take some previous history object; so that history needs to be passed as a prop to search component.
