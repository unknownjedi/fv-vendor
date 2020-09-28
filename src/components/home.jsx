import React, { Component } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import i_HomeBanner from "../assets/images/Home_Banner.jpg";

class Home extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = { isAdmin: false };
  }
  componentDidMount() {
    this.setState({ isAdmin: true });
  }
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div>
        <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light">
          <div class="container">
            <Link className="navbar-brand" to="/">
              Venus Interior
            </Link>
            <div class="navbar-collapse collapse">
              <ul class="nav navbar-nav navbar-right">
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="home-banner">
          <Slider {...settings}>
            <div>
              <img src={i_HomeBanner} alt="Venus Banner" />
            </div>
          </Slider>
        </div>
        <div className="container product-container">
          <div className="card top-products-bg">
            <span className="title">Top Products</span>
          </div>
          <div className="container top-products">
            <div className="card product">Product</div>
            <div className="card product">Product</div>
            <div className="card product">Product</div>
            <div className="card product">Product</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
