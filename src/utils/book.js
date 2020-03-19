import axios from 'axios'
export default {
    /**
		*	本周强推 weekspush
		*	排行榜 	rankwraplist
		*/
		getHomePage() {
			return new Promise((resolve, reject) => {
				axios.get(`/qd`).then(res => {
					let div = document.createElement('div');
					div.innerHTML = res.data;
					let list =  div.querySelectorAll('.index-two-wrap .book-list ul li');
					let weekspush = []
					Array.from(list).forEach(div => {
						let item = document.createElement('div');
						item.appendChild(div)
						weekspush.push({
							channel: item.querySelector('.channel').innerText,
							name: item.querySelector('.name').innerText,
							author: item.querySelector('.author')?item.querySelector('.author').innerText:item.querySelector('.rec').innerText
						})
					})
					weekspush = weekspush.filter(item => item.author !== '广告')
					// console.log(weekspush)
					let rankwraplist = div.querySelectorAll('.rank-wrap .rank-list.sort-list');
					let rankwrap = []
					Array.from(rankwraplist).forEach(div => {
						let item = document.createElement('div');
						item.appendChild(div)
						let list = [];
						let tag = item.querySelector('.wrap-title').innerText.substr();
						tag = tag.substr(0, tag.length-3)
						let list_group = item.querySelectorAll('.book-list ul li')
						list_group.forEach(ele => {
							if(ele.querySelector('.name-box .name')) {
								list.push({
									name: ele.querySelector('.num-box').innerText,
									rank: ele.querySelector('.name-box .name').innerText
								})
							}
						})
						rankwrap.push({tag, list})
						   // if(item.querySelector('.author a')) {
						   // 	 rankwrap.push({
						   //  	channel: item.querySelector('.author a').innerText,
						   //  	name: item.querySelector('.book-info a').innerText,
						   //  	tag: item.querySelector('.digital').innerText,
						   //  	author: item.querySelector('.author .writer').innerText,
						   //  	cover: item.querySelector('.book-cover .link img').getAttribute('src'),
						   //  })
						   // }
					})
					resolve(weekspush, rankwrap)
				})
			})
		},
}