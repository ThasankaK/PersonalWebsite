new Vue({
    el: '#app',
    data: {
        name: 'Thasanka Kandage',
        email: 'thasanka.kandage@gmail.com',
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

// moving linear gradient of turquoise, pink, yellow
document.addEventListener('mousemove', (e) => {
  
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // cursor position out of total space in % 
    const x = e.clientX / width * 100;
    const y = e.clientY / height * 100;
    
    // gradient background based on cursor position
    document.body.style.background = `linear-gradient(135deg, #1abc9c, #ff007f, #f5a623)`;
    document.body.style.backgroundPosition = `${x}% ${y}%`;
    document.body.style.backgroundSize = '200% 200%';
});


