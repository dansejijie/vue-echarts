import axios from "axios";

console.log('process', process, process.env)
const { VUE_APP_API_ENV } = process.env;
let baseURL = '';
if(VUE_APP_API_ENV === 'pro') {
  baseURL= 'http://localhost:3201';
} else {
  baseURL= 'http://localhost:3200';
}
export default axios.create({baseURL})