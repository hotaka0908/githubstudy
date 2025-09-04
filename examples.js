// 例題/解説データ
// フォーマット: { [id]: { intro?: string, blocks: Array<{ kind: 'text'|'code', lang?: string, title?: string, content: string }> } }
const EXAMPLES = {
  "js-basics": {
    intro: "配列の合計/平均/最大を高階関数で実装する例です。forループを使わず、読みやすくテストしやすいスタイルにします。",
    blocks: [
      { kind: 'code', lang: 'javascript', title: '配列集計ユーティリティ', content: `// numbersが空配列の時も安全に扱う
export function sum(numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

export function avg(numbers) {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

export function max(numbers) {
  return numbers.reduce((m, n) => (n > m ? n : m), Number.NEGATIVE_INFINITY);
}

// 使用例
const data = [3, 5, 9, 2];
console.log(sum(data)); // 19
console.log(avg(data)); // 4.75
console.log(max(data)); // 9` },
      { kind: 'text', content: 'reduceは配列を1つの値に畳み込む関数です。副作用が少なく、テストしやすいコードになります。' }
    ]
  },
  "css-layout": {
    intro: "FlexとGridを使ってカードグリッドを作る基本例です。",
    blocks: [
      { kind: 'code', lang: 'html', title: 'HTML', content: `<section class="cards">
  <article class="card">A</article>
  <article class="card">B</article>
  <article class="card">C</article>
</section>` },
      { kind: 'code', lang: 'css', title: 'CSS', content: `.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.card { background: #1e2936; border: 1px solid #2a3a4f; padding: 16px; border-radius: 8px; }` },
      { kind: 'text', content: 'auto-fill と minmax を使うとレスポンシブに列数が調整されます。' }
    ]
  },
  "html-structure": {
    intro: "意味のあるタグ（セマンティクス）を用いた自己紹介ページの例です。",
    blocks: [
      { kind: 'code', lang: 'html', title: 'セマンティックHTML', content: `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>自己紹介</title>
  </head>
  <body>
    <header><h1>山田 花子</h1></header>
    <main>
      <article>
        <h2>プロフィール</h2>
        <p>Webが好きな初学者です。</p>
      </article>
      <section>
        <h2>リンク</h2>
        <ul>
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </section>
    </main>
    <footer>© 2025 Hanako</footer>
  </body>
</html>` }
    ]
  },
  "cli-stdin-pipe": {
    intro: "ログから単語の出現頻度トップ10を出すワンライナーです。ripgrepがあればrg、無ければgrepで代替します。",
    blocks: [
      { kind: 'code', lang: 'bash', title: 'rg版（高速）', content: `cat access.log | rg -o "\\w+" | sort | uniq -c | sort -nr | head -n 10` },
      { kind: 'code', lang: 'bash', title: 'grep版（代替）', content: `cat access.log | grep -oE "[A-Za-z0-9_]+" | sort | uniq -c | sort -nr | head -n 10` },
      { kind: 'text', content: '標準出力を次の標準入力へ繋ぐのがパイプです。uniq -cの前にsortが必要なのは、同じ単語を隣接させるためです。' }
    ]
  },
  "git-basic-flow": {
    intro: "ブランチを切って小さくコミットし、プッシュしてPRを作る基本フローです。",
    blocks: [
      { kind: 'code', lang: 'bash', title: '基本フロー', content: `git switch -c feat/add-cards
git status
git add index.html styles.css
git commit -m "feat: カードUIを追加"
git push -u origin feat/add-cards
# GitHubでPRを作成し、レビュー後にマージ` }
    ]
  },
  "http-basics": {
    intro: "HTTPメソッドとステータスの観察。curlでヘッダやJSONを見る例です。",
    blocks: [
      { kind: 'code', lang: 'bash', title: 'GETでJSON取得', content: `curl -i https://httpbin.org/json` },
      { kind: 'code', lang: 'bash', title: 'POSTでJSON送信', content: `curl -i -X POST https://httpbin.org/post -H 'Content-Type: application/json' -d '{"name":"taro"}'` },
      { kind: 'text', content: '2xxは成功、4xxはクライアントミス、5xxはサーバ障害の目安です。' }
    ]
  },
  "db-sql-basics": {
    intro: "2つのテーブルをJOINして条件付きで集計する例です。",
    blocks: [
      { kind: 'code', lang: 'sql', title: 'JOIN + WHERE + GROUP BY', content: `-- users(id, name), orders(id, user_id, amount, status)
SELECT u.name, COUNT(o.id) AS order_count, SUM(o.amount) AS total
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid'
GROUP BY u.name
ORDER BY total DESC
LIMIT 10;` },
      { kind: 'text', content: 'インデックスはJOINに使う外部キーやWHERE条件に貼るのが基本です。SELECT * は避け、必要な列を指定します。' }
    ]
  },
  "prog-data-structures": {
    intro: "重複を除去して頻度順に並べる関数の例（JavaScript）。",
    blocks: [
      { kind: 'code', lang: 'javascript', title: '頻度集計', content: `function frequencySort(arr) {
  const map = new Map();
  for (const x of arr) map.set(x, (map.get(x) || 0) + 1);
  return [...map.entries()].sort((a,b) => b[1]-a[1]).map(([k]) => k);
}

console.log(frequencySort(['a','b','a','c','a','b'])); // ['a','b','c']` }
    ]
  },
  "error-handling": {
    intro: "ユーザー向けの分かりやすいメッセージと、開発者向けの詳細ログを分ける例です。",
    blocks: [
      { kind: 'code', lang: 'javascript', title: '分離の例', content: `function parseJsonSafe(input) {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (err) {
    console.error('JSON parse failed', { message: err.message, input: input.slice(0, 100) });
    return { ok: false, message: 'データの読み込みに失敗しました。もう一度お試しください。' };
  }
}` }
    ]
  }
};

