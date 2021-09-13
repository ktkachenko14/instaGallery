import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthService from "../services/auth.service";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
        height: 550,
      },
      input: {
        display: 'none',
      },
  }));
const defaultImageSrc = "/img/icons.png";

  const initialFieldValues = {
    id: '',
    userName: '',
    email: '',
    photo : '',
    imageSrc : '',
    imageFile : null
};


export default function ImageList(props){
    const [imageList, setImageList] = useState([])
    const [values, setValues] = useState(initialFieldValues)
    const currentUser = AuthService.getCurrentUser();
    useEffect(()=> {
        refreshImageList();
        showProfile();
    }, [])
    const classes = useStyles();

    async function refreshImageList(){
        const config = {
            method: 'get',
            url: 'http://localhost:5000/api/account',
            headers: {'Authorization': `bearer ${currentUser.token}`}
        }
        const res = await axios(config)
            .then(result => {
                console.log(result.data);
                setImageList(result.data);
            })
            .catch(err => console.log(err));
    
    }

    async function showProfile(e, userId){
        const config = {
            method: 'get',
            url: `http://localhost:5000/api/profile/${userId}`,
            headers: {'Authorization': `bearer ${currentUser.token}`}
        }
        const res = await axios(config)
          .then(result => {
              console.log(result.data);
              setValues(result.data);
          })
          .catch(err => console.log(err));
          
    }

    const imageCard = data =>(
        <div id="card">
            <Card className={classes.rootCard} onClick={e=>showProfile(e,data.userId)}>
                <CardActionArea>
                <CardMedia
                    className={classes.media}
                    component="img"
                    alt="Post"
                    image={data.imageSrc}
                />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {data.username}
          </Typography>
          <Typography gutterBottom component="h2">
            {data.comment}
          </Typography>
        </CardContent>
      </CardActionArea>
                
        </Card>
        </div>
    )
    return(
        <>
            <div align="center">
                <h3>For you</h3>
                <div class="row row-cols-1 row-cols-md-2 g-4">
                        {
                           [...Array(Math.ceil(imageList.length))].map((e,i)=>
                           <div key={i}>
                                <div class="col">
                                    {imageList[i] ? imageCard(imageList[i]) : null}
                                </div>
                            </div>
                           )
                        }
                </div>
            </div>
        </>
    )
}