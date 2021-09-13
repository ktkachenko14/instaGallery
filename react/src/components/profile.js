import React, {useState, useEffect}  from "react";
import AuthService from "../services/auth.service";
import  Image  from "./post";
import axios from "axios";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import DeleteIcon from '@material-ui/icons/Delete';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

const initial = {
    currentUser: AuthService.getCurrentUser()
}
const defaultImageSrc = "/img/icons.png";

const initialFieldValues = {
    id: '',
    userName: '',
    email: '',
    photo : '',
    imageSrc : defaultImageSrc,
    imageFile : null
};

const imageValues = {
    id: '',
    comment: '',
    imageName: '',
    username : '',
    imageSrc : defaultImageSrc,
    userId: ''
};

const addPostValues = {
    id: 1,
    comment : '',
    userId : '',
    imageName : '',
    imageSrc : '',
    imageFile : null,
    upload: false,
    message: ""
}

const useStyles = makeStyles((theme) => ({
    root: {
        
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    rootCard:{
        maxWidth: 500,
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
    media: {
        height: 350,
      },
      input: {
        display: 'none',
      },
  }));


export default function Profile(props) {
  const [imagesUser, setImagesUser] = useState([])
  const [values, setValues] = useState(initialFieldValues)
  const [details, setDetails] = useState(imageValues)
  const [post, setPosts] = useState(addPostValues)
  const [imageFile, setFile] = useState()
  const [imageName, setFileName] = useState()

  const currentUser = AuthService.getCurrentUser();
  useEffect(()=> {
      refreshImageList();
      showUserInfo();
      detailsPost();
  }, [])
  const classes = useStyles();


  async function refreshImageList(){
      const config = {
          method: 'get',
          url: `http://localhost:5000/api/user/${currentUser.id}`,
          headers: {'Authorization': `bearer ${currentUser.token}`}
      }
      const res = await axios(config)
          .then(result => {
              console.log(result.data);
              setImagesUser(result.data);
          })
          .catch(err => console.log(err));
      
  }

  async function  deleteImage(e, id) {
    
      if(window.confirm('Вы точно хотите удалить?'))
      {
         const config = {
        method: 'delete',
        url: `http://localhost:5000/api/account/${id}`,
        headers: {'Authorization': `bearer ${currentUser.token}`}
    }
    const res = await axios(config)
        .then(result => {
            console.log(result.data);
            refreshImageList()
            window.location.reload();
            
        })
        .catch(err => console.log(err)); 
      }
    
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
  
  async function detailsPost(e, id){
    const config = {
        method: 'get',
        url: `http://localhost:5000/api/account/${id}`,
        headers: {'Authorization': `bearer ${currentUser.token}`}
    }
    const res = await axios(config)
      .then(result => {
          console.log(result.data);
          setDetails(result.data);
      })
      .catch(err => console.log(err));
  }

  const imageCard = data =>(
   <div id="card" data-toggle="modal" data-target="#exampleModalCenter" onClick={ e => detailsPost(e,parseInt(data.id))}>
       <Card className={classes.rootCard} >
            <CardActionArea>
            <CardMedia
                className={classes.media}
                image={data.imageSrc}
                title="Post"
            />
            
            </CardActionArea>
        </Card>

   </div>
    

  )
  const saveFile = (e) => {
    
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
    formData.append('id', post.id)
    formData.append('comment', post.comment)
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
    
const pageUpdate= ()=> {
    props.history.push("/updateProfile");
    window.location.reload();
}

const numbers = Math.ceil(imagesUser.length);


      return (
        <>
        <div className="row mb-3">
            <div className="col-md-5" >
                <div className="p-2 bd-highlight" id="avatar">
                    <Avatar  src={values.imageSrc} className={classes.large}/>
                </div>
            </div>
            <div className="col-md-5" >
            
                
                <div className="card" id="cardInfo">

                <div className="d-flex flex-row bd-highlight mb-3">
                    
                    <div className="p-2 bd-highlight">
                        <h5 className="profileName">{values.userName}</h5>
                    </div>
                    <div className="p-2 bd-highlight" id="settings">
                        <Button color="secondary" onClick={pageUpdate}>
                            Edit profile
                        </Button>    
                    </div>
                    <div id="numbers">
                        <h5>{numbers} posts</h5>
                    </div>
                    <Button id="addPhoto" color="secondary" data-toggle="modal" data-target="#addModalCenter">
                        <AddAPhotoIcon/>
                    </Button>
                </div>
                </div>
                
        </div>

        </div>
        
    
        <div class="row row-cols-1 row-cols-md-3 g-4">
            
                 {
                           [...Array(Math.ceil(imagesUser.length))].map((e,i)=>
                            <div key={i}>
                                <div class="col">
                                <div className="">
                                    {imagesUser[i] ? imageCard(imagesUser[i]) : null}
                                </div>
                               </div>
                            </div>
                           )
                        }
            
        </div>

        <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                            <div className="modal-body">
                                <div className="imageCard">
                                <img src={details.imageSrc} className="card-img-top"/>
                                    
                                </div>
                            </div>
                            <div className="modal-footer">
                                <p id="comment">{details.comment}</p>
                                <Button variant="contained" onClick={e => deleteImage(e, parseInt(details.id))}><DeleteIcon color="secondary"/></Button>
                            </div>
                            </div>
                        </div>
        </div> 

        <div className="modal fade" id="addModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                            <div className="modal-body">
                            <div className="container text-center">
            <p className="lead">Add new post</p>
        </div>
        
        <form autoComplete="off" noValidate encType="multipart/form-data">
            <div className="card">
                
                <div className="card-body">
                    <div className="form-group">
                    <input type="file" accept="image/*" className="form-control-file"
                        onChange={saveFile} />
                        
                    </div>
                    <div className="form-group">
                        <input className="form-control" placeholder="Comment" name="comment"
                        value={values.comment}
                        onChange= {handleInputChange}/>
                    </div>
                    <div>
                        <div className={classes.root}>
                            <Button fullWidth  color="secondary" onClick={uploadFile}>Upload</Button>
                        </div>
                        
                    </div>
                        
                </div>
            </div>
            
        </form>
                            </div>

                            </div>
                        </div>
        </div> 
                   
        </>
      )
}