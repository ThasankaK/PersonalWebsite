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
    line.classList.add('glowing-line');
    // setting line size explicitly, ran into an issue of different line sizes
    line.style.width = '1px'; 
    line.style.height = '10vh'; 
    
    // line will start randomly
    const randomPos = Math.random() * 100;
    line.style.left = `${randomPos}%`;

    // start the animation at different times
    const randomDelay = Math.random() * 10; // 0 to 10 seconds
    line.style.setProperty('--delay', `${randomDelay}s`);

    // add line to html
    document.getElementById('app').appendChild(line);

    // lines start above viewport
    line.style.transform = 'translateY(-100vh)'; 


}


for (let i = 0; i < numberOfLines; i++) {
    createLine();
}