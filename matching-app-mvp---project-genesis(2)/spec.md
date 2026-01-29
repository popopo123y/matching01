
# マッチングアプリMVP詳細仕様書 (Project Genesis)

## 1) MVPの成功条件 (KPI 10選)
1. **登録完了率 (80%)**: LP到達からプロフィール作成完了まで。離脱防止。
2. **初回いいね率 (90%)**: 登録後10分以内のアクション。
3. **プロフィール写真設定率 (75%)**: マッチングの鍵。
4. **マッチング成立率 (15%)**: 送信いいねに対するマッチ数。バランス調整指標。
5. **初回メッセージ送信率 (70%)**: マッチング後の放置防止。
6. **2日目継続率 (40%)**: 初期体験の「楽しさ」の証。
7. **有料会員転換率 (3%)**: (推測) ビジネス持続性。
8. **平均通報率 (<0.5%)**: 安全性の指標。
9. **年齢確認完了率 (70%)**: 法令遵守と信頼性。
10. **平均いいね消費数 (10回/日)**: ユーザーの熱量。

## 2) ペルソナとユースケース
1. **真剣婚活 (佐藤 32歳 会社員)**: 効率重視。プロフ内容を精査し、将来を見据えた会話を望む。
2. **ライト恋活 (田中 24歳 大学生)**: 直感重視。写真と共通の趣味タグで「ノリが合うか」を判断。
3. **コミュニティ重視 (鈴木 28歳 デザイナー)**: 共通点重視。趣味タグから相手を発見し、共通の話題で盛り上がる。

## 3) 画面設計 (URLパス付き)
- `/signup` / `/login`: 認証。メールバリデーション(RFC準拠)。
- `/onboarding`: 5ステップ (属性、目的、写真、自己紹介(200字以上推奨)、タグ)。
- `/profile/me`: 自己編集、プレビュー機能。
- `/discover`: カードスワイプ。1日30枚制限。
- `/search`: フィルタ (年齢±5歳、居住地、最終ログイン、年収)。
- `/likes/sent` / `/likes/received`: 履歴一覧。
- `/matches`: マッチング中ユーザー一覧。
- `/chat/:matchId`: リアルタイム風UI。既読表示。
- `/community`: 100種類以上の趣味タグ。
- `/settings`: 通知設定、ブロック管理、退会。
- `/verify`: 本人確認書類アップロード (eKYCフロー)。
- `/admin`: 通報処理、NG画像検知キュー、不適切プロフ修正要請。

## 4) データモデル (PostgreSQL)
- **User**: ID, Email, PasswordHash, Status(Active/Frozen), CreatedAt
- **Profile**: UserID(PK), Nickname(20), Age, Gender, Residence, Bio(1000), Purpose, LastLogin
- **Photo**: ID, UserID, URL, Rank(1-9), IsVerified(Bool)
- **Tag**: ID, Name, Category
- **UserTag**: UserID, TagID (Composite PK)
- **Like**: SenderID, ReceiverID, CreatedAt (Index on both)
- **Match**: ID, UserA, UserB, CreatedAt
- **Message**: ID, MatchID, SenderID, Body(500), IsRead(Bool), CreatedAt
- **Subscription**: UserID, PlanType, ValidUntil
- **AdminAction**: ID, AdminID, TargetUserID, ActionType, Reason

## 5) API設計 (REST)
- `POST /api/v1/auth/register`: JWT発行
- `GET /api/v1/discover`: スコア順レコメンド
- `POST /api/v1/likes`: `{"target_id": "uuid"}`
- `GET /api/v1/messages/:match_id`: 履歴取得
- **エラーコード**: `AUTH_001`(期限切れ), `VALIDATION_400`(不正入力), `RATE_500`(いいね制限)

## 6) レコメンド/表示順位
- **スコア計算**: `Score = (共通タグ数 * 10) + (ログインボーナス * 5) + (新規登録3日以内 * 20) - (距離km * 0.1)`
- **コールドスタート**: 新規ユーザーは登録後72時間、全ユーザーのDiscoverに1.5倍の確率で出現させる。
- **不正対策**: 1分間に5回以上のいいねはCAPTCHA要求。

## 7) チャット仕様
- **既読**: `updated_at` と `last_read_at` の比較。
- **NGワード**: 外部SNS ID(LINE等)の露骨な交換を検知し警告表示。
- **UX**: メッセージ長押しで「通報」「削除」をポップアップ。

## 8) 安全・法務・コンプラ
- **年齢確認**: 免許証・パスポートの生年月日・名称以外のマスキング推奨。
- **コンテンツ審査**: 画像はAIで肌露出率を計測(80%以上は自動非公開)。
- **利用規約**: 既婚者禁止、勧誘禁止、金銭授受禁止を明記。

## 9) 収益化設計
- **無料**: 登録、検索、1日10いいね、マッチ後の1通目送信。
- **有料 (3,980円/月)**: メッセージ無制限、既読表示、検索上位表示。
- **アイテム**: 「ブースト(20分間露出5倍)」 1個 500円。

## 10) 実装ロードマップ (7日)
- Day1: インフラ(Vercel/Supabase)、認証、DB定義。
- Day2: オンボーディング、プロフ編集、写真アップ。
- Day3: Discover(スワイプ)実装、レコメンドロジック。
- Day4: 検索フィルタ、いいね/マッチング成立ロジック。
- Day5: チャットUI、ポーリング/リアルタイム処理。
- Day6: マイページ、課金導線、年齢確認フロー。
- Day7: 管理画面、通報機能、最終デバッグとデモ準備。
