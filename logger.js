module.exports = {
    error(id, message) {
        let spaces = '';
        for (let i=0; i<id; i++) {
            spaces += '    ';
        }
        console.error(spaces + message);
    },

    log(id, message) {
        let spaces = '';
        for (let i=0; i<id; i++) {
            spaces += '  ';
        }
        console.log(spaces + message);
    }
}