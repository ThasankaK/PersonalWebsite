new Vue({
    el: '#app',
    data: {
        name: 'Thasanka Kandage',
        email: 'thasanka.kandage@gmail.com',
        instagramUrl: 'https://www.instagram.com/thasanka_k/',
        githubUrl: 'https://github.com/ThasankaK',
        linkedinUrl: 'https://www.linkedin.com/in/thasanka-kandage-489534236/',
        kaggleUrl: 'https://www.kaggle.com/thasankakandage',
        projects: [
            {
                name: 'UFC Fight Predictor',
                link: 'https://www.kaggle.com/code/thasankakandage/ufc-fight-predictor',
                image: 'images/volk_cold.png'
            },
            {
                name: 'Twitter Clone',
                link: 'https://github.com/ThasankaK/Social-Media-Clone',
                image: 'images/twitter.png'
            },
            {
                name: 'AI Sudoku Solver',
                link: 'https://www.kaggle.com/code/thasankakandage/computer-vision-sudoku-solver',
                image: 'images/sudokusolver.png'
            }
        ]
    }
});

const numberOfLines = 15;

function createLine() {
    // create a new line element
    const line = document.createElement('div');
    line.classList.add('vertical-line');

    
    // line will start randomly
    const randomPos = Math.random() * 100;
    line.style.left = `${randomPos}%`;

    // start the animation at different times
    const randomDelay = Math.random() * 10; // 0 to 10 seconds
    line.style.setProperty('--delay', `${randomDelay}s`);

    // adding line to html
    document.getElementById('app').appendChild(line);

    // lines start above viewport
    line.style.transform = 'translateY(-200vh)'; 



}


for (let i = 0; i < numberOfLines; i++) {
    createLine();
}
// adding bottom horizontal line
const horizontalLine = document.createElement('div');
horizontalLine.classList.add('horizontal-line');
document.getElementById('app').appendChild(horizontalLine);



document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const socialLinks = document.querySelector('.social-links');

    // ensuring social links are visible initially
    socialLinks.classList.remove('hidden');
    toggleBtn.querySelector('i').classList.replace('lni-angle-double-left', 'lni-angle-double-right');

    toggleBtn.addEventListener('click', () => {
        // toggling 'hidden' class to show/hide social links
        socialLinks.classList.toggle('hidden');
    

        // Update the icon based on the state
        if (socialLinks.classList.contains('hidden')) {

            // will add rotating after instead of diff images
            toggleBtn.querySelector('i').classList.replace('lni-angle-double-right', 'lni-angle-double-left');
            // moving to left
            toggleBtn.classList.add('left');
        } else {
            toggleBtn.querySelector('i').classList.replace('lni-angle-double-left', 'lni-angle-double-right');
            // moving back to og position
            toggleBtn.classList.remove('left');
        }
    });
});


