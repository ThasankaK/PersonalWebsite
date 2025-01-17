new Vue({
    el: "#app",
    data: {
        name: "Thasanka Kandage",
        email: "thasanka.kandage@gmail.com",
        instagramUrl: "https://www.instagram.com/thasanka_k/",
        githubUrl: "https://github.com/ThasankaK",
        linkedinUrl: "https://www.linkedin.com/in/thasanka-kandage-489534236/",
        kaggleUrl: "https://www.kaggle.com/thasankakandage",
        resumeUrl: "assets/ThasankaKandage_Resume.pdf",
        aboutMe: "Hey! My name is Thasanka Kandage, a Software Engineering student at the University of Alberta. I am extremely passionate \
        about all things Machine Learning, Computer Vision, Data Science, and more! <br> <br> Previously, I worked as a Machine Learning Engineer intern, \
        developing object detection models using CNN and ViT models, and I am currently a Undergrad Research Assistant focusing on renewable energy systems using evolutionary algorithms \
        to optimize the performance of liquid solar thermal receivers. I also contribute \
        to the RoboMaster club at my university, working on projects like auto-aiming and tracking, and I’m hoping to find the time to learn SLAM. ",
           projects: [
            {
                name: "UFC Fight Predictor and Dataset",
                link: "https://www.kaggle.com/code/thasankakandage/ufc-fight-predictor",
            
            },
            {
                name: "NBA Game Prediction Models",
                link: "https://www.kaggle.com/code/thasankakandage/nba-game-prediction-model",
            
            },
            {
                name: "Custom Unix Shell",
                link: "https://www.kaggle.com/code/thasankakandage/ufc-fight-predictor",
            
            },
            {
                name: "AI Sudoku Solver",
                link: "https://www.kaggle.com/code/thasankakandage/computer-vision-sudoku-solver",

            },
            {
                name: "Camera Calibration for UARM",
                link: "https://github.com/ThasankaK/Camera-Calibration",

            },

            {
                name: "Twitter Backend Clone",
                link: "https://github.com/ThasankaK/Social-Media-Clone",
    
            }
        ]
    },
    mounted() {
        initializeCanvas();
    }
});

function initializeCanvas() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";

    class Particle {
        constructor(x, y, speedY = -4) {
            this.x = x;
            this.y = y;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = speedY;
            this.gravity = 0.2;
            this.size = Math.random() * 1.5 + 0.5;
            this.life = 1;
            this.decay = 0.01;
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(26, 188, 156, ${this.life})`;
            ctx.fill();
        }
    }

    class FallingLine {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -100;
            this.length = Math.random() * 20 + 20;
            this.speed = Math.random() * 0.5 + 2;
            this.width = Math.random() * 1 + 0.2;
            this.particles = [];
            this.splashed = false;
        }

        update() {
            this.y += this.speed;

            if (this.y + this.length >= canvas.height && !this.splashed) {
                this.createSplash();
                this.splashed = true;
            }

            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }

        createSplash() {
            for (let i = 0; i < 6; i++) {
                this.particles.push(new Particle(this.x, canvas.height));
            }
            for (let i = 0; i < 3; i++) {
                this.particles.push(new Particle(this.x, canvas.height, -2));
            }
        }

        draw() {
            if (!this.splashed) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.strokeStyle = "rgba(26, 188, 156, 0.8)";
                ctx.lineWidth = this.width;
                ctx.stroke();
            }

            this.particles.forEach(particle => particle.draw());
        }
    }

    const lines = [];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.01) {
            lines.push(new FallingLine());
        }

        for (let i = lines.length - 1; i >= 0; i--) {
            lines[i].update();
            lines[i].draw();
            
            if (lines[i].splashed && lines[i].particles.length === 0) {
                lines.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle-button");
    const socialLinks = document.querySelector(".social-links");

    socialLinks.classList.remove("hidden");
    toggleButton.querySelector("i").classList.replace("lni-angle-double-left", "lni-angle-double-right");

    toggleButton.addEventListener("click", () => {
        socialLinks.classList.toggle("hidden");
        if (socialLinks.classList.contains("hidden")) {
            toggleButton.querySelector("i").classList.replace("lni-angle-double-right", "lni-angle-double-left");
            toggleButton.classList.add("left");
        } 
        else {
            toggleButton.querySelector("i").classList.replace("lni-angle-double-left", "lni-angle-double-right");
            toggleButton.classList.remove("left");
        }
    });
});


