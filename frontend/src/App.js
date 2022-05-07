import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Components/Layout/Header";
import Login from "./Components/User/Login";
import Home from "./Components/Home";
import Footer from "./Components/Layout/Footer";
import ProductDetails from "./Components/Product/ProductDetails";
import Register from "./Components/User/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetails} exact />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
