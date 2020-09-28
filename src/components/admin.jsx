import React, { Component } from "react";
import axios from "axios";
import AddProduct from "./addProduct";

class Admin extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = { model: 0 };
  }

  handleBulkUpload = (e) => {
    const type = "factory";
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file);
    reader.onloadend = () => {
      this.setState(
        {
          [type]: {
            file: file,
            imagePreviewUrl: reader.result,
          },
        },
        () => {
          this.uploadContent(file, reader.result, type);
        }
      );
    };
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      console.log("reader error");
      console.log(err);
    }
  };

  uploadContent = (f, i, type) => {
    this.setState({
      [type]: {
        loading: true,
        progress: 0,
      },
    });

    const fd = new FormData();
    fd.append("image", f, f.name);
    axios
      .post("https://backend.gou/image-upload", fd, {
        onUploadProgress: (pEvent) => {
          let progress = Math.round((pEvent.loaded / pEvent.total) * 100);
          this.setState({
            progress: progress - 1,
          });
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({
          [type]: {
            file: f,
            imagePreviewUrl: res.data.imageUrl,
            content: res.data.imageUrl,
            loading: false,
          },
        });
      });
  };

  handleSingleProduct = () => {
    this.setState({ model: 1 });
  };
  handleModelClose = () => {
    this.setState({ model: 0 });
  };

  render() {
    return (
      <div>
        <div className="container admin-cards">
          <div className="card add-products" onClick={this.handleSingleProduct}>
            <label>Add Single Product</label>
            <br />
            <br />
            <label>
              <span style={{ fontSize: 40 }}>+</span>
            </label>
          </div>
          <div className="card bulk-products">
            <div className="form-group">
              <label>Bulk Upload</label>
              <br />
              <div className="btn-group">
                <label class="file">
                  <input
                    type="file"
                    id="file"
                    aria-label="File browser example"
                    accept="application/xlxs"
                    onChange={this.handleBulkUpload}
                  />
                  <span class="file-custom"></span>
                </label>
              </div>
              <br />
              <br />
              <label>Note: Upload only csv and excel files</label>
            </div>
          </div>
        </div>
        {this.state.model !== 0 && (
          <AddProduct onClose={this.handleModelClose} />
        )}
      </div>
    );
  }
}

export default Admin;
