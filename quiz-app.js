// QuizApp - エンジニア必修知識クイズアプリケーション

class QuizApp {
  constructor() {
    this.currentLevel = 'beginner';
    this.currentQuestionIndex = 0;
    this.progress = this.loadProgress();
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.initTheme();
    this.updateLevelDisplay();
    this.showCurrentQuestion();
    this.updateProgress();
  }
  
  bindEvents() {
    // テーマ切り替えボタン
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // レベル切り替えボタン
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchLevel(e.target.dataset.level);
      });
    });
    
    // 回答ボタン
    document.getElementById('knowBtn').addEventListener('click', () => {
      this.handleAnswer(true);
    });
    
    document.getElementById('dontKnowBtn').addEventListener('click', () => {
      this.handleAnswer(false);
    });
    
    // 説明モーダル関連
    document.getElementById('closeExplanation').addEventListener('click', () => {
      this.hideExplanation();
    });
    
    document.getElementById('nextFromExplanation').addEventListener('click', () => {
      this.hideExplanation();
      this.nextQuestion();
    });
    
    // レベル完了モーダル関連
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
      this.moveToNextLevel();
    });
    
    document.getElementById('reviewBtn').addEventListener('click', () => {
      this.reviewLevel();
    });
    
    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
      if (e.key === '1' || e.key === 'ArrowLeft') {
        document.getElementById('knowBtn').click();
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        document.getElementById('dontKnowBtn').click();
      } else if (e.key === 'Escape') {
        this.hideExplanation();
        this.hideLevelComplete();
      }
    });
    
    // モーダル背景クリックで閉じる
    document.getElementById('explanationModal').addEventListener('click', (e) => {
      if (e.target.id === 'explanationModal') {
        this.hideExplanation();
      }
    });
  }
  
  switchLevel(level) {
    this.currentLevel = level;
    this.currentQuestionIndex = 0;
    
    // アクティブなレベルボタンを更新
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-level="${level}"]`).classList.add('active');
    
    this.updateLevelDisplay();
    this.showCurrentQuestion();
    this.updateProgress();
  }
  
  updateLevelDisplay() {
    const levelNames = {
      'beginner': '初級',
      'intermediate': '中級', 
      'advanced': '上級'
    };
    
    document.getElementById('currentLevel').textContent = levelNames[this.currentLevel];
  }
  
  showCurrentQuestion() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    if (!currentQuestion) {
      this.showLevelComplete();
      return;
    }
    
    document.getElementById('questionNumber').textContent = this.currentQuestionIndex + 1;
    document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    // カードのアニメーション
    const card = document.getElementById('quizCard');
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  }
  
  handleAnswer(knows) {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    // 進捗を保存
    if (!this.progress[this.currentLevel]) {
      this.progress[this.currentLevel] = {};
    }
    this.progress[this.currentLevel][currentQuestion.id] = knows;
    this.saveProgress();
    
    if (knows) {
      // 知っている場合はすぐに次の問題へ
      this.nextQuestion();
    } else {
      // 知らない場合は説明を表示
      this.showExplanation(currentQuestion);
    }
  }
  
  nextQuestion() {
    this.currentQuestionIndex++;
    this.showCurrentQuestion();
    this.updateProgress();
  }
  
  showExplanation(question) {
    const modal = document.getElementById('explanationModal');
    const title = document.getElementById('explanationTitle');
    const content = document.getElementById('explanationContent');
    
    title.textContent = question.explanation.title;
    
    // 説明内容を構築
    let html = `
      <div class="explanation-description">
        <p>${question.explanation.description}</p>
      </div>
      
      <div class="explanation-section">
        <h4>💡 使い方</h4>
        <ul>
          ${question.explanation.usage.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div class="explanation-section">
        <h4>📝 具体例</h4>
        <ul>
          ${question.explanation.examples.map(item => `<li><code>${item}</code></li>`).join('')}
        </ul>
      </div>
      
      <div class="explanation-section">
        <h4>💫 ポイント</h4>
        <p class="tips">${question.explanation.tips}</p>
      </div>
    `;
    
    content.innerHTML = html;
    modal.classList.add('show');
    
    // フォーカスを説明モーダルに移動
    setTimeout(() => {
      document.getElementById('nextFromExplanation').focus();
    }, 100);
  }
  
  hideExplanation() {
    document.getElementById('explanationModal').classList.remove('show');
  }
  
  showLevelComplete() {
    const modal = document.getElementById('levelCompleteModal');
    const content = document.getElementById('completeContent');
    
    const levelProgress = this.progress[this.currentLevel] || {};
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const totalQuestions = questions.length;
    const knownQuestions = Object.values(levelProgress).filter(known => known).length;
    const unknownQuestions = totalQuestions - knownQuestions;
    
    const percentage = Math.round((knownQuestions / totalQuestions) * 100);
    
    let resultMessage = '';
    let nextLevelAvailable = false;
    
    if (percentage >= 80) {
      resultMessage = '🌟 素晴らしい！このレベルをマスターしました！';
      nextLevelAvailable = true;
    } else if (percentage >= 60) {
      resultMessage = '👍 良い感じです！もう少し復習してみましょう。';
    } else {
      resultMessage = '📚 復習が必要ですが、着実に学習しています！';
    }
    
    const levelNames = {
      'beginner': '初級',
      'intermediate': '中級',
      'advanced': '上級'
    };
    
    content.innerHTML = `
      <div class="result-summary">
        <div class="result-score">
          <span class="score-number">${percentage}%</span>
          <span class="score-label">理解度</span>
        </div>
        <div class="result-details">
          <div class="detail-item">
            <span class="detail-label">知っていた:</span>
            <span class="detail-value known">${knownQuestions}問</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">学習した:</span>
            <span class="detail-value learned">${unknownQuestions}問</span>
          </div>
        </div>
      </div>
      <div class="result-message">
        <p>${resultMessage}</p>
      </div>
    `;
    
    // 次のレベルボタンの表示/非表示
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelAvailable && this.getNextLevel()) {
      nextLevelBtn.style.display = 'block';
      nextLevelBtn.textContent = `${this.getNextLevelName()}へ進む`;
    } else {
      nextLevelBtn.style.display = 'none';
    }
    
    modal.classList.add('show');
  }
  
  hideLevelComplete() {
    document.getElementById('levelCompleteModal').classList.remove('show');
  }
  
  moveToNextLevel() {
    const nextLevel = this.getNextLevel();
    if (nextLevel) {
      this.hideLevelComplete();
      this.switchLevel(nextLevel);
    }
  }
  
  reviewLevel() {
    this.hideLevelComplete();
    this.currentQuestionIndex = 0;
    this.showCurrentQuestion();
  }
  
  getNextLevel() {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(this.currentLevel);
    return levels[currentIndex + 1] || null;
  }
  
  getNextLevelName() {
    const nextLevel = this.getNextLevel();
    const levelNames = {
      'intermediate': '中級',
      'advanced': '上級'
    };
    return levelNames[nextLevel] || '';
  }
  
  updateProgress() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const totalQuestions = questions.length;
    const currentProgress = ((this.currentQuestionIndex) / totalQuestions) * 100;
    
    document.getElementById('progressPct').textContent = `${Math.round(currentProgress)}%`;
    document.getElementById('progressBar').style.width = `${currentProgress}%`;
  }
  
  loadProgress() {
    try {
      const saved = localStorage.getItem('quiz_progress_v2');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }
  
  saveProgress() {
    try {
      localStorage.setItem('quiz_progress_v2', JSON.stringify(this.progress));
    } catch (e) {
      console.warn('進捗の保存に失敗しました');
    }
  }
  
  // テーマ管理メソッド
  initTheme() {
    const savedTheme = localStorage.getItem('quiz_theme') || 'light';
    this.setTheme(savedTheme);
  }
  
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('.theme-icon');
    
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
    } else {
      themeIcon.textContent = '🌙';
    }
    
    // テーマをローカルストレージに保存
    localStorage.setItem('quiz_theme', theme);
  }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
});