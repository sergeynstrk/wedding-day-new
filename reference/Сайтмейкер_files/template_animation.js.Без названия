// if(typeof body == 'undefined') {
// console.log(typeof body)
// console.log(body)
// if (!body) {
const bodyAnimation = document.body;
// }
function checkVisibilityEr(element, callback, offset = 0) {

    const rect = element.getBoundingClientRect();
    const isVisible = (     rect.top <= (window.innerHeight + offset) &&         rect.bottom >= (0 - offset))
    if (isVisible) callback();
}

var isThrottleder = false;
$(function(){
    setTimeout(function(){
        var checkIntro = setInterval(function(){
            if(!$(bodyAnimation).hasClass('opener-active')) {
                handleScroller()
                clearInterval(checkIntro);
            }
        }, 500)
    },2000);
})
window.addEventListener('scroll',  () => {if (!isThrottleder) {
    handleScroller();
    isThrottleder = true;
    setTimeout(() => { isThrottleder = false; }, 100);
}})
// window.addEventListener('load',  () => {if (!isThrottleder) {
//     handleScroller();
//     isThrottleder = true;
//     setTimeout(() => { isThrottleder = false; }, 100);
// }})
window.addEventListener('resize', () => { if (!isThrottleder) {
    handleScroller();
    isThrottleder = true;
    setTimeout(() => { isThrottleder = false; }, 100);
}})
function handleScroller() {
    if(!$(bodyAnimation).hasClass('opener-active')) {
        document.querySelectorAll('.item-animation').forEach(el => {
            checkVisibilityEr(el, () => {
                el.classList.add('item-active');
            });
        });
    }
}
