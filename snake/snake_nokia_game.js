// ตัวอย่างโค้ดเกม Snack Nokia อย่างง่ายด้วย JavaScript
// สร้าง Canvas และการตั้งค่าพื้นฐาน
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
canvas.style.border = "6px solid #FFD700"; // ปรับกรอบสีเหลืองทอง
canvas.style.display = "block";
canvas.style.margin = "0 auto";
document.body.appendChild(canvas);

// การตั้งค่าเกม
let snake = [{x: 200, y: 200}];
let direction = {x: 0, y: 0};
let food = {x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20};
let currentIcon = "💰";
const gridSize = 20;
let gameOver = false;
let score = 0;
let gameStarted = false;

// รายการไอคอน
const icons = ["💰", "❤️", "⭐", "💵", "🍔", "🎄", "🎁"];

// รายการสีอาหาร
const foodColors = ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#FFFF00']; // สีแดง น้ำเงิน เขียว ม่วง เหลือง

// โหลดเสียง
const moveSound = new Audio('move.mp3');
const eatSound = new Audio('eat.mp3');

// แบนเนอร์Score
const scoreBanner = document.createElement('div');
scoreBanner.style.textAlign = "center";
scoreBanner.style.fontSize = "24px";
scoreBanner.style.fontFamily = "Arial, sans-serif";
scoreBanner.style.marginBottom = "10px";
scoreBanner.style.color = "black";
scoreBanner.innerText = `SCORE: ${score}`;
document.body.insertBefore(scoreBanner, canvas);

// วาดไอคอนอาหาร
function drawFood() {
  ctx.fillStyle = foodColors[Math.floor(Math.random() * foodColors.length)];
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// วาดเกมบน Canvas
function draw() {
  if (gameOver) {
    alert(`Game Over! คะแนนของคุณคือ: ${score}`);
    return;
  }

  // ล้างหน้าจอและตั้งสีแบคกราวด์
  ctx.fillStyle = canvas.style.backgroundColor || '#FFFFFF'; // เปลี่ยนเป็นพื้นหลังสีขาว
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // อัพเดตแบนเนอร์คะแนน
  scoreBanner.innerText = `SCORE: ${score}`;

  // วาดอาหาร
  drawFood();

  // วาดงู
  ctx.fillStyle = '#FFA500'; // สีส้ม
  snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));
}

// อัพเดตตำแหน่งงู
function update() {
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  // ตรวจสอบการชนขอบและตัวเอง
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver = false;
    return;
  }

  snake.unshift(head);
  moveSound.play();

  // ตรวจสอบการกินอาหาร
  if (head.x === food.x && head.y === food.y) {
    // เปลี่ยนสีพื้นหลังแบบสุ่ม
    let randomColor;
    do {
      randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    } while (randomColor.toLowerCase() === '#ffa500'); // หลีกเลี่ยงสีส้ม

    canvas.style.backgroundColor = randomColor;
    food = {x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20};
    currentIcon = icons[Math.floor(Math.random() * icons.length)];
    score += 10;
    eatSound.play();
  } else {
    snake.pop();
  }
}

// การควบคุมเกม
window.addEventListener('keydown', (e) => {
  if (!gameStarted) return;
  switch (e.key) {
    case 'ArrowUp': if (direction.y === 0) direction = {x: 0, y: -gridSize}; break;
    case 'ArrowDown': if (direction.y === 0) direction = {x: 0, y: gridSize}; break;
    case 'ArrowLeft': if (direction.x === 0) direction = {x: -gridSize, y: 0}; break;
    case 'ArrowRight': if (direction.x === 0) direction = {x: gridSize, y: 0}; break;
  }
});

// สร้างปุ่มเริ่มเกม
const startButton = document.createElement('button');
startButton.textContent = "START";
startButton.style.padding = "15px 30px";
startButton.style.fontSize = "20px";
startButton.style.backgroundColor = "#f4a261";
startButton.style.color = "#fff";
startButton.style.border = "2px solid #e76f51";
startButton.style.borderRadius = "8px";
startButton.style.cursor = "pointer";
startButton.style.position = "absolute";
startButton.style.left = "50%";
startButton.style.top = "50%";
startButton.style.transform = "translate(-50%, -50%)";
document.body.appendChild(startButton);

startButton.addEventListener('mouseover', () => {
  startButton.style.backgroundColor = "#e76f51";
});

startButton.addEventListener('mouseout', () => {
  startButton.style.backgroundColor = "#f4a261";
});

startButton.addEventListener('click', () => {
  if (!gameStarted) {
    gameStarted = true;
    startButton.style.display = "none";
    gameLoop();
  }
});

// เรียกใช้เกม
function gameLoop() {
  update();
  draw();
  if (!gameOver) setTimeout(gameLoop, 100);
}
