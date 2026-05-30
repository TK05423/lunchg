let quizQuestions = [];
let currentQuestionIndex = 0;
let quizCorrectCount = 0;

function endGame(reason) {
  state = 'idle';
  cancelAnimationFrame(animId);
  endReason = reason;
  
  wrapper.style.cursor = 'auto';
  cursor.style.display = 'none';
  
  const X = slicedFoodsHistory.length;
  const Y = wasteCnt;
  
  const ov = document.getElementById('overlay');
  ov.innerHTML = `
    <h1 style="color:var(--yellow); text-shadow:0 0 20px rgba(255,224,102,0.4); margin-bottom:5px;">🏁 第一階段結束！</h1>
    <p class="subtitle" style="font-size:14px; color:#fff; margin-bottom:10px;">
      你今天收集了 <b style="color:var(--yellow); font-size:18px;">${X}</b> 個健康食材，並製造了 <b style="color:#ff8888; font-size:18px;">${Y}</b> 份剩食。
    </p>
    
    <div class="eco-box" style="width:100%; max-width:380px; text-align:center; background:rgba(76,175,80,0.15); border-color:rgba(76,175,80,0.3); padding:16px; margin:10px 0; border-radius:12px;">
      <span style="font-size:15px; font-weight:700; color:#9f9; display:block; margin-bottom:6px;">🧠 挑戰未完待續！</span>
      接下來進入第二階段：<br>
      <b style="color:var(--yellow); font-size:16px;">「午餐永續大考驗」</b><br>
      解答 5 題食物與剩食小知識，答對一題可獲得 <b style="color:var(--yellow);">100 分</b> 加分！
    </div>
    
    <button class="btn btn-blue" style="margin-top:10px; font-size:17px; background:linear-gradient(135deg,#1976d2,#2196f3); box-shadow:0 4px 20px rgba(33,150,243,0.4);" onclick="startQuizPhase()">開始答題 📝</button>
  `;
  ov.style.display = 'flex';
}

function startQuizPhase() {
  document.getElementById('overlay').style.display = 'none';
  state = 'quiz';
  wrapper.style.cursor = 'auto';
  cursor.style.display = 'none';
  
  quizQuestions = generateQuestions();
  currentQuestionIndex = 0;
  quizCorrectCount = 0;
  
  document.getElementById('quizOverlay').style.display = 'flex';
  showQuestion(0);
}

function generateQuestions() {
  const selected = [];
  const uniqueSliced = Array.from(new Set(slicedFoodsHistory.map(f => f.name)));
  const shuffledSliced = [...uniqueSliced].sort(() => Math.random() - 0.5);
  
  const foodNamesToUse = [];
  for (let i = 0; i < Math.min(3, shuffledSliced.length); i++) {
    foodNamesToUse.push(shuffledSliced[i]);
  }
  
  if (foodNamesToUse.length < 3) {
    const remainingFoods = FOODS.map(f => f.name).filter(name => !foodNamesToUse.includes(name));
    const shuffledRemaining = remainingFoods.sort(() => Math.random() - 0.5);
    while (foodNamesToUse.length < 3 && shuffledRemaining.length > 0) {
      foodNamesToUse.push(shuffledRemaining.shift());
    }
  }
  
  for (const name of foodNamesToUse) {
    const qList = QUIZ_BANK.foodQuestions[name];
    if (qList && qList.length > 0) {
      const qData = qList[Math.floor(Math.random() * qList.length)];
      selected.push({
        q: qData.q,
        options: [...qData.options],
        a: qData.a,
        source: name
      });
    }
  }
  
  const shuffledGeneral = [...QUIZ_BANK.generalQuestions].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2; i++) {
    if (shuffledGeneral[i]) {
      selected.push({
        q: shuffledGeneral[i].q,
        options: [...shuffledGeneral[i].options],
        a: shuffledGeneral[i].a,
        source: '永續核心'
      });
    }
  }
  
  return selected;
}

function showQuestion(index) {
  const qData = quizQuestions[index];
  document.getElementById('quizProgress').textContent = `QUESTION ${index + 1} / 5`;
  
  const srcEl = document.getElementById('quizSource');
  if (qData.source === '永續核心') {
    srcEl.textContent = '🌍 永續核心題';
    srcEl.style.color = 'var(--yellow)';
    srcEl.style.background = 'rgba(255,224,102,.12)';
  } else {
    const matchedFood = FOODS.find(f => f.name === qData.source);
    const emoji = matchedFood ? matchedFood.emoji : '🥗';
    srcEl.textContent = `🌱 食材題：${emoji} ${qData.source}`;
    srcEl.style.color = '#9f9';
    srcEl.style.background = 'rgba(76,175,80,.12)';
  }
  
  document.getElementById('quizQuestion').textContent = qData.q;
  
  const container = document.getElementById('quizChoices');
  container.innerHTML = '';
  
  qData.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
    btn.onclick = () => handleAnswer(idx);
    container.appendChild(btn);
  });
  
  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('quizNextBtn').style.display = 'none';
}

function handleAnswer(selectedIdx) {
  const qData = quizQuestions[currentQuestionIndex];
  const container = document.getElementById('quizChoices');
  const buttons = container.querySelectorAll('.choice-btn');
  
  buttons.forEach(btn => btn.disabled = true);
  
  const isCorrect = (selectedIdx === qData.a);
  const feedbackEl = document.getElementById('quizFeedback');
  feedbackEl.style.display = 'block';
  
  if (isCorrect) {
    quizCorrectCount++;
    buttons[selectedIdx].classList.add('correct');
    feedbackEl.textContent = '🎉 答對了！獲得了 100 分加分！';
    feedbackEl.style.background = 'rgba(76,175,80,0.15)';
    feedbackEl.style.color = '#9f9';
    feedbackEl.style.border = '1px solid rgba(76,175,80,0.3)';
  } else {
    buttons[selectedIdx].classList.add('wrong');
    buttons[qData.a].classList.add('correct');
    feedbackEl.textContent = `❌ 答錯了！正確答案是: ${String.fromCharCode(65 + qData.a)}`;
    feedbackEl.style.background = 'rgba(229,57,53,0.15)';
    feedbackEl.style.color = '#f88';
    feedbackEl.style.border = '1px solid rgba(229,57,53,0.3)';
  }
  
  const nextBtn = document.getElementById('quizNextBtn');
  nextBtn.style.display = 'block';
  if (currentQuestionIndex === 4) {
    nextBtn.textContent = '查看結算成果 ➔';
  } else {
    nextBtn.textContent = '下一題 ➔';
  }
}

function nextQuestion() {
  if (currentQuestionIndex < 4) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  } else {
    document.getElementById('quizOverlay').style.display = 'none';
    showFinalResults();
  }
}

function showFinalResults() {
  state = 'idle';
  wrapper.style.cursor = 'auto';
  cursor.style.display = 'none';
  
  const finalTotalScore = score + (quizCorrectCount * 100);
  const localRate = (slicedFoodsHistory.length > 0) ? Math.round(localCut / slicedFoodsHistory.length * 100) : 0;
  
  let title = '';
  let comment = '';
  const isCleared = (endReason === 'clear');
  
  if (isCleared) {
    if (wasteCnt <= 1 && quizCorrectCount === 5) {
      title = '👑 完美永續神忍者';
      comment = '太厲害了！你是不折不扣的永續飲食達人！不僅營養滿分，還做到了零廚餘、答題全對，地球感謝你的愛護！';
    } else if (wasteCnt <= 2 && quizCorrectCount >= 3) {
      title = '🥗 知行合一實踐家';
      comment = '做得好！你對在地食材與永續飲食有很棒的觀念，剩食也控制得很好，繼續保持這種綠色生活態度！';
    } else {
      title = '🏃 驚險過關的忍者';
      comment = '驚險過關！雖然營養夠了，但你們班今天倒掉了 800 克的食物，相當於浪費了 2 個同學的便當喔！下次再加油！';
    }
  } else {
    if (quizCorrectCount === 5) {
      title = '📚 偏科的博學忍者';
      comment = '雖然你在廚房裡不小心失手了（廚餘滿了/被炸暈了），但你的永續知識簡直是滿分！下次注意身手，你一定能拯救地球！';
    } else {
      title = '🌱 再接再厲新手';
      if (quizCorrectCount >= 3) {
        comment = '可惜！雖然廚餘滿了或被炸暈了，但你的永續觀念還算不錯（答對 ' + quizCorrectCount + ' 題），下次注意身手，你一定能成功！';
      } else {
        comment = '可惜！這次廚餘桶滿出來了。不過沒關係，多認識在地食材，多答對幾題，下次你一定能成為更棒的午餐忍者！';
      }
    }
  }
  
  let reasonMsg = '';
  if (endReason === 'clear') {
    reasonMsg = '🎉 成功守護今日午餐！';
  } else if (endReason === 'waste') {
    reasonMsg = '⚠️ 剩食廚餘滿出來了…';
  } else {
    reasonMsg = '💥 廚房中不幸被炸暈了…';
  }

  const ov = document.getElementById('overlay');
  ov.innerHTML = `
    <h1 style="color:var(--yellow); text-shadow:0 0 20px rgba(255,224,102,0.3); font-size:24px; margin-bottom:2px;">🏆 永續午餐結算</h1>
    <div style="font-size:12px; color:#aaa; margin-bottom:8px;">${reasonMsg}</div>
    
    <div id="endBoard" style="max-width:440px; padding:16px 20px; background:rgba(0,0,0,0.5); border:1px solid rgba(76,175,80,0.25); box-shadow:0 8px 32px rgba(0,0,0,0.5);">
      
      <!-- Final Score -->
      <div style="margin-bottom:8px;">
        <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#bbb; display:block;">最終總得分</span>
        <span class="big" style="font-size:38px; color:var(--yellow); text-shadow:0 0 15px rgba(255,224,102,0.5); font-family:'Silkscreen',monospace; font-weight:900; line-height:1.1;">${finalTotalScore}</span>
      </div>
      
      <!-- Title Badge -->
      <div style="display:inline-block; background:linear-gradient(135deg,rgba(76,175,80,0.25),rgba(255,224,102,0.1)); border:1px solid rgba(76,175,80,0.4); border-radius:20px; padding:4px 16px; font-weight:700; color:var(--yellow); font-size:15px; margin-bottom:12px; box-shadow:0 2px 8px rgba(76,175,80,0.15);">
        ${title}
      </div>
      
      <!-- Evaluation Comment -->
      <div style="font-size:13px; color:#fff; line-height:1.6; background:rgba(255,255,255,0.05); border-radius:8px; padding:10px 14px; margin-bottom:14px; text-align:left; border-left:3px solid var(--green);">
        ${comment}
      </div>
      
      <!-- Stage 1 & 2 Details Grids -->
      <div style="display:flex; gap:10px; margin-bottom:12px; text-align:left;">
        
        <!-- Stage 1 -->
        <div style="flex:1; background:rgba(0,0,0,0.3); border-radius:8px; padding:8px 12px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:11px; font-weight:700; color:#9f9; margin-bottom:4px; border-bottom:1px solid rgba(159,255,153,0.2); padding-bottom:2px;">第一階段：切食材</div>
          <div style="font-size:11px; color:#ccc; display:flex; justify-content:space-between;"><span>切中得分</span><b style="color:#fff">${score}</b></div>
          <div style="font-size:11px; color:#ccc; display:flex; justify-content:space-between;"><span>健康食材</span><b style="color:#fff">${slicedFoodsHistory.length} 個</b></div>
          <div style="font-size:11px; color:#ccc; display:flex; justify-content:space-between;"><span>在地比例</span><b style="color:#fff">${localRate}%</b></div>
          <div style="font-size:11px; color:#ccc; display:flex; justify-content:space-between;"><span>剩食剩餘</span><b style="color:#ff8888">${wasteCnt} / 5 份</b></div>
        </div>
        
        <!-- Stage 2 -->
        <div style="flex:1; background:rgba(0,0,0,0.3); border-radius:8px; padding:8px 12px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:11px; font-weight:700; color:var(--yellow); margin-bottom:4px; border-bottom:1px solid rgba(255,224,102,0.2); padding-bottom:2px;">第二階段：永續考驗</div>
          <div style="font-size:11px; color:#ccc; display:flex; justify-content:space-between;"><span>答對題數</span><b style="color:#fff">${quizCorrectCount} / 5 題</b></div>
          <div style="font-size:11px; color:#ccc; display:flex; justify-content:space-between;"><span>答題加分</span><b style="color:var(--yellow)">+${quizCorrectCount * 100} 分</b></div>
          <div style="font-size:11px; color:#aaa; margin-top:4px; font-style:italic; line-height:1.2;">題庫涵蓋你切中食材的專屬知識！</div>
        </div>
        
      </div>
      
      <!-- Educational Eco-Box -->
      <div class="eco-box" style="margin-top:0; padding:8px 12px; font-size:11px; line-height:1.6;">
        💡 <b>永續飲食小知識</b><br>
        選在地食材可減少最多 <b>70%</b> 的運輸碳排放<br>
        台灣每年食物浪費 <b>250 萬公噸</b>，相當於 650 座台北 101<br>
        每少一份剩食，就少排放約 <b>2.5 kg CO₂</b> 🌍
      </div>
      
    </div>
    
    <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:4px;">
      <button class="btn btn-green" onclick="startGame()" style="background:var(--green); box-shadow:0 4px 18px rgba(76,175,80,0.4);">再玩一次 ▶</button>
    </div>
  `;
  ov.style.display = 'flex';
}
