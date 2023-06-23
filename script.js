const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const img = new Image();
img.src ='media/floppybird.png';

// general settings
let gamePlaying = false;
const gravity = .5;
const speed = 6.2;
const size = [40, 30];
const jump = -11.5 ;
const cTenth = (canvas.width / 10);

//pipe settings 
const pipeWidth = 58 ;
const pipeGap = 276 ;
const pipeLoc = () => (Math.random()* ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

let index = 0 ,
    bestScore = 0,
    currentScore = 0,
    pipes = [],
    flight,
    flyHeight;


const setup = () => {
    currentScore = 0 ;
    flight = jump;
    flyHeight = (canvas.height / 2)- (size[1] / 2);// hauteur du vol des oiseaux 

    pipes = Array(3).fill().map((a, i) => [canvas.width + (i *( pipeGap + pipeWidth)), 
        pipeLoc()]);
    console.log(pipes);
}      

const render = () => {
      index++;

    // background 
    ctx.drawImage(img,0,0, canvas.width, canvas.height,
        -((index*(speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height); 
    ctx.drawImage(img,0,0, canvas.width, canvas.height,
        -((index*(speed / 2)) % canvas.width), 0, canvas.width, canvas.height); 
    
    // oiseaux
    if (gamePlaying) {
        ctx.drawImage(img, 336,Math.floor((index % 6) / 3) * size[1], ...size,cTenth, flyHeight, ...size)
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height -size[1]);// ca evite pour que l'oiseaux ne descent plus bas infiniment 
    } 
    else{ // cela va changer les trois positions de l'image a chaque fois et couper l'image nessessaire
        ctx.drawImage(img, 336,Math.floor((index % 6) / 3) * size[1], ...size,
        ((canvas.width / 2) - size[0] / 2), flyHeight, ...size );  
        flyHeight= (canvas.height / 2) - (size[1] / 2); 
        //text 
        ctx.fillText(`Meilleur score:${bestScore}` , 55, 245);
        ctx.fillText('Cliquez pour jouer' , 48, 335);
        ctx.font = "bold 20px courier " ; 
    }

        // pipe display
    if (gamePlaying) {
            pipes.map(pipe =>{
                pipe[0] -= speed;
        //top pipe
        ctx.drawImage(img, 336, 455-pipe[1], pipeWidth, pipe[1], pipe[0],0, pipeWidth, pipe[1]);
        //botom pipe 
        ctx.drawImage(img, 339+ pipeWidth, 88, pipeWidth, canvas.height - pipe[1] +
            pipeGap, pipe[0], pipe[1]+ pipeGap, pipeWidth, canvas.height-pipe[1] + 
            pipeGap);

        if (pipe[0] <= -pipeWidth) {
            currentScore++;
            bestScore = Math.max(bestScore, currentScore);

            //remove pipe + create new one 
            pipes = [...pipes.slice(1), [pipes[pipes.length-1][0]+pipeGap+ pipeWidth,
            pipeLoc()]];
        }
        if([
            pipe[0] <= cTenth +size[0],
            pipe[0] + pipeWidth >= cTenth,
            pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]

        ].every(elem => elem)){
            gamePlaying = false;
            setup();
        }
        
        })


    }
    
    document.getElementById('bestScore').innerHTML = `Meilleur :${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Actuel :${currentScore}`;
    window.requestAnimationFrame(render);

    }
setup();
img.onload = render; // qui lance la fonction render 
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () =>flight = jump;  