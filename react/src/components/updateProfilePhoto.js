import React, {useState, useEffect} from "react";
import axios from "axios";
import AuthService from "../services/auth.service";

const defaultImageSrc = "/img/icons.png";
const initialFieldValues = {
    id: '',
    photo : '',
    imageSrc : defaultImageSrc,
    imageFile : null
};
const currentUser = AuthService.getCurrentUser();

export default function UpdateProfilePhoto(props){
    const [values, setValues] = useState(initialFieldValues)
    const [imageFile, setFile] = useState()
    const [photo, setFileName] = useState()
    const [errors, setErrors] = useState({})
    useEffect(()=> {
        showUserInfo();
    }, [])

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

    async function showUserInfo(){
        const config = {
            method: 'get',
            url: `http://localhost:5000/api/profile/${currentUser.id}`,
            headers: {'Authorization': `bearer ${currentUser.token}`}
        }
        const res = await axios(config)
          .then(result => {
              console.log(result.data);
              setValues(result.data);
          })
          .catch(err => console.log(err));
    }

    async function updateInfo() {
        console.log(imageFile);
        const formData = new FormData();
        formData.append('photo', photo)
        formData.append('imageFile', imageFile)
        try{
            const res = await axios.put("http://localhost:5000/api/user/addPost", formData);
            console.log(res);

        } catch(ex){
            console.log(ex);
        }
        //props.history.push("/profile");
        //window.location.reload();
    }
    const applyErrorClass = field => ((field in errors && errors[field]==false)?' invalid-field':'')

    return(
        <>
            <div className="container text-center">
                <p className="lead">Update profile</p>
            </div>
            <form autoComplete="off" noValidate encType="multipart/form-data">
                <div className="card">
                    <div className="card-body">
                        <div className="form-group">
                            <input type="file" accept="image/*" className={"form-control-file"+applyErrorClass('imageSrc')}
                            onChange={saveFile}
                            />
                        </div>
                        <div className="form-group">
                        <input type="text"  className="form-control-file"
                            name="userName"
                             value={values.userName}
                             onChange={handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <input type="text"  className="form-control-file"
                            name="email"
                             value={values.email}
                             onChange={handleInputChange}/>
                        </div>
                        <div className="form-group text-center">
                        <input type="button" className="btn btn-light" 
                            value="upload" onClick={updateInfo} />
                    </div>
                    </div>
                </div>
            </form>

        </>
    )
}