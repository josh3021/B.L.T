module.exports = () => {
    var min = 100000, max = 999999;

    function makeHash(){
        setTimeout(function(min, max) {
            return (Math.random() * (max - min) + min).toFixed(0);
        }, 10000);
    }
}