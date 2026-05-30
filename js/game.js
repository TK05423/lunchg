const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('gameWrapper');
const cursor = document.getElementById('cursor');

let state, score, lives, combo, comboTimer;
let items, particles, slashTrail;
let spawnTimer, spawnRate;
let mX, mY, pX, pY, infoTimeout;
let nutriPct, wasteCnt, totalCut, localCut, bombHit, animId;
let slicedFoodsHistory = [];
let endReason = '';

function resize() {
  const r = wrapper.getBoundingClientRect();
  canvas.width = r.width;
  canvas.height = r.height;
}
window.addEventListener('resize', resize);
resize();

function startGame() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('quizOverlay').style.display = 'none';
  document.getElementById('infoPanel').style.display = 'none';
  wrapper.style.cursor = 'none';
  cursor.style.display = 'block';
  
  state = 'playing';
  score = 0;
  lives = 3;
  combo = 1;
  comboTimer = 0;
  items = [];
  particles = [];
  slashTrail = [];
  spawnTimer = 0;
  spawnRate = 85;
  mX = 0;
  mY = 0;
  pX = 0;
  pY = 0;
  nutriPct = 0;
  wasteCnt = 0;
  totalCut = 0;
  localCut = 0;
  bombHit = 0;
  slicedFoodsHistory = [];
  
  updateHUD();
  if (animId) cancelAnimationFrame(animId);
  loop();
}

function updateHUD() {
  document.getElementById('scoreVal').textContent = score;
  for (let i = 0; i < 3; i++) {
    document.getElementById('h' + i).textContent = i < lives ? '❤️' : '🖤';
  }
  const pct = Math.min(100, Math.round(nutriPct));
  document.getElementById('nutriFill').style.width = pct + '%';
  document.getElementById('nutriPct').textContent = pct + '%';
  const wp = Math.min(100, (wasteCnt / WASTE_LIMIT) * 100);
  document.getElementById('wasteFill').style.width = wp + '%';
  document.getElementById('wasteCount').textContent = wasteCnt + ' / ' + WASTE_LIMIT + ' 份';
}

function showInfo(food, nutriAdd) {
  const extra = nutriAdd > 0 ? '  ＋' + nutriAdd + '% 營養' : '';
  document.getElementById('infoTitle').textContent = food.emoji + ' ' + food.name + extra;
  document.getElementById('infoText').textContent = food.tip;
  document.getElementById('infoPanel').style.display = 'block';
  
  if (nutriAdd > 0) {
    document.getElementById('nutriFood').textContent = food.name + ' +' + nutriAdd + '%';
  }
  clearTimeout(infoTimeout);
  infoTimeout = setTimeout(() => {
    document.getElementById('infoPanel').style.display = 'none';
    document.getElementById('nutriFood').textContent = '';
  }, 3000);
}

function showCombo(c) {
  const el = document.getElementById('comboDisplay');
  el.style.display = 'block';
  el.style.opacity = 1;
  el.textContent = c >= 3 ? c + '× 連擊！' : '';
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.style.opacity = 0;
    setTimeout(() => el.style.display = 'none', 300);
  }, 700);
}

function flash(color, bg) {
  const f = document.getElementById('flashOverlay');
  f.style.borderColor = color || 'transparent';
  f.style.background = bg || 'transparent';
  setTimeout(() => {
    f.style.borderColor = 'transparent';
    f.style.background = 'transparent';
  }, 220);
}

function spawnItem() {
  const W = canvas.width, H = canvas.height;
  const x = 60 + Math.random() * (W - 120);
  const r = Math.random();
  let type;
  
  if (r < 0.10) {
    type = { emoji: '💣', name: '炸彈', isBomb: true, color: '#333' };
  } else if (r < 0.25) {
    type = { ...WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)], isWaste: true, color: '#666' };
  } else {
    type = { ...FOODS[Math.floor(Math.random() * FOODS.length)] };
  }
  
  items.push({
    x,
    y: H + 40,
    vx: (Math.random() - .5) * 2.5,
    vy: -(7 + Math.random() * 5),
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - .5) * .1,
    size: 44 + Math.random() * 16,
    ...type,
    cut: false,
    age: 0
  });
}

function cutItem(item) {
  if (item.cut) return;
  item.cut = true;
  totalCut++;
  
  if (item.isBomb) {
    bombHit++;
    lives = Math.max(0, lives - 1);
    combo = 1;
    flash('#f00', 'rgba(200,0,0,.08)');
    for (let i = 0; i < 12; i++) {
      spawnP(item.x, item.y, '#ff4400', '💥');
    }
  } else if (item.isWaste) {
    wasteCnt++;
    flash('#888', 'rgba(100,100,100,.07)');
    for (let i = 0; i < 7; i++) {
      spawnP(item.x, item.y, '#aaa', '⚠️');
    }
    showInfo(item, 0);
  } else {
    const pts = item.pts * combo;
    score += pts;
    nutriPct = Math.min(NUTRI_MAX, nutriPct + item.nutri);
    comboTimer = 65;
    combo++;
    if (item.local) localCut++;
    for (let i = 0; i < 8; i++) {
      spawnP(item.x, item.y, item.color, (item.local ? '🌱' : '') + '+' + pts);
    }
    showInfo(item, item.nutri);
    if (combo >= 3) showCombo(combo - 1);
    slicedFoodsHistory.push(item);
  }
  
  updateHUD();
  if (lives <= 0) {
    endGame('bomb');
    return;
  }
  if (wasteCnt >= WASTE_LIMIT) {
    endGame('waste');
    return;
  }
  if (nutriPct >= NUTRI_MAX) {
    endGame('clear');
    return;
  }
}

function spawnP(x, y, color, text) {
  particles.push({
    x,
    y,
    vx: (Math.random() - .5) * 5,
    vy: -(Math.random() * 4 + 1),
    life: 1,
    color,
    text,
    size: Math.random() * 5 + 4
  });
}

function checkSlash(item) {
  if (item.cut) return;
  const dx = mX - pX, dy = mY - pY;
  if (Math.sqrt(dx * dx + dy * dy) < 5) return;
  const A = item.x - pX, B = item.y - pY, C = dx, D = dy;
  const dot = A * C + B * D, len = C * C + D * D;
  const t = Math.max(0, Math.min(1, len ? dot / len : 0));
  const dist = Math.sqrt((item.x - (pX + t * C)) ** 2 + (item.y - (pY + t * D)) ** 2);
  if (dist < item.size * .62) {
    cutItem(item);
  }
}

function drawItem(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rot);
  
  if (item.isBomb) {
    ctx.shadowColor = '#f44';
    ctx.shadowBlur = 14;
  } else if (item.isWaste) {
    ctx.filter = 'grayscale(90%)';
    ctx.globalAlpha = .68;
  } else {
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 10;
    if (item.local) {
      ctx.save();
      ctx.font = '11px serif';
      ctx.shadowBlur = 0;
      ctx.fillText('🌱', item.size * .5, -item.size * .45);
      ctx.restore();
    }
  }
  
  ctx.font = item.size + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(item.emoji, 0, 0);
  ctx.restore();
}

function drawSlash() {
  if (slashTrail.length < 2) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,180,.9)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = '#ffe88a';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(slashTrail[0].x, slashTrail[0].y);
  for (let i = 1; i < slashTrail.length; i++) {
    ctx.globalAlpha = (i / slashTrail.length) * .9;
    ctx.lineTo(slashTrail[i].x, slashTrail[i].y);
  }
  ctx.stroke();
  ctx.restore();
  slashTrail = slashTrail.slice(-14);
}

function loop() {
  if (state !== 'playing') return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0d1a0d';
  ctx.fillRect(0, 0, W, H);
  
  ctx.save();
  ctx.strokeStyle = 'rgba(76,175,80,.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  ctx.restore();

  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0) combo = 1;
  }
  spawnTimer++;
  if (spawnTimer >= spawnRate) {
    spawnTimer = 0;
    spawnItem();
    if (score > 200) spawnRate = Math.max(42, spawnRate - 1);
  }

  items = items.filter(item => {
    if (item.cut) return false;
    item.vy += .18;
    item.x += item.vx;
    item.y += item.vy;
    item.rot += item.rotV;
    item.age++;
    
    if (item.y > H + 90) {
      if (!item.isBomb && !item.isWaste) {
        wasteCnt++;
        spawnP(item.x, H - 10, '#aaa', '🍟 剩食+1');
        updateHUD();
        if (wasteCnt >= WASTE_LIMIT) {
          endGame('waste');
          return false;
        }
      }
      return false;
    }
    
    checkSlash(item);
    drawItem(item);
    return true;
  });

  particles = particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += .1;
    p.life -= .025;
    if (p.life <= 0) return false;
    
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.font = 'bold ' + (p.size + 10) + 'px Noto Sans TC,sans-serif';
    ctx.fillStyle = p.color;
    ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
    return true;
  });

  drawSlash();
  pX = mX;
  pY = mY;
  animId = requestAnimationFrame(loop);
}

// User cursor interaction listeners
wrapper.addEventListener('mousemove', e => {
  const r = wrapper.getBoundingClientRect();
  mX = (e.clientX - r.left) * (canvas.width / r.width);
  mY = (e.clientY - r.top) * (canvas.height / r.height);
  cursor.style.left = (e.clientX - r.left) + 'px';
  cursor.style.top = (e.clientY - r.top) + 'px';
  if (state === 'playing') slashTrail.push({ x: mX, y: mY });
});

wrapper.addEventListener('touchmove', e => {
  e.preventDefault();
  const r = wrapper.getBoundingClientRect(), t = e.touches[0];
  mX = (t.clientX - r.left) * (canvas.width / r.width);
  mY = (t.clientY - r.top) * (canvas.height / r.height);
  cursor.style.left = (t.clientX - r.left) + 'px';
  cursor.style.top = (t.clientY - r.top) + 'px';
  if (state === 'playing') slashTrail.push({ x: mX, y: mY });
}, { passive: false });
