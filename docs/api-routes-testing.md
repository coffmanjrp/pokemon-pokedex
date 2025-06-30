# Next.js API Routes Testing Guide

## 概要

GraphQLクエリをNext.js API routeで確認するためのエンドポイントを実装しました。

## 実装されたAPI Routes

### 1. `/api` - API ドキュメンテーション
```bash
GET http://localhost:3000/api
```
利用可能なエンドポイントの一覧と使用例を表示

### 2. `/api/pokemon` - Pokemon リスト（基本）/ 単一Pokemon（基本）
```bash
# Pokemon リスト取得
GET http://localhost:3000/api/pokemon?limit=20&offset=0

# 単一Pokemon取得（基本データ）
GET http://localhost:3000/api/pokemon?id=1
```
- `GET_POKEMONS_BASIC` クエリ（リスト）
- `GET_POKEMON_BASIC` クエリ（単体）

### 3. `/api/pokemon/[id]` - Pokemon 詳細データ
```bash
GET http://localhost:3000/api/pokemon/1
```
- `GET_POKEMON` クエリ（完全な詳細データ）

### 4. `/api/graphql/debug` - GraphQLクエリ直接テスト
```bash
# 基本Pokemon リスト
GET http://localhost:3000/api/graphql/debug?query=GET_POKEMONS_BASIC&limit=5

# 基本Pokemon詳細
GET http://localhost:3000/api/graphql/debug?query=GET_POKEMON_BASIC&id=1

# 完全Pokemon詳細
GET http://localhost:3000/api/graphql/debug?query=GET_POKEMON&id=1

# 完全Pokemon リスト
GET http://localhost:3000/api/graphql/debug?query=GET_POKEMONS_FULL&limit=3
```

## クエリ比較

### GET_POKEMON_BASIC vs GET_POKEMON
- **GET_POKEMON_BASIC**: 軽量な基本データ（カード表示用）
- **GET_POKEMON**: 完全な詳細データ（詳細ページ用、進化チェーン含む）

### GET_POKEMONS_BASIC vs GET_POKEMONS_FULL
- **GET_POKEMONS_BASIC**: リスト表示用の軽量データ
- **GET_POKEMONS_FULL**: SSG用の完全データ

## テスト例

### 1. API ドキュメント確認
```bash
curl http://localhost:3000/api | jq
```

### 2. Pokemon リスト取得
```bash
curl "http://localhost:3000/api/pokemon?limit=5&offset=0" | jq
```

### 3. フシギダネの基本データ取得
```bash
curl "http://localhost:3000/api/pokemon?id=1" | jq
```

### 4. フシギダネの詳細データ取得
```bash
curl "http://localhost:3000/api/pokemon/1" | jq
```

### 5. GraphQLクエリ直接テスト
```bash
# 基本リストクエリ
curl "http://localhost:3000/api/graphql/debug?query=GET_POKEMONS_BASIC&limit=3" | jq

# 基本詳細クエリ
curl "http://localhost:3000/api/graphql/debug?query=GET_POKEMON_BASIC&id=1" | jq

# 完全詳細クエリ
curl "http://localhost:3000/api/graphql/debug?query=GET_POKEMON&id=1" | jq
```

## レスポンスフォーマット

### 成功レスポンス
```json
{
  "success": true,
  "data": {...},
  "metadata": {
    "queryType": "GET_POKEMON_BASIC",
    "variables": {"id": "1"},
    "timestamp": "2025-06-29T20:52:00.000Z",
    "executionTime": 150,
    "dataSize": "2.5 KB",
    "source": "GraphQL API Debug"
  }
}
```

### エラーレスポンス
```json
{
  "error": "GraphQL query failed",
  "details": "Error message",
  "metadata": {...}
}
```

## 主な用途

1. **GraphQLクエリの動作確認**: 各クエリが正しく動作するかテスト
2. **データサイズ比較**: 基本クエリと完全クエリのデータサイズ差を確認
3. **パフォーマンス測定**: クエリの実行時間を測定
4. **デバッグ**: GraphQLエラーの詳細確認

## 注意事項

- 開発環境でのみ使用を想定
- GraphQLサーバーが起動している必要があります（localhost:4000またはRAILWAY_URL）
- デバッグエンドポイントは`fetchPolicy: "no-cache"`を使用して常に最新データを取得