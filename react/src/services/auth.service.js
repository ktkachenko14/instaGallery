import axios from "axios";


const API_URL = "http://localhost:5000/api/user/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "registration", {
      username,
      email,
      password
    }, {method: 'POST'},
    {headers: { 'content-type': 'application/x-www-form-urlencoded' }});
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }

 
 
  
}

export default new AuthService();