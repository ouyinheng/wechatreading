import axios from 'axios'
axios.defaults.headers = {
    'Content-type': 'application/json'
}
export default {
	getPicture(url) {
		return new Promise((resolve, reject) => {
			axios.get(url).then(res => {
				let srcList = [];
				let html = res.data;
				let filestr = html.split('app.page["pins"] = ')[1];
				let imgList = [];
	            filestr = filestr.split('app.page["ads"]')[0];
	            filestr = filestr.substr(0, filestr.length-2);
	            imgList = JSON.parse(filestr)
	            imgList.forEach(item => {
	                srcList.push('http://hbimg.huabanimg.com/'+item.file.key)
	            })
	            resolve(srcList)
			})
		})
	},
	getPictureList(url) {
		return new Promise((resolve, reject) => {
			axios.get(url).then(res => {
				let srcList = [];
				let html = res.data;
				let filestr = html.split('app.page["pins"] = ')[1];
	   //          filestr = filestr.split(';')[0];
	   //          let imgList = JSON.parse(filestr)
			    let imgList = [];
	            filestr = filestr.split('app.page["ads"]')[0];
	            filestr = filestr.substr(0, filestr.length-2);
	            imgList = JSON.parse(filestr)
	            resolve(imgList)
			}).catch(err => {
				reject(true)
			})
		})
	},
	getPictureDetails(id) {
		return new Promise((resolve, reject) => {
			axios.get(`/huaban/pins/${id}/?k84h06p8`).then(res => {
				let banner = res.data.split('app["page"] = ')[1].split('app["timestamp"]')[0]
				banner = banner.substr(0, banner.length-2)
				banner = JSON.parse(banner);
	            resolve(banner)
			}).catch(err => {
				reject(true)
			})
		})
	}
}