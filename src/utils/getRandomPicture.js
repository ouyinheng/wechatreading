import axios from 'axios'

export default {
	getPicture() {
		return new Promise((resolve, reject) => {
			axios.get('/huaban/favorite/beauty').then(res => {
				let srcList = [];
				let html = res.data;
				let filestr = html.split('app.page["pins"] = ')[1];
	            filestr = filestr.split(';')[0];
	            let imgList = JSON.parse(filestr)
	            imgList.forEach(item => {
	                srcList.push('http://hbimg.huabanimg.com/'+item.file.key)
	            })
	            resolve(srcList)
			})
		})
	}
}