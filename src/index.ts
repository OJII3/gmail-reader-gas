/**
 * Gmail Reader GAS
 * 最後の実行以降に受信したGmailを読み取る
 */

const PROPERTY_KEY = 'lastExecutionTime';

/**
 * メイン関数: 前回実行以降の未読メールを読み取る
 */
function readNewEmails(): void {
  const now = new Date();
  const lastExecutionTime = getLastExecutionTime();

  console.log('=== New Emails ===');
  console.log(`Searching emails since: ${lastExecutionTime.toISOString()}`);
  console.log('');

  const emails = searchNewEmails(lastExecutionTime);

  if (emails.length === 0) {
    console.log('No new emails found.');
  } else {
    emails.forEach((email, index) => {
      console.log(`[${index + 1}] Subject: ${email.subject}`);
      console.log(`    From: ${email.from}`);
      console.log(`    Date: ${email.date}`);
      console.log(`    Body: ${email.bodyExcerpt}`);
      console.log('');
    });
    console.log(`Found ${emails.length} new email(s).`);
  }

  // 次回の実行のために現在時刻を保存
  updateLastExecutionTime(now);
  console.log(`Last execution time updated: ${now.toISOString()}`);
}

/**
 * 前回実行時刻を取得する
 * 初回実行時は24時間前を返す
 */
function getLastExecutionTime(): Date {
  const props = PropertiesService.getScriptProperties();
  const lastTime = props.getProperty(PROPERTY_KEY);

  if (lastTime) {
    return new Date(lastTime);
  }

  // 初回実行時は24時間前をデフォルトとする
  const defaultTime = new Date();
  defaultTime.setHours(defaultTime.getHours() - 24);
  return defaultTime;
}

/**
 * 前回実行時刻を更新する
 */
function updateLastExecutionTime(time: Date): void {
  const props = PropertiesService.getScriptProperties();
  props.setProperty(PROPERTY_KEY, time.toISOString());
}

/**
 * 指定時刻以降の未読メールを検索する
 */
function searchNewEmails(since: Date): EmailData[] {
  const sinceStr = formatDateString(since);
  const query = `is:unread after:${sinceStr}`;

  console.log(`Search query: ${query}`);

  const threads = GmailApp.search(query, 0, 50);
  const emails: EmailData[] = [];

  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const message of messages) {
      const messageDate = message.getDate();
      if (messageDate >= since) {
        emails.push({
          subject: message.getSubject(),
          from: message.getFrom(),
          date: messageDate.toUTCString(),
          bodyExcerpt: extractBodyExcerpt(message.getPlainBody()),
        });
      }
    }
  }

  return emails;
}

/**
 * 日付をGmail検索用の文字列にフォーマットする
 * 形式: YYYY/MM/DD
 */
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * メール本文から抜粋を抽出する
 * 最初の200文字を返す
 */
function extractBodyExcerpt(body: string): string {
  const maxLength = 200;
  const cleaned = body.replace(/\s+/g, ' ').trim();

  if (cleaned.length <= maxLength) {
    return cleaned || '(本文なし)';
  }

  return cleaned.substring(0, maxLength) + '...';
}

/**
 * メールデータの型定義
 */
interface EmailData {
  subject: string;
  from: string;
  date: string;
  bodyExcerpt: string;
}

// GAS用にグローバルスコープに関数をエクスポート
(globalThis as any).readNewEmails = readNewEmails;
