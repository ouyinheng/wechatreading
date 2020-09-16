import axios from 'axios'
axios.defaults.headers = {
    'Content-type': 'application/json'
}
export default {
    getRecommend() {
        return new Promise((resolve, reject) => {
			axios.get(
                `/api/api/search/content/?aid=24&app_name=web_search&offset=0&format=json&keyword=%E4%B9%A6%E8%8D%92&autoload=true&count=20&en_qc=1&cur_tab=1&from=search_tab&pd=synthesis&timestamp=${Date.now()}`
                ).then(res => {
                resolve(res)
			})
		})
    }
    // 
}