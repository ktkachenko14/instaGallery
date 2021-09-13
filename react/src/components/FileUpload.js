import React, {useState} from "react";
import axios from "axios";
import AuthService from "../services/auth.service";

const defaultImageSrc = "/img/icons.png";
const currentUser = AuthService.getCurrentUser();

const initialFieldValues = {
    id: 1,
    comment : '',
    userId : '',
    imageName : '',
    imageSrc : defaultImageSrc,
    imageFile : null,
    upload: false,
    message: ""
}

export default function FileUpload(props){
    const [values, setValues] = useState(initialFieldValues)
    const [imageFile, setFile] = useState()
    const [imageName, setFileName] = useState()
    const [errors, setErrors] = useState({})

    const saveFile = (e) => {
        //console.log(e.target.files[0]);
        //console.log(e.target.files[0].name);
        
            setFile(e.target.files[0]); 
            setFileName(e.target.files[0].name); 
    };

    const handleInputChange = e => {
        const {name, value} = e.target;
        setValues({
            ...values,
            [name] : value
        })
    }
    const uploadFile = async (e) => {
        console.log(imageFile);
        const formData = new FormData();
        formData.append('id', values.id)
        formData.append('comment', values.comment)
        formData.append('userId', currentUser.id)
        formData.append('imageName', imageName)
        formData.append('imageFile', imageFile)
        try{
            const res = await axios.post("http://localhost:5000/api/user/addPost", formData);
            console.log(res);
        } catch(ex){
            console.log(ex);
        }
        setValues({
            upload:true
        });
        props.history.push("/profile");
        window.location.reload();
    };



    const showPreview = e =>{
        if(e.target.files && e.target.files[0]){
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc : x.target.result
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else{
            setValues({
                ...values,
                imageFile: null,
                imageSrc : defaultImageSrc
            })
        }
    }

    const applyErrorClass = field => ((field in errors && errors[field]==false)?' invalid-field':'')
    return(
        <>
             <div className="container text-center">
            <p className="lead">Add new post</p>
        </div>
        <form autoComplete="off" noValidate encType="multipart/form-data">
            <div className="card">
                
                <div className="card-body">
                    <div className="form-group">
                        <input type="file" accept="image/*" className={"form-control-file"+applyErrorClass('imageSrc')}
                        onChange={saveFile} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" placeholder="Comment" name="comment"
                        value={values.comment}
                        onChange= {handleInputChange}/>
                    </div>
                    <div className="form-group text-center">
                        <input type="button" className="btn btn-light" value="upload" onClick={uploadFile}/>
                    </div>
                </div>
            </div>
            
        </form>

        </>
    )
}