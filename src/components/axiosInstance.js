import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000'
  //baseURL: 'http://192.168.0.103:3000:'
});

export default instance;
