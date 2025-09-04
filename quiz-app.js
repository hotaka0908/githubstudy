// QuizApp - エンジニア必修知識クイズアプリケーション

class QuizApp {
  constructor() {
    this.currentLevel = 'beginner';
    this.currentQuestionIndex = 0;
    this.progress = this.loadProgress();
    this.fileSystem = new Map();
    this.currentDirectory = '~/practice';
    this.countdownTimer = null;
    this.timeRemaining = 10;
    
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
    
    // 鬼モード用イベント
    document.getElementById('hintBtn').addEventListener('click', () => {
      this.showHint();
    });
    
    document.getElementById('commandInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand();
      }
    });

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
      if (e.key === '1' || e.key === 'ArrowLeft') {
        document.getElementById('knowBtn').click();
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        document.getElementById('dontKnowBtn').click();
      } else if (e.key === 'h' || e.key === 'H') {
        // 鬼モードでのヒントボタン
        if (this.currentLevel === 'demon' && document.getElementById('commandInputArea').style.display !== 'none') {
          document.getElementById('hintBtn').click();
        }
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
      'advanced': '上級',
      'demon': '鬼モード'
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
    
    // 鬼モードの場合はコマンド入力エリアを表示
    const answerButtons = document.getElementById('answerButtons');
    const commandInputArea = document.getElementById('commandInputArea');
    
    if (this.currentLevel === 'demon') {
      answerButtons.style.display = 'none';
      commandInputArea.style.display = 'block';
      this.setupDemonMode(currentQuestion);
    } else {
      answerButtons.style.display = 'flex';
      commandInputArea.style.display = 'none';
    }
    
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
    const levels = ['beginner', 'intermediate', 'advanced', 'demon'];
    const currentIndex = levels.indexOf(this.currentLevel);
    return levels[currentIndex + 1] || null;
  }
  
  getNextLevelName() {
    const nextLevel = this.getNextLevel();
    const levelNames = {
      'intermediate': '中級',
      'advanced': '上級',
      'demon': '鬼モード'
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
  
  // 鬼モード関連メソッド
  setupDemonMode(question) {
    // ファイルシステムをリセット
    this.fileSystem.clear();
    this.currentDirectory = '~/practice';
    
    // 初期ファイルを設定
    if (question.initialFiles) {
      question.initialFiles.forEach(file => {
        if (file.endsWith('/')) {
          this.fileSystem.set(file.slice(0, -1), { type: 'directory', content: null });
        } else {
          this.fileSystem.set(file, { type: 'file', content: 'sample content' });
        }
      });
    }
    
    this.updateFileSystemDisplay();
    this.clearCommandOutput();
    document.getElementById('commandInput').value = '';
    document.getElementById('commandInput').focus();
    
    // カウントダウン開始
    this.startCountdown();
  }
  
  resetDemonMode() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    this.setupDemonMode(currentQuestion);
  }
  
  executeCommand() {
    const input = document.getElementById('commandInput').value.trim();
    const output = document.getElementById('commandOutput');
    
    if (!input) return;
    
    // コマンド履歴を表示
    this.addCommandOutput(`$ ${input}`, 'command-input');
    
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    // コマンドを実行
    const result = this.simulateCommand(input, currentQuestion);
    
    if (result.output) {
      this.addCommandOutput(result.output, result.success ? 'command-success' : 'command-error');
    }
    
    this.updateFileSystemDisplay();
    
    // 正解判定
    if (result.success && this.checkAnswer(input, currentQuestion)) {
      this.stopCountdown(); // カウントダウンを停止
      setTimeout(() => {
        this.addCommandOutput('✅ 正解！次の問題に進みます。', 'command-success');
        setTimeout(() => {
          this.nextQuestion();
        }, 1500);
      }, 500);
    }
    
    document.getElementById('commandInput').value = '';
  }
  
  simulateCommand(command, question) {
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    
    switch (cmd) {
      case 'touch':
        return this.simulateTouch(args);
      case 'mkdir':
        return this.simulateMkdir(args);
      case 'ls':
        return this.simulateLs(args);
      case 'cat':
        return this.simulateCat(args);
      case 'cp':
        return this.simulateCp(args);
      case 'rm':
        return this.simulateRm(args);
      case 'find':
        return this.simulateFind(args);
      case 'grep':
        return this.simulateGrep(args);
      case 'echo':
        return this.simulateEcho(args, command);
      case 'cd':
        return this.simulateCd(args);
      case 'pwd':
        return this.simulatePwd();
      default:
        return { success: false, output: `bash: ${cmd}: command not found` };
    }
  }
  
  simulateTouch(args) {
    if (args.length === 0) {
      return { success: false, output: 'touch: missing file operand' };
    }
    
    args.forEach(filename => {
      this.fileSystem.set(filename, { type: 'file', content: '' });
    });
    
    return { success: true, output: '' };
  }
  
  simulateMkdir(args) {
    if (args.length === 0) {
      return { success: false, output: 'mkdir: missing operand' };
    }
    
    args.forEach(dirname => {
      this.fileSystem.set(dirname, { type: 'directory', content: null });
    });
    
    return { success: true, output: '' };
  }
  
  simulateLs(args) {
    const files = Array.from(this.fileSystem.keys()).sort();
    const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
    
    let output = '';
    files.forEach(file => {
      const item = this.fileSystem.get(file);
      if (showAll || !file.startsWith('.')) {
        if (longFormat) {
          const type = item.type === 'directory' ? 'd' : '-';
          const permissions = item.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--';
          output += `${type}${permissions} 1 user user 1024 Dec 1 12:00 ${file}\n`;
        } else {
          output += file + '\n';
        }
      }
    });
    
    return { success: true, output: output.trim() };
  }
  
  simulateCat(args) {
    if (args.length === 0) {
      return { success: false, output: 'cat: missing file operand' };
    }
    
    const filename = args[0];
    const file = this.fileSystem.get(filename);
    
    if (!file) {
      return { success: false, output: `cat: ${filename}: No such file or directory` };
    }
    
    if (file.type === 'directory') {
      return { success: false, output: `cat: ${filename}: Is a directory` };
    }
    
    return { success: true, output: file.content || 'sample file content' };
  }
  
  simulateCp(args) {
    if (args.length < 2) {
      return { success: false, output: 'cp: missing destination file operand' };
    }
    
    const source = args[0];
    const dest = args[1];
    const sourceFile = this.fileSystem.get(source);
    
    if (!sourceFile) {
      return { success: false, output: `cp: cannot stat '${source}': No such file or directory` };
    }
    
    this.fileSystem.set(dest, { ...sourceFile });
    return { success: true, output: '' };
  }
  
  simulateRm(args) {
    if (args.length === 0) {
      return { success: false, output: 'rm: missing operand' };
    }
    
    args.forEach(filename => {
      if (this.fileSystem.has(filename)) {
        this.fileSystem.delete(filename);
      }
    });
    
    return { success: true, output: '' };
  }
  
  simulateFind(args) {
    const nameIndex = args.indexOf('-name');
    if (nameIndex === -1 || !args[nameIndex + 1]) {
      return { success: false, output: 'find: missing argument to `-name\'' };
    }
    
    const pattern = args[nameIndex + 1].replace(/"/g, '').replace(/\*/g, '.*');
    const regex = new RegExp(pattern);
    
    const results = Array.from(this.fileSystem.keys())
      .filter(file => regex.test(file))
      .map(file => `./${file}`)
      .join('\n');
    
    return { success: true, output: results };
  }
  
  simulateGrep(args) {
    if (args.length < 2) {
      return { success: false, output: 'grep: missing pattern or file' };
    }
    
    const pattern = args[0].replace(/"/g, '');
    const filename = args[1];
    const file = this.fileSystem.get(filename);
    
    if (!file) {
      return { success: false, output: `grep: ${filename}: No such file or directory` };
    }
    
    // 簡単なパターンマッチング
    const content = file.content || 'sample file content with react library';
    const lines = content.split('\n').filter(line => line.includes(pattern));
    
    return { success: true, output: lines.join('\n') || '' };
  }
  
  simulateEcho(args, fullCommand) {
    const redirectIndex = fullCommand.indexOf('>');
    if (redirectIndex !== -1) {
      const parts = fullCommand.split('>');
      const text = parts[0].replace('echo', '').trim().replace(/"/g, '');
      const filename = parts[1].trim();
      
      this.fileSystem.set(filename, { type: 'file', content: text });
      return { success: true, output: '' };
    }
    
    const text = args.join(' ').replace(/"/g, '');
    return { success: true, output: text };
  }
  
  simulateCd(args) {
    // 簡単な実装（実際のディレクトリ変更はシミュレート）
    if (args.length > 0) {
      this.currentDirectory = `~/practice/${args[0]}`;
    }
    return { success: true, output: '' };
  }
  
  simulatePwd() {
    return { success: true, output: this.currentDirectory };
  }
  
  checkAnswer(command, question) {
    const normalizedCommand = command.trim().toLowerCase();
    const expectedCommand = question.expectedCommand.toLowerCase();
    
    // 基本的なコマンドマッチング
    if (normalizedCommand === expectedCommand) {
      return true;
    }
    
    // 代替形式もチェック（例：ls -al と ls -la）
    if (question.expectedCommand.includes('ls -la')) {
      return normalizedCommand.includes('ls') && 
             (normalizedCommand.includes('-la') || normalizedCommand.includes('-al'));
    }
    
    return false;
  }
  
  updateFileSystemDisplay() {
    const fileSystemDiv = document.getElementById('fileSystem');
    const files = Array.from(this.fileSystem.entries()).sort();
    
    if (files.length === 0) {
      fileSystemDiv.innerHTML = '';
      return;
    }
    
    let html = '';
    files.forEach(([name, info]) => {
      const className = info.type === 'directory' ? 'directory-item' : 'file-item';
      const displayName = info.type === 'directory' ? `📁 ${name}/` : `📄 ${name}`;
      html += `<span class="${className}">${displayName}</span>`;
    });
    
    fileSystemDiv.innerHTML = html;
  }
  
  addCommandOutput(text, className = '') {
    const output = document.getElementById('commandOutput');
    const div = document.createElement('div');
    div.textContent = text;
    if (className) {
      div.className = className;
    }
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
    output.style.display = 'block';
  }
  
  clearCommandOutput() {
    const output = document.getElementById('commandOutput');
    output.innerHTML = '';
    output.style.display = 'none';
  }
  
  skipDemonQuestion() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    this.stopCountdown(); // カウントダウンを停止
    
    // スキップしたことを記録
    if (!this.progress[this.currentLevel]) {
      this.progress[this.currentLevel] = {};
    }
    this.progress[this.currentLevel][currentQuestion.id] = false; // スキップは「知らない」として記録
    this.saveProgress();
    
    // スキップメッセージを表示
    this.addCommandOutput('⏭️ 問題をスキップしました。', 'command-error');
    
    // 1秒後に次の問題へ
    setTimeout(() => {
      this.nextQuestion();
    }, 1000);
  }
  
  showHint() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    if (currentQuestion.hint) {
      this.addCommandOutput('💡 ヒント: ' + currentQuestion.hint, 'command-hint');
    } else {
      this.addCommandOutput('💡 ヒント: ' + currentQuestion.expectedCommand, 'command-hint');
    }
    
    // ヒントボタンを一時的に無効化
    const hintBtn = document.getElementById('hintBtn');
    hintBtn.disabled = true;
    hintBtn.textContent = '💡 使用済み';
    
    setTimeout(() => {
      hintBtn.disabled = false;
      hintBtn.textContent = '💡 ヒント';
    }, 5000);
  }
  
  // カウントダウン機能
  startCountdown() {
    // 既存のタイマーをクリア
    this.stopCountdown();
    
    // 爆弾タイマー表示
    const bombTimer = document.getElementById('bombTimer');
    const fuse = document.getElementById('fuse');
    const spark = document.getElementById('spark');
    
    this.timeRemaining = 10;
    bombTimer.style.display = 'flex';
    
    // 導火線と火花の初期化
    fuse.style.setProperty('--burn-progress', '0%');
    spark.style.setProperty('--spark-position', '0%');
    
    // カウントダウン開始
    this.countdownTimer = setInterval(() => {
      this.timeRemaining--;
      
      // 爆弾アニメーション更新
      const progress = ((10 - this.timeRemaining) / 10) * 100;
      fuse.style.setProperty('--burn-progress', `${progress}%`);
      spark.style.setProperty('--spark-position', `${progress}%`);
      
      // 緊迫想を演出（残り3秒以下でアニメーション速度アップ）
      const bomb = document.querySelector('.bomb');
      if (this.timeRemaining <= 3) {
        bomb.style.animationDuration = '0.05s';
        spark.style.fontSize = '16px';
      } else if (this.timeRemaining <= 5) {
        bomb.style.animationDuration = '0.08s';
        spark.style.fontSize = '14px';
      }
      
      // タイムアップ
      if (this.timeRemaining <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  }
  
  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    
    // 爆弾タイマー非表示
    const bombTimer = document.getElementById('bombTimer');
    bombTimer.style.display = 'none';
    
    // スタイルリセット
    const bomb = document.querySelector('.bomb');
    const spark = document.getElementById('spark');
    if (bomb) {
      bomb.style.animationDuration = '';
    }
    if (spark) {
      spark.style.fontSize = '';
    }
  }
  
  handleTimeUp() {
    // 爆発エフェクト
    this.showExplosion();
    
    setTimeout(() => {
      this.stopCountdown();
      
      // タイムアップメッセージ
      this.addCommandOutput('💥 爆発！時間切れです！次の問題に進みます。', 'command-error');
      
      // 進捗記録（タイムアップは「知らない」として記録）
      const questions = QUIZ_QUESTIONS[this.currentLevel];
      const currentQuestion = questions[this.currentQuestionIndex];
      
      if (!this.progress[this.currentLevel]) {
        this.progress[this.currentLevel] = {};
      }
      this.progress[this.currentLevel][currentQuestion.id] = false;
      this.saveProgress();
      
      // 2秒後に次の問題へ
      setTimeout(() => {
        this.nextQuestion();
      }, 2000);
    }, 500);
  }
  
  showExplosion() {
    const bomb = document.querySelector('.bomb');
    const spark = document.getElementById('spark');
    
    // 爆発エフェクト
    bomb.textContent = '💥';
    bomb.style.animation = 'explosion 0.5s ease-out';
    spark.style.display = 'none';
    
    // 爆発音効果（視覚的）
    setTimeout(() => {
      bomb.style.transform = 'scale(1)';
      bomb.style.opacity = '1';
      bomb.textContent = '💣';
      bomb.style.animation = 'bombShake 0.1s infinite';
      spark.style.display = 'block';
    }, 500);
  }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
});