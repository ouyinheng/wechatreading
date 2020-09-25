import axios from "axios";

export const getDiscover = () => {
    return new Promise((resolve, reject) => {
        console.log('getDiscover')
        let disCoverList = [];
        axios.get('/qd').then(res => {
            let div = document.createElement('div');
            div.innerHTML = res;
            let editRec = div.querySelectorAll('.edit-rec-wrap .slides .slideItem');
            let descriptionList = div.querySelectorAll('.edit-rec-wrap .description .desc-wrap');
            Array.from(editRec).forEach((div, index) => {
                let item = document.createElement('div');
                item.appendChild(div)
                disCoverList.push({
                    title: item.querySelector('a img').getAttribute('title'),
                    cover: item.querySelector('a img').getAttribute('src'),
                    link: item.querySelector('a').getAttribute('href'),
                    desc: descriptionList[index].querySelector('p').innerText
                })
            })
            resolve(disCoverList)
        })
    })
}