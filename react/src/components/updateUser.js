import React, {useState, useEffect} from "react";
import axios from "axios";
import AuthService from "../services/auth.service";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const defaultImageSrc = "/img/icons.png";
const initialFieldValues = {
    id: '',
    userName: '',
    email: '',
    photo : '',
    imageSrc : defaultImageSrc,
    imageFile : null
};
const currentUser = AuthService.getCurrentUser();

export default function UpdateUser(props){
    const [values, setValues] = useState(initialFieldValues)
    const [imageFile, setFile] = useState()
    const [photo, setFileName] = useState()
    const [recordForEdit, setRecordForEdit] = useState(null)
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
        formData.append('id', values.id)
        formData.append('userName', values.userName)
        formData.append('email', values.email)
        formData.append('photo', photo)
        formData.append('imageFile', imageFile)
        try{
            const res = await axios.put(`http://localhost:5000/api/user/${currentUser.id}`, formData);
            console.log(res);

        } catch(ex){
            console.log(ex);
        }
        //props.history.push("/updateUser");
        window.location.reload();
    }
    
    async function updateProfile() {
        console.log(imageFile);
        const formData = new FormData();
        formData.append('id', values.id)
        formData.append('userName', values.userName)
        formData.append('email', values.email)
        //formData.append('photo', photo)
        //formData.append('imageFile', imageFile)
        try{
            const res = await axios.put(`http://localhost:5000/api/profile/${currentUser.id}`, formData);
            console.log(res);

        } catch(ex){
            console.log(ex);
        }
        props.history.push("/profile");
        //window.location.reload();
    }

   /* function updatePhoto(){
       
    }*/
    
    return(
        <>
        <div className="registration">
   
            <form autoComplete="off" noValidate encType="multipart/form-data">
                <div className="card">
                    <div className="card-body">
                        <div className="form-group">
                        
                            <button type="button" className="btn btn-light" data-toggle="modal" data-target="#exampleModalCenter">
                            <AccountCircleIcon color="secondary"/> Change profile photo
                        </button>
                       
                        


                        <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Change profile photo</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="">
                                   <input type="file" accept="image/*" className="form-control-file"
                                    onChange={saveFile}
                                    /> 
                                    
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Отмена</button>
                                <button type="button" className="btn btn-dark" onClick={updateInfo}>Загрузить</button>
                            </div>
                            </div>
                        </div>
                        </div>
                        
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
                            value="upload" onClick={updateProfile} />
                    </div>
                    </div>
                </div>
            </form>

            
        </div>
        </>
    )
}