/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import ProductCarousel from "./productCarousel";
import axios from "axios";

class AddProduct extends Component {
  state = {};
  constructor(props) {
    super(props);
    let product = {
      product_title: "",
      product_description: "",
      product_thumbnail: "",
      product_specification: [],
      product_price: {
        mrp: "",
        selling_price: "",
        discount: 0,
      },
      seller_details: {
        seller_name: "",
        seller_id: "",
      },
      product_images: [],
      product_category: "",
      product_subcategory: "",
      product_tags: [],
      product_highlights: [],
      product_varients: {
        isVariants: false,
        variants: [],
      },
      product_delivery: {
        min_time: "",
        max_time: "",
        delivery_charge: "",
        packing_charge: "",
      },
    };
    this.state = { product, selected: -1, image_files: [], thumbnail_file: "" };
  }

  handleChange = ({ target }) => {
    var reg = /^\d+$/;

    const val = target.value;

    if (target["attributes"]["data-value"]["value"] === "number") {
      if (val.match(reg) || val === "") {
        let product = { ...this.state.product, [target.name]: val };
        this.setState({ product });
      }
    } else {
      let product = { ...this.state.product, [target.name]: val };
      this.setState({ product });
    }
  };

  handleSpecChange = (e, i) => {
    const val = e.target.value;
    let key = "specification_" + e.target.name;
    let product_specification = [...this.state.product.product_specification];
    product_specification = product_specification.filter((spec, index) => {
      if (index === i) {
        spec[key] = val;
        console.log(spec);
      }
      return spec;
    });
    let product = { ...this.state.product, product_specification };
    this.setState({ product });
  };

  addSpecRow = () => {
    let product = {
      ...this.state.product,
      product_specification: [
        ...this.state.product.product_specification,
        { specification_name: "", specification_value: "" },
      ],
    };
    this.setState({ product });
  };

  removeSpecRow = (s, i) => {
    let product_specification = [...this.state.product.product_specification];
    product_specification = product_specification.filter((spec) => spec !== s);
    let product = { ...this.state.product, product_specification };
    this.setState({ product });
  };

  handlePriceChange = ({ target }) => {
    var reg = /^\d+$/;
    const val = target.value;
    const { selling_price, discount, mrp } = this.state.product.product_price;
    let m = mrp,
      sp = selling_price,
      dis = discount;
    if (val.match(reg) || val === "") {
      if (target.name === "mrp") {
        m = val;
        sp = val - (val * discount) / 100;
      }
      if (target.name === "selling_price") {
        sp = val;
        dis = 100 - (sp / m) * 100;
      }
      if (target.name === "discount") {
        dis = val;
        sp = m - (m * dis) / 100;
      }
      sp = Math.floor(sp);
      dis = Math.floor(dis);
      let product = {
        ...this.state.product,
        product_price: { mrp: m, selling_price: sp, discount: dis },
      };
      this.setState({ product });
    }
  };

  handleDeliveryChange = ({ target }) => {
    var reg = /^\d+$/;
    const val = target.value;
    if (val.match(reg) || val === "") {
      let product = {
        ...this.state.product,
        product_delivery: {
          ...this.state.product.product_delivery,
          [target.name]: val,
        },
      };
      this.setState({ product });
    }
  };

  handleVariantAvailability = ({ target }) => {
    let product = {
      ...this.state.product,
      product_varients: {
        ...this.state.product.product_varients,
        isVariants: !this.state.product.product_varients.isVariants,
      },
    };
    console.log(target.value);
    this.setState({ product });
  };

  handleThumbnail = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file);
    reader.onloadend = () => {
      let product = { ...this.state.product, product_thumbnail: reader.result };
      this.setState({ product });
    };
    try {
      reader.readAsDataURL(file);
      this.setState({ thumbnail_file: file });
    } catch (err) {
      console.log("reader error");
      console.log(err);
    }
  };

  handleProductImages = (e) => {
    e.preventDefault();
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onloadend = () => {
        let product_images = [
          ...this.state.product.product_images,
          reader.result,
        ];

        let product = { ...this.state.product, product_images };
        let image_files = [
          ...this.state.image_files,
          { file: files[i], img: reader.result },
        ];
        this.setState({ product, image_files });
      };
      try {
        reader.readAsDataURL(files[i]);
      } catch (err) {
        console.log("reader error for index", i);
        console.log(err);
      }
    }
  };

  getImageLink = async () => {
    let response = await axios.get(
      "https://static-upload.furniturevillages.com/upload/getImagePreSignedUrl",
      {},
      {}
    );
    let predata = response.data;
    return {
      uploadLink: predata.uploadURL,
      uploadKey: predata.storageUrl,
    };
  };

  uploadProductImages = async () => {
    let imagesArray = this.state.image_files;
    let product_images = [];
    await imagesArray.map(async (img, img_index) => {
      let upLink = await this.getImageLink();
      // console.log(upLink);
      axios
        .put(upLink.uploadLink, img.file, {
          onUploadProgress: (pEvent) => {
            let progress = Math.round((pEvent.loaded / pEvent.total) * 100);
            console.log(progress + "%");
          },
        })
        .then((res) => {
          product_images = [...product_images, upLink.uploadKey];
          let product = { ...this.state.product, product_images };
          this.setState({ product });
        });
    });
    // console.log(imgLinks);
  };
  uploadThumbnail = async () => {
    let img = this.state.thumbnail_file;
    let upLink = await this.getImageLink();
    // console.log(upLink);
    axios
      .put(upLink.uploadLink, img, {
        onUploadProgress: (pEvent) => {
          let progress = Math.round((pEvent.loaded / pEvent.total) * 100);
          console.log(progress + "%");
        },
      })
      .then((res) => {
        let product_thumbnail = upLink.uploadKey;
        let product = { ...this.state.product, product_thumbnail };
        this.setState({ product });
      });
  };

  onImgChange = (i) => {
    this.setState({
      selected: i,
    });
  };

  handleRemoveImage = (index, f) => {
    let product_images = this.state.product.product_images;
    product_images = product_images.filter((img, i) => i !== index);
    let product = { ...this.state.product, product_images };

    let image_files = this.state.image_files;
    image_files = image_files.filter((file) => f !== file);
    // console.log(image_files);
    this.setState({ product, image_files });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.uploadThumbnail();
    this.uploadProductImages();
    return false;
  };

  render() {
    const { onClose } = this.props;
    const {
      product_title,
      product_category,
      product_delivery,
      product_description,
      product_highlights,
      product_images,
      product_price,
      product_specification,
      product_subcategory,
      product_tags,
      product_thumbnail,
      product_varients,
    } = this.state.product;
    return (
      <div className="product-model">
        <div className="product-model-background"></div>
        <div className="container card product-model-card">
          <div className="model-header">
            <div className="product-name">
              <b>Add Product</b>
            </div>
            <div className="close-btn" onClick={onClose}>
              <i className="fa fa-close"></i>
            </div>
          </div>
          <div className="product-form">
            <form onSubmit={this.handleFormSubmit}>
              <div className="form-group">
                <label>Product Title</label>
                <input
                  type="text"
                  data-value="text"
                  name="product_title"
                  className="form-control"
                  placeholder="Product Title"
                  value={product_title}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label>Product Description</label>
                <input
                  type="text"
                  data-value="text"
                  name="product_description"
                  className="form-control"
                  placeholder="Product Description"
                  value={product_description}
                  onChange={this.handleChange}
                />
              </div>

              <div className="row">
                <div className="col-2">
                  <div className="form-group">
                    <label>Product Thumbnail</label>
                    <input
                      type="file"
                      data-value="file"
                      name="product_thumbnail"
                      className="form-control input-file"
                      accept="image/*"
                      onChange={this.handleThumbnail}
                    />
                    <div className="card plus-card">
                      {product_thumbnail !== "" ? (
                        <img
                          src={product_thumbnail}
                          alt="+"
                          width="100"
                          height="100"
                        />
                      ) : (
                        <span>+</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-10">
                  <div className="form-group row">
                    <label>Product Images</label>
                    <input
                      type="file"
                      data-value="file"
                      name="product_images"
                      className="form-control input-file"
                      accept="image/*"
                      multiple="multiple"
                      onChange={this.handleProductImages}
                    />
                    <div className="card plus-card">
                      <span>+</span>
                    </div>
                    <ProductCarousel
                      imgArr={product_images}
                      fileArr={this.state.image_files}
                      onSelected={this.onImgChange}
                      onRemoved={this.handleRemoveImage}
                    />
                  </div>
                </div>
              </div>

              <div className="row price-row">
                <div className="form-group col-4">
                  <label>Product Price</label>
                  <input
                    type="text"
                    data-value="text"
                    name="mrp"
                    className="form-control"
                    placeholder="MRP"
                    value={product_price.mrp}
                    onChange={this.handlePriceChange}
                  />
                </div>
                <div className="form-group col-4">
                  <label>Selling Price</label>
                  <input
                    type="text"
                    data-value="text"
                    name="selling_price"
                    className="form-control"
                    placeholder="Selling Price"
                    value={product_price.selling_price}
                    onChange={this.handlePriceChange}
                  />
                </div>
                <div className="form-group col-4">
                  <label>Discount (%)</label>
                  <input
                    type="text"
                    data-value="text"
                    name="discount"
                    className="form-control"
                    placeholder="Discount"
                    value={product_price.discount}
                    onChange={this.handlePriceChange}
                  />
                </div>
              </div>

              <div className="row category-row">
                <div className="form-group col-6">
                  <label>Product Category</label>
                  <input
                    type="text"
                    data-value="text"
                    name="product_category"
                    className="form-control"
                    placeholder="Product Category"
                    value={product_category}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-6">
                  <label>Product Sub-Category</label>
                  <input
                    type="text"
                    data-value="text"
                    name="product_subcategory"
                    className="form-control"
                    placeholder="Product Sub-Category"
                    value={product_subcategory}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Tags</label>
                <input
                  type="text"
                  data-value="text"
                  name="product_tags"
                  className="form-control"
                  placeholder="Product Tags"
                  value={product_tags}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label>Product Highlights</label>
                <input
                  type="text"
                  data-value="text"
                  name="product_highlights"
                  className="form-control"
                  placeholder="Product Highlights"
                  value={product_highlights}
                  onChange={this.handleChange}
                />
              </div>

              <div className="row form-group">
                <label>Product Delivery</label>
                <div className="form-group col-3">
                  <label>Min Time (Days)</label>
                  <input
                    type="text"
                    data-value="number"
                    name="min_time"
                    className="form-control"
                    placeholder="Min Time"
                    value={product_delivery.min_time}
                    onChange={this.handleDeliveryChange}
                  />
                </div>
                <div className="form-group col-3">
                  <label>Max Time (Days)</label>
                  <input
                    type="text"
                    data-value="number"
                    name="max_time"
                    className="form-control"
                    placeholder="Max Time"
                    value={product_delivery.max_time}
                    onChange={this.handleDeliveryChange}
                  />
                </div>
                <div className="form-group col-3">
                  <label>Delivery Charge (₹)</label>
                  <input
                    type="text"
                    data-value="number"
                    name="delivery_charge"
                    className="form-control"
                    placeholder="Delivery Charge"
                    value={product_delivery.delivery_charge}
                    onChange={this.handleDeliveryChange}
                  />
                </div>
                <div className="form-group col-3">
                  <label>Packing Charge (₹)</label>
                  <input
                    type="text"
                    data-value="number"
                    name="packing_charge"
                    className="form-control"
                    placeholder="packing Charge"
                    value={product_delivery.packing_charge}
                    onChange={this.handleDeliveryChange}
                  />
                </div>
              </div>

              {/* <div className="form-group">
                <label>Product Variants</label>
                <label class="switch">
                  <input
                    type="checkbox"
                    name="isvariants"
                    checked={product_varients.isVariants}
                    onChange={this.handleVariantAvailability}
                  />
                  <span class="slider round"></span>
                </label>
                <input
                  type="text"
                  data-value="number"
                  name="packing_charge"
                  className="form-control"
                  placeholder="packing Charge"
                  value={product_delivery.packing_charge}
                  onChange={this.handleDeliveryChange}
                />
              </div> */}

              <div className="form-group">
                <label>Product Specification</label>
                {product_specification.length > 0 && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {product_specification.map((spec, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <input
                                type="text"
                                data-value="text"
                                name="name"
                                className="form-control"
                                placeholder="Name"
                                value={spec.specification_name}
                                onChange={(e) => this.handleSpecChange(e, i)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                data-value="text"
                                name="value"
                                className="form-control"
                                placeholder="value"
                                value={spec.specification_value}
                                onChange={(e) => this.handleSpecChange(e, i)}
                              />
                            </td>
                            <td>
                              <span>
                                <a
                                  className="btn btn-danger btn-sm"
                                  onClick={() => this.removeSpecRow(spec, i)}
                                >
                                  Remove
                                </a>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                <a
                  className="btn btn-dark-chocolate btn-sm spec-add-btn"
                  onClick={this.addSpecRow}
                >
                  Add Row
                </a>
                <a
                  className="btn btn-dark-chocolate btn-sm submit-btn"
                  onClick={this.handleFormSubmit}
                >
                  Submit
                </a>
              </div>
            </form>
          </div>
          <div className="model-footer"></div>
        </div>
      </div>
    );
  }
}

export default AddProduct;
