import Vue from 'vue'


Vue.filter('sizeFormat', (value) => {
    if (value < 1000) {
        return `${value}B`
    }else if (value < 1000*1000) {
        return `${(value/1000).toFixed(2)}KB`
    }else {
        return `${(value/1000/1000).toFixed(2)}MB`
    }
})