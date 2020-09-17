import axios from "axios";
export default {
	getCharpter(link) {
		return new Promise((resolve, reject) => {
			axios.get(`/jiutao/${link}`).then((res) => {
                console.log(res);
                let div = document.createElement('div');
                div.innerHTML = res.data;
                let list =  div.querySelectorAll('.read dl');
                let Charpter = [];
				Array.from(list).forEach((div, index) => {
                    if(!index)return;
					let item = document.createElement('div');
					item.appendChild(div)
					let CharpterListNode = item.querySelectorAll('dd')
                    console.log(CharpterListNode)
                    Array.from(CharpterListNode).forEach(node => {
                        let ele = document.createElement('div');
                        ele.appendChild(node)
                        Charpter.push({
                            CharpterName: ele.innerText,
                            link: ele.querySelector('dd a').getAttribute('href'),

                        })
                    })
				})
				resolve(Charpter)
			});
		});
    },
    getContent(link) {
        return new Promise((resolve, reject) => {
			axios.get(`/jiutao/${link}`).then((res) => {
                console.log(res);
                let div = document.createElement('div');
                div.innerHTML = res.data;
                let content =  div.querySelector('#content').innerHTML;
				resolve(content)

                // let Charpter = [];
				// Array.from(list).forEach((div, index) => {
                //     if(!index)return;
				// 	let item = document.createElement('div');
				// 	item.appendChild(div)
				// 	let CharpterListNode = item.querySelectorAll('dd')
                //     console.log(CharpterListNode)
                //     Array.from(CharpterListNode).forEach(node => {
                //         let ele = document.createElement('div');
                //         ele.appendChild(node)
                //         Charpter.push({
                //             CharpterName: ele.innerText,
                //             link: ele.querySelector('dd a').getAttribute('href'),

                //         })
                //     })
				// })
				// resolve(Charpter)
			});
		});
    }
};
