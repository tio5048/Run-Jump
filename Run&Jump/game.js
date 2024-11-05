var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;


var characterSkins = [
    localStorage.getItem('characterSkin') || 'image/black.png ', // 로컬 스토리지에서 캐릭터 스킨 불러오기
];
var barrierSkins = [
    localStorage.getItem('barrierSkin') || 'image/red.png', // 로컬 스토리지에서 장애물 스킨 불러오기
];

var currentCharacterSkin = 0; // 현재 캐릭터 스킨 인덱스
var currentBarrierSkin = 0; // 현재 장애물 스킨 인덱스

var img1 = new Image();
img1.src = characterSkins[currentCharacterSkin];
var img2 = new Image();
img2.src = barrierSkins[currentBarrierSkin];

var character = {
    x: 50,
    y: 200,
    width: 32,
    height: 32,
    draw() {
        ctx.fillStyle = 'green';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img1, this.x, this.y);
    }
}

class Barrier {
    constructor() {
        this.x = 1000;
        this.y = 200;
        this.width = 32;
        this.height = 32;
    }
    draw() {
        ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img2, this.x, this.y);
    }
}

function changeCharacterSkin() {
    currentCharacterSkin = (currentCharacterSkin + 1) % characterSkins.length; // 다음 스킨 인덱스
    img1.src = characterSkins[currentCharacterSkin]; // 새 스킨 이미지 설정
}

function changeBarrierSkin() {
    currentBarrierSkin = (currentBarrierSkin + 1) % barrierSkins.length; // 다음 스킨 인덱스
    img2.src = barrierSkins[currentBarrierSkin]; // 새 장애물 스킨 이미지 설정
}

var timer = 0; // 게임이 시작한 시간
var barriermany = [];
var jump = false;
var jumptimer = 0;
var animation;
var score = 0; // 점수 초기화
var highscore = parseInt(localStorage.getItem('highscore')) || 0; // 최고 기록을 저장
var scoreTimer = 0; // 점수 증가를 위한 타이머
var coin = parseInt(localStorage.getItem('coin')) || 0; // 코인 = 누적 스코어로 계산
var speed = 2; //시작 스피드
var barrierspawn = 240; // 장애물 소환 주기

function frameAnimation() {
    animation = requestAnimationFrame(frameAnimation);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 일정 시간마다 점수, 코인 증가
    if (timer % 100 === 0) { // 100 프레임마다 점수 증가
        score++;
        coin++;
        localStorage.setItem('score', score); // 점수 저장
        localStorage.setItem('coin', coin); // 코인 저장
    }

    // 일정 스코어 이상갈 시 속도 증가
    if (timer % 1500 === 0 && score > 0) {
        speed += 1
    }

    // 장애물 생성 속도
    if (timer % 1000 === 0 && score > 0) {
    barrierspawn = Math.max(150, barrierspawn - Math.floor(score / 5)); // 최소 소환 간격 설정
    }

    if (timer % barrierspawn === 0) {
        var newbarrier = new Barrier(); 
        barriermany.push(newbarrier);
    }

    barriermany.forEach((a, i, o) => { //장애물의 이동속도
        if (a.x < 0) {
            o.splice(i, 1);
        }
        a.x -= speed; //숫자가 높을수록 장애물의 이동 속도 증가
        clash(character, a);
        a.draw();
    })

    if (jump) { // 점프가 켜져 있으면
        character.y -= 3; // 캐릭터의 y좌표를 이동하여 점프함
        jumptimer++; // jumptimer의 숫자를 높임
    
        if (jumptimer > 40) { // 점프 높이에 따라 값을 조정
            jump = false; // 점프가 끝남
        }
    } else { // jump가 꺼져 있으면
        if (character.y < 200) { // character의 높이가 200의 아래가 된다면
            character.y += 1; // character의 높이가 내려감
        }
    }
    
    // 점프를 다시 가능하게 만들기 위해 jump 상태 체크
    if (character.y >= 200) {
        jumptimer = 0; // jumptimer 초기화
    }
    
    character.draw();

    // 점수 표시
    ctx.fillStyle = 'black'; 
    ctx.font = '20px Arial'; 
    ctx.fillText('Score: ' + score, 10, 30); // 점수 표시 (숫자는 좌표)
    ctx.fillText('Coin: ' + coin, 10, 50); // 코인 표시
    ctx.fillText('High Score: ' + highscore, 10, 70); // 최고 점수 표시
    ctx.fillText('Speed ' + speed, 10, 90); // 스피드 표시
}
frameAnimation();

function clash(character, barrier) {
    if (
        character.x < barrier.x + barrier.width &&
        character.x + character.width > barrier.x &&
        character.y < barrier.y + barrier.height &&
        character.y + character.height > barrier.y //가끔 1번씩 충돌이 안되었는데도 충돌되었다고 하여 바꿈
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore); // 최고 점수 저장
        }
        alert("[Game Over]\n점수 : " + score +  "\n최고 점수 : " + highscore);
        resetGame(); // 게임 초기화
    }
}

function resetGame() {
    score = 0;
    speed = 2;
    barriermany = [];
    timer = 0;
    jump = false;
    jumptimer = 0;
    frameAnimation();
}

document.addEventListener('keydown', function(e) { //SpaceBar 클릭하면 캐릭터의 y좌표가 200일떄 jump가 트루
    if (e.code === 'Space' && character.y >= 200) {
        jump = true;
    }
});

//점수 업데이트
document.getElementById('score').textContent = score; // 점수 업데이트
document.getElementById('coin').textContent = coin; // 코인 업데이트
document.getElementById('highscore').textContent = highscore; // 