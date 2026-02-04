const menurozw = document.getElementById('menurozw');
const mobilemenu = document.getElementById('mobilemenu');
const mobilemenulinks = document.querySelectorAll('.mobile-odnosniki a');

menurozw.addEventListener('click', () => {
    menurozw.classList.toggle('active');
    mobilemenu.classList.toggle('active');
});

mobilemenulinks.forEach(x => {
    x.addEventListener('click', () => {
        menurozw.classList.remove('active');
        mobilemenu.classList.remove('active');
    });
});