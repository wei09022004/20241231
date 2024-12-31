let sprites = {
  // 第一個角色的精靈圖
  player1: {
    run: {
      img: null,
      width: 141,
      height: 115,
      frames: 6
    },
    firefeet: {
      img: null,
      width: 146,
      height: 143,
      frames: 9
    },
    kick: {
      img: null,
      width: 163,
      height: 163,
      frames: 9
    }
  },
  // 第二個角色的精靈圖
  player2: {
    run2: {
      img: null,
      width: 155,
      height: 127,
      frames: 6
    },
    good: {
      img: null,
      width: 187,
      height: 205,
      frames: 10
    },
    swing: {
      img: null,
      width: 217,
      height: 207,
      frames: 10
    }
  },
  boom: {  //爆炸圖
    img: null,
    width: 1,
    height: 12,
    frames: 21
  },
  bubu: {  //發射子彈
    img: null,
    width: 74,
    height: 52,
    frames: 22
  }
};

let player1 = {
  x: 100,
  y: 200,
  speedX: 5,
  speedY: 0,
  gravity: 0.8,
  jumpForce: -15,
  isJumping: false,
  groundY: 300,
  currentFrame: 0,
  currentAction: 'run',
  direction: 1,
  bullets: [],
  health: 5, // 生命值
  maxHealth: 5  // 最大生命值（5顆心）
};

let player2 = {
  x: 800,
  y: 200,
  speedX: 5,
  speedY: 0,
  gravity: 0.8,
  jumpForce: -15,
  isJumping: false,
  groundY: 300,
  currentFrame: 0,
  currentAction: 'run2',
  direction: -1,
  bullets: [],
  health: 5, // 生命值
  maxHealth: 5  // 最大生命值（5顆心）
};

let backgroundImg;
let heartImg;

function preload() {
  // 載入背景圖片
  backgroundImg = loadImage('背景圖.jfif');  // 請確保你有 background.png 檔案
  heartImg = loadImage('heart.webp');  // 請確保你有 heart.png 檔案
  
  // 確保正確載入兩個角色的所有動作圖片
  sprites.player1.run.img = loadImage('run.png');
  sprites.player1.firefeet.img = loadImage('firefeet.png');
  sprites.player1.kick.img = loadImage('kick.png');
  
  // 確保 player2 的圖片路徑正確
  sprites.player2.run2.img = loadImage('run2.png');
  sprites.player2.swing.img = loadImage('swing.png');
  sprites.player2.good.img = loadImage('good.png');
  
  sprites.boom.img = loadImage('boom.png');
  sprites.bubu.img = loadImage('bubu.png');
}

function setup() {
createCanvas(windowWidth, windowHeight);
frameRate(15); // 設定動畫速度
}

function draw() {
  // 繪製背景
  image(backgroundImg, 0, 0, width, height);
  
  // 更新兩個角色的物理
  updatePhysics(player1);
  updatePhysics(player2);
  
  // 更新和繪製子彈
  updateBullets(player1);
  updateBullets(player2);
  
  // 確保兩個角色都被繪製
  drawCharacter(player1, sprites.player1);
  drawCharacter(player2, sprites.player2);
  
  // 繪製生命值
  drawHealth(player1, 10, 10);  // 玩家1的生命值在左上角
  drawHealth(player2, width - 150, 10);  // 玩家2的生命值在右上角
  
  // 繪製地面參考線
  stroke(0);
  line(0, player1.groundY + sprites.player1[player1.currentAction].height, 
       width, player1.groundY + sprites.player1[player1.currentAction].height);
  
  checkKeys();
  
  // 修改 TKUET 為教育科技
  textSize(50);
  textAlign(CENTER);
  fill(255);  // 白色文字
  stroke(0);  // 黑色邊框
  strokeWeight(2);
  text("教育科技", width/2, height - 30);  // 在底部置中顯示
  strokeWeight(1);  // 重設線條寬度
  
  // 在左下角添加操作說明
  drawControls();
  
  checkGameOver();
}

function updatePhysics(character) {
// 應用重力
if (character.y < character.groundY) {
  character.speedY += character.gravity;
  character.isJumping = true;
}

// 更新垂直位置
character.y += character.speedY;

// 檢查是否著地
if (character.y >= character.groundY) {
  character.y = character.groundY;
  character.speedY = 0;
  character.isJumping = false;
}
}

function drawCharacter(player, spriteSet) {
  // 確保精靈圖存在
  let currentSprite = spriteSet[player.currentAction];
  if (!currentSprite || !currentSprite.img) {
    console.log('Sprite not loaded:', player.currentAction);
    return;
  }
  
  // 更新當前幀
  player.currentFrame = (player.currentFrame + 1) % currentSprite.frames;
  
  // 計算精靈圖的位置
  let sx = player.currentFrame * currentSprite.width;
  
  push();
  if (player.direction === -1) {
    translate(player.x + currentSprite.width, player.y);
    scale(-1, 1);
  } else {
    translate(player.x, player.y);
  }
  
  // 繪製精靈圖
  image(currentSprite.img, 
    0, 0,
    currentSprite.width, currentSprite.height,
    sx, 0,
    currentSprite.width, currentSprite.height
  );
  pop();
}

function checkKeys() {
  // 玩家一的控制 (方向鍵)
  if (keyIsDown(RIGHT_ARROW)) {
    player1.x += player1.speedX;
    player1.currentAction = 'kick';
    player1.direction = 1;
  } else if (keyIsDown(LEFT_ARROW)) {
    player1.x -= player1.speedX;
    player1.currentAction = 'kick';
    player1.direction = -1;
  } else {
    player1.currentAction = 'kick';
  }

  // 玩家一跳躍控制 (上方向鍵或空白鍵)
  if ((keyIsDown(UP_ARROW) || keyIsDown(32)) && !player1.isJumping) {
    player1.speedY = player1.jumpForce;
    player1.currentAction = 'firefeet';
    player1.isJumping = true;
  }

  // 玩家二的控制 (WASD)
  if (keyIsDown(68)) { // D鍵
    player2.x += player2.speedX;
    player2.currentAction = 'run2';
    player2.direction = 1;
  } else if (keyIsDown(65)) { // A鍵
    player2.x -= player2.speedX;
    player2.currentAction = 'run2';
    player2.direction = -1;
  } else {
    player2.currentAction = 'run2';
  }

  // 玩家二跳躍控制 (W鍵)
  if (keyIsDown(87) && !player2.isJumping) { // W鍵
    player2.speedY = player2.jumpForce;
    player2.currentAction = 'swing';
    player2.isJumping = true;
  }

  // 如果正在跳躍中，保持跳躍動作
  if (player1.isJumping) {
    player1.currentAction = 'firefeet';
  }
  if (player2.isJumping) {
    player2.currentAction = 'good';
  }

  // 添加發射子彈的控制
  // 玩家一用 ENTER 鍵發射
  if (keyIsDown(ENTER)) {
    shoot(player1);
  }
  
  // 玩家二用 SHIFT 鍵發射
  if (keyIsDown(SHIFT)) {
    shoot(player2);
  }
}

// 添加發射子彈函數
function shoot(player) {
  if (player.bullets.length < 3) {
    let playerSprite = sprites[player === player1 ? 'player1' : 'player2'];
    let playerWidth = playerSprite[player === player1 ? 'run' : 'run2'].width;
    
    let bullet = {
      x: player.x + (player.direction === 1 ? playerWidth : 0),
      y: player.y + playerWidth/2,
      speed: 10 * player.direction,
      isExploding: false,
      currentFrame: 0,
      explosionFrame: 0
    };
    
    player.bullets.push(bullet);
    player.currentAction = 'bubu';
    
    setTimeout(() => {
      if (!player.isJumping && player.currentAction === 'bubu') {
        player.currentAction = 'run';
      }
    }, 500);
  }
}

// 添加子彈更新和繪製函數
function updateBullets(player) {
  let otherPlayer = player === player1 ? player2 : player1;
  
  for (let i = player.bullets.length - 1; i >= 0; i--) {
    let bullet = player.bullets[i];
    
    if (bullet.isExploding) {
      // 繪製爆炸動畫
      image(sprites.boom.img,
        bullet.x - sprites.boom.width/2,
        bullet.y - sprites.boom.height/2,
        sprites.boom.width,
        sprites.boom.height,
        bullet.explosionFrame * sprites.boom.width,
        0,
        sprites.boom.width,
        sprites.boom.height
      );
      
      bullet.explosionFrame++;
      if (bullet.explosionFrame >= sprites.boom.frames) {
        player.bullets.splice(i, 1);
      }
    } else {
      // 更新子彈位置
      bullet.x += bullet.speed;
      
      // 檢查子彈是否擊中對手
      if (checkBulletHit(bullet, otherPlayer)) {
        bullet.isExploding = true;
        bullet.explosionFrame = 0;
        bullet.x = otherPlayer.x + sprites[otherPlayer === player1 ? 'player1' : 'player2'][otherPlayer.currentAction].width/2;
        bullet.y = otherPlayer.y + sprites[otherPlayer === player1 ? 'player1' : 'player2'][otherPlayer.currentAction].height/2;
        otherPlayer.health = Math.max(0, otherPlayer.health - 1);
        continue;
      }
      
      // 繪製子彈
      image(sprites.bubu.img,
        bullet.x, bullet.y,
        sprites.bubu.width, sprites.bubu.height,
        bullet.currentFrame * sprites.bubu.width, 0,
        sprites.bubu.width, sprites.bubu.height
      );
      
      bullet.currentFrame = (bullet.currentFrame + 1) % sprites.bubu.frames;
      
      // 檢查是否超出畫面
      if (bullet.x < 0 || bullet.x > width) {
        player.bullets.splice(i, 1);
      }
    }
  }
}

// 更新碰撞檢測函數，使其更精確
function checkBulletHit(bullet, player) {
  let playerSprite = sprites[player === player1 ? 'player1' : 'player2'][player.currentAction];
  
  // 縮小碰撞箱以使碰撞更精確
  let bulletBox = {
    x: bullet.x + sprites.bubu.width * 0.25,
    y: bullet.y + sprites.bubu.height * 0.25,
    width: sprites.bubu.width * 0.5,
    height: sprites.bubu.height * 0.5
  };
  
  let playerBox = {
    x: player.x + playerSprite.width * 0.25,
    y: player.y + playerSprite.height * 0.25,
    width: playerSprite.width * 0.5,
    height: playerSprite.height * 0.5
  };
  
  return bulletBox.x < playerBox.x + playerBox.width &&
         bulletBox.x + bulletBox.width > playerBox.x &&
         bulletBox.y < playerBox.y + playerBox.height &&
         bulletBox.y + bulletBox.height > playerBox.y;
} 

// 添加繪製生命值的函數
function drawHealth(player, x, y) {
  for (let i = 0; i < player.maxHealth; i++) {
    if (i < player.health) {
      // 繪製完整的心
      tint(255, 255, 255);
    } else {
      // 繪製空心（灰色）
      tint(128, 128, 128);
    }
    image(heartImg, x + i * 30, y, 25, 25);
  }
  noTint();
}

// 添加遊戲結束檢查
function checkGameOver() {
  if (player1.health <= 0 || player2.health <= 0) {
    textSize(50);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    if (player1.health <= 0) {
      text("Player 2 Wins!", width/2, height/2);
    } else {
      text("Player 1 Wins!", width/2, height/2);
    }
    noLoop(); // 停止遊戲
  }
}

// 添加新函數來繪製操作說明
function drawControls() {
  textSize(16);
  textAlign(LEFT);
  fill(255);  // 白色文字
  stroke(0);  // 黑色邊框
  strokeWeight(1);
  
  let x = 10;
  let y = height - 120;
  let lineHeight = 20;
  
  text("玩家1控制：", x, y);
  text("↑ : 跳躍", x, y + lineHeight);
  text("← → : 移動", x, y + lineHeight * 2);
  text("Enter : 發射", x, y + lineHeight * 3);
  
  text("玩家2控制：", x + 150, y);
  text("W : 跳躍", x + 150, y + lineHeight);
  text("A D : 移動", x + 150, y + lineHeight * 2);
  text("Shift : 發射", x + 150, y + lineHeight * 3);
} 