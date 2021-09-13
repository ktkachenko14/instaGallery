import React, { Component, useState } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const defaultImageSrc = '/img/icons.png';

export default class Post extends Component
{
    constructor(props) {
        super(props);
        this.onChangeComment = this.onChangeComment.bind(this);
    
        this.state = {
          currentUser: AuthService.getCurrentUser(),
          picture: '',
          comment: '',
          pictureSrc: defaultImageSrc,
          pictureFile: null
        };

      }

      onChangeComment(e) {
        this.setState({
          comment: e.target.value
        });
      }

      showPreview(e){
        if(e.target.files && e.target.files[0]){
          let pictureFile = e.target.files[0];
          const reader =  new FileReader();
          reader.onload = x=>{
            this.setState({
              pictureFile,
              pictureSrc: x.target.result
            });
          }
          reader.readAsDataURL(pictureFile);
        }
        else{
          this.setState({
            pictureFile: null,
            pictureSrc: defaultImageSrc
          });
        }
        
      }

      handleFormSubmit = e => {
          const formData = new FormData();
          formData.append('picture', this.state.picture)
          formData.append('pictureFile', this.state.pictureFile)
          formData.append('comment', this.state.comment)
      }
      render() {
        const { currentUser } = this.state;
    
        return (
          <div className="container">
            <form autoComplete="off">
                <div className="card">
                    <div className="card-body">
                    <img src={this.state.pictureSrc} className="card-img-top"/>
                    <div className="form-group"> 
                            <input type="file" accept="image/*" className="form-control-file"
                            onChange={this.showPreview}/>
                        </div>
                        <div className="form-group"> 
                            <input className="form-control" placeholder="Comment" name="comment"
                            value={this.state.comment}
                            onChange={this.onChangeComment}/>
                        </div>
                        <div className="form-group">
                  <button className="btn btn-primary btn-block">Add post</button>
                </div>
                    </div>
                </div>
            </form>
           
    
          </div>
        );
      }
}