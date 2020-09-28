/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";

import "./product.css";

class ProductCarousel extends Component {
  state = {
    isBtnHovered: false,
    onPreviousClicked: false,
    onNextClicked: false,
    arr: [],
    imgHovered: -1,
  };
  constructor(props) {
    super(props);
    let count = 0;
    let arr = this.props.imgArr.map((i) => {
      count = count + 1;
      return count;
    });
    this.state = {
      isBtnHovered: false,
      onPreviousClicked: false,
      onNextClicked: false,
      arr,
      imgHovered: -1,
      files: [],
    };
    this.renderImage();
  }
  componentDidMount() {
    this.renderImage();
  }

  onWheel = (e) => {
    e.preventDefault();
    var card = e.currentTarget["children"][1];
    var cardScrollPosition = card.scrollLeft;
    card.scrollTo({
      top: 0,
      left: cardScrollPosition + e.deltaY,
      behaviour: "smooth",
    });
  };

  onPrevious = (e) => {
    this.setState({ onPreviousClicked: true });
    setTimeout(() => {
      this.setState({ onPreviousClicked: false });
    }, 500);
    let card = e.target["offsetParent"];
    let cardValue = e.target["offsetParent"]["attributes"][0]["nodeValue"];
    if (cardValue !== "card-category") {
      card = card["offsetParent"];
    }
    let productRow = card["children"][1];
    this.scrollRightFunc(productRow, 120);
    return false;
  };

  scrollRightFunc = async (row, distance) => {
    for (let i = 0; i < distance; i = i + 5) {
      row.scrollTo({
        left: row.scrollLeft - 5,
        behaviour: "smooth",
      });
      await this.scrollDelay(10);
    }
  };

  onNext = (e) => {
    this.setState({ onNextClicked: true });
    setTimeout(() => {
      this.setState({ onNextClicked: false });
    }, 500);
    let card = e.target["offsetParent"];
    let cardValue = e.target["offsetParent"]["attributes"][0]["nodeValue"];
    if (cardValue !== "card-category") {
      card = card["offsetParent"];
    }
    let productRow = card["children"][1];
    this.scrollLeftFunc(productRow, 120);
    return false;
  };

  scrollLeftFunc = async (row, distance) => {
    for (let i = 0; i < distance; i = i + 5) {
      row.scrollTo({
        left: row.scrollLeft + 5,
        behaviour: "smooth",
      });
      await this.scrollDelay(10);
    }
  };

  scrollDelay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  onMouseOver = () => {
    this.setState({ isBtnHovered: true });
  };
  onMouseOut = () => {
    this.setState({ isBtnHovered: false });
  };

  getNextClassName = () => {
    let className = "prod-btn prod-next";
    if (this.state.isBtnHovered) className = className + " hovered";
    if (this.state.onNextClicked) className = className + " clicked";
    return className;
  };
  getPreviousClassName = () => {
    let className = "prod-btn prod-previous";
    if (this.state.isBtnHovered) className = className + " hovered";
    if (this.state.onPreviousClicked) className = className + " clicked";
    return className;
  };
  onImageHover = (i) => {
    this.setState({ imgHovered: i });
    this.props.onSelected(i);
  };
  onImageHoverOut = (i) => {
    this.setState({ imgHovered: -1 });
    this.props.onSelected(-1);
  };

  onOverlayClicked = (i, file) => {
    // console.log(file);
    this.setState({ imgHovered: -1 });
    this.props.onSelected(-1);
    this.props.onRemoved(i, file);
  };

  renderImage = () => {
    let files = this.props.fileArr;
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onloadend = () => {
        let f = [...this.state.files, { file: files[i], img: reader.result }];
        this.setState({ files: f });
      };
      try {
        reader.readAsDataURL(files[i]);
      } catch (err) {
        console.log("reader error for index", i);
        console.log(err);
      }
    }
  };

  render() {
    const { imgArr, fileArr } = this.props;
    const { imgHovered, files } = this.state;
    return (
      <div className="card product-carousel">
        <div className="card-category">
          <div className="prod-pic-row">
            <ul className="prod-shelf">
              {fileArr.map((file, i) => {
                let cname = "prod-pic-exclusive ";
                let className = "";
                if (imgHovered === i) className = cname + "selected";
                else className = cname;
                // console.log(f.img);
                let u = file.img;
                return (
                  <li key={i}>
                    <img
                      onMouseOver={() => this.onImageHover(i)}
                      onTouchStart={() => this.onImageHover(i)}
                      src={u}
                      alt={"Product images"}
                      className={className}
                      width="100px"
                      height="100px"
                    />
                    <div
                      className="pic-overlay"
                      onMouseOut={() => this.onImageHoverOut(i)}
                      onTouchStart={() => this.onImageHover(i)}
                      onTouchEnd={() => this.onImageHoverOut(i)}
                      onClick={() => this.onOverlayClicked(i, fileArr[i])}
                    >
                      Remove
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <a
            // eslint-disable-next-line no-script-url
            className={this.getPreviousClassName()}
            style={{ display: "inline" }}
            onClick={(e) => this.onPrevious(e)}
            onTouchStart={(e) => this.onPrevious(e)}
            onMouseOver={() => this.onMouseOver()}
            onMouseOut={() => this.onMouseOut()}
          >
            <span className="fa fa-angle-left"></span>
          </a>
          <a
            // eslint-disable-next-line no-script-url
            className={this.getNextClassName()}
            style={{ display: "inline" }}
            onClick={(e) => this.onNext(e)}
            onTouchStart={(e) => this.onNext(e)}
            onMouseOver={() => this.onMouseOver()}
            onMouseOut={() => this.onMouseOut()}
          >
            <span className="fa fa-angle-right"></span>
          </a>
        </div>
      </div>
    );
  }
}

export default ProductCarousel;
