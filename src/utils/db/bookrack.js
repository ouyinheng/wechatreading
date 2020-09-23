export default {
    insertBook(data) {
        var db = openDatabase('bookLibraryDB', '1.0', 'Test DB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS BOOKRACK (id unique, bookName, link, cover, newCharpter, author)');
            tx.executeSql('INSERT INTO BOOKRACK (id, bookName, link, cover, newCharpter, author) VALUES (?, ?, ?, ?, ?, ?)', [data.id, data.bookName, data.link, data.cover, data.newCharpter, data.author]);
        });
    },
    queryBook(callback) {
        var db = openDatabase('bookLibraryDB', '1.0', 'Test DB', 2 * 1024 * 1024);
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM BOOKRACK', [], (tx, results) => {
                callback(results.rows);                
            }, null);
        });
    },
    queryBookInfo(id, callback) {
        var db = openDatabase('bookLibraryDB', '1.0', 'Test DB', 2 * 1024 * 1024);
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM BOOKRACK where id = ?', [id], (tx, results) => {
                callback(results.rows);                
            }, null);
        });
    },
    updateBookInfo(id, newCharpter, callback) {
        var db = openDatabase('bookLibraryDB', '1.0', 'Test DB', 2 * 1024 * 1024);
        var updateDataSQL = 'UPDATE BOOKRACK SET newCharpter = ? WHERE id = ?';
        db.transaction((tx) => {
            tx.executeSql(updateDataSQL, [newCharpter, id], (tx, results) => {
                callback(results.rows);                
            }, null);
        });
    },
    deleteBook(id, callback) {
        var db = openDatabase('bookLibraryDB', '1.0', 'Test DB', 2 * 1024 * 1024);
        var updateDataSQL = 'DELETE FROM BOOKRACK WHERE id = ?';
        db.transaction((tx) => {
            tx.executeSql(updateDataSQL, [id], (tx, results) => {
                callback(results.rows);                
            }, null);
        });
    }
}