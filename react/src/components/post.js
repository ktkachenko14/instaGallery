import React, {useState, useEffect} from "react";
import AuthService from "../services/auth.service";
import axios from "axios";
const defaultImageSrc = "/img/icons.png";
const currentUser = AuthService.getCurrentUser();

const initialFieldValues = {
    id : 0,
    comment : '',
    userId : '' ,
    imageName : '',
    imageSrc : defaultImageSrc,
    imageFile : null
}

export default function Image(props) {
    const {addOrEdit} = props
    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})
    const [imageFile, setFile] = useState()
    const [imageName, setFileName] = useState()
    const handleInputChange = e => {
        const {name, value} = e.target;
        setValues({
            ...values,
            [name] : value
        })
    }

    const showPreview = e =>{
        if(e.target.files && e.target.files[0]){
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageSrc : x.target.result,
                    userId: currentUser.id
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else{
            setValues({
                ...values,
                imageFile: null,
                imageSrc : defaultImageSrc,
                userId: currentUser.id
            })
        }
    }

    const validate =()=>{
        let temp = {}
        temp.imageSrc = values.imageSrc==defaultImageSrc?false:true;
        setErrors(temp)
        return Object.values(temp).every(x => x==true)
    }

    const resetForm = () => {
        setValues(initialFieldValues)
        document.getElementById('image-uploader').value = null;
        setErrors({})
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if(validate()){
            const formData = new FormData();
            formData.append('id', values.id)
            formData.append('comment', values.comment)
            formData.append('userId', values.userId)
            formData.append('imageName', values.imageName)
            formData.append('imageFile', values.imageFile)
            console.log(formData)
            addOrEdit(formData, resetForm)
            /*try{
                const res = await axios.post("http://localhost:5000/api/user/addPost", formData);
                console.log(res);
            } catch(ex){
                console.log(ex);
            }*/
        }
    }

    const applyErrorClass = field => ((field in errors && errors[field]==false)?' invalid-field':'')
    
    return(
        <>
        <div className="container text-center">
            <p className="lead">Add new post</p>
        </div>
        <form autoComplete="off" noValidate onSubmit={handleFormSubmit} encType="multipart/form-data">
            <div className="card">
                <img src={values.imageSrc} className="card-img-top"
                id="image-uploader"/>
                <div className="card-body">
                    <div className="form-group">
                        <input type="file" accept="image/*" className={"form-control-file"+applyErrorClass('imageSrc')}
                        onChange={showPreview} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" placeholder="Comment" name="comment"
                        value={values.comment}
                        onChange= {handleInputChange}/>
                    </div>
                    <div className="form-group text-center">
                        <button type="submit" className="btn btn-light">Submit</button>
                    </div>
                </div>
            </div>
        </form>
        </>
    )
}