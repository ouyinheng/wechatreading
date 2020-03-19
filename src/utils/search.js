export default {
    parseHtml(html) {
        let div = document.createElement('div');
        div.innerHTML = html;
        let list =  div.querySelectorAll('.result-item.result-game-item');
        let booklist = []
        Array.from(list).forEach(div => {
            let item = document.createElement('div');
            item.appendChild(div)
            let info = {
                picUrl: item.querySelector('.result-game-item-pic img').getAttribute('src'),
                title: item.querySelector('.result-game-item-detail .result-item-title.result-game-item-title').innerText.trim(),
                desc: item.querySelector('.result-game-item-detail .result-game-item-desc').innerText.trim(),
            };
            booklist.push(info)
        })
        return booklist;
    }
}