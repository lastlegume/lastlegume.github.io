section = document.getElementById('main_content');
bar = document.getElementsByClassName('progressBar')[0];
minimum = section.getBoundingClientRect().top;
if(section.getBoundingClientRect().top<200)
    minimum = 200;
window.addEventListener('scroll', scrollProgressBar);

function scrollProgressBar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    bar.style.width = scrolled + "%";
    

}