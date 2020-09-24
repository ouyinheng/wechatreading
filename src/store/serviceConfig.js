import Axios from "axios";
// import router from '@/router'
// import Message from 'muse-ui-message';
// import 'muse-ui-message/dist/muse-ui-message.css';
// Axios.defaults.baseURL = process.env.API_ENV
Axios.defaults.timeout = 20000;
Axios.defaults.withCredentials = true;
Axios.defaults.headers = {
    'Content-type': 'application/json'
}
Axios.interceptors.response.use(
	(resp) => {
		// let result = resp.data
		return Promise.resolve(resp.data);
	},
	(error) => {
		// const status = error.response.status
		// Message.alert(error.response.data.msg, 'TIPS');
		return Promise.reject(error);
	}
);
