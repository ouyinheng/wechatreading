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
					div.innerHTML = res;
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
		getOriginSearch(url) {
			return new Promise((resolve, reject) => {
				let link = url.split('//book.qidian.com')[1]
				axios.get(`/bookqd${link}`).then(res => {
					let div = document.createElement('div');
					div.innerHTML = res;
					let list = div.querySelector('.book-detail-wrap');
					let tag = div.querySelector('.book-content-wrap .book-state li');
					let info = {
						tag: [],
						intro: ''
					}
					list.querySelectorAll('.book-info .tag a.red').forEach(item => {
						info.tag.push(item.innerText)
					})
					info = {
						intro: list.querySelector('.book-info .intro').innerText,
						tag: Array.from(list.querySelectorAll('.book-info .tag a.red')).map(item => item.innerText),
						author_tag: Array.from(tag.querySelectorAll('.detail .tags')).map(item => item.innerText)
					}
					resolve(info)
				})
			})
        },
        // 获取搜索框placeholder
        getPlaceholder() {
            return new Promise((resolve, reject) => {
				axios.get(`/qd`).then(res => {
					let div = document.createElement('div');
					div.innerHTML = res;
					let list =  div.querySelector('#s-box');
                    const placeholder = list.getAttribute('placeholder');
                    placeholder ? resolve(placeholder) : reject('请输入书名或作者名')
                })
            })
        },
        getBookInfo(link) {
            return new Promise((resolve, reject) => {
                axios.get(`/bookqd/${link}`).then(res => {
                    let div = document.createElement('div');
					div.innerHTML = res;
                })
            })
        }
}