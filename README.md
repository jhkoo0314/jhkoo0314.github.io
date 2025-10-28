# 나의 블로그

HTML, CSS, Vanilla JavaScript로 만든 정적 블로그입니다. GitHub Pages로 무료 호스팅됩니다.

## 🚀 빠른 시작

### 1. 저장소 설정

1. 이 저장소를 **Fork** 하거나 **Clone** 합니다
2. 저장소 이름을 `{your-github-username}.github.io`로 변경합니다
3. `main` 브랜치로 푸시합니다

### 2. Giscus 댓글 설정 (선택사항)

GitHub Discussions을 이용한 댓글을 사용하려면:

1. 저장소 **Settings** > **General** > **Features**에서 **Discussions** 활성화
2. https://github.com/apps/giscus 설치
3. https://giscus.app/에서 설정값 가져오기
4. `js/post-loader.js`의 `loadGiscus()` 함수에서 설정값 업데이트

### 3. 첫 게시글 작성

```bash
# pages/ 폴더에 마크다운 파일 생성
touch pages/my-first-post.md
```

마크다운 파일 형식:
```markdown
---
title: '게시글 제목'
date: 2025-01-26
tags: ['태그1', '태그2']
category: '카테고리'
description: '게시글 설명'
---

# 제목

내용...
```

### 4. 배포

`main` 브랜치에 푸시하면 자동으로 GitHub Pages에 배포됩니다.

## 📁 프로젝트 구조

```
/
├── .nojekyll              # Jekyll 비활성화
├── index.html             # 메인 페이지
├── post.html              # 게시글 상세 페이지
├── posts.json             # 게시글 메타데이터 (자동 생성)
├── css/
│   ├── style.css          # 메인 스타일
│   └── prism.css          # 코드 하이라이팅 테마
├── js/
│   ├── app.js            # 메인 애플리케이션 로직
│   ├── post-loader.js    # 마크다운 로딩 및 파싱
│   ├── search.js         # 검색 기능
│   └── theme.js          # 테마 토글
├── pages/                # 마크다운 게시글 폴더
│   └── example.md        # 예시 게시글
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Actions 워크플로우
```

## ✨ 주요 기능

- **마크다운 지원**: Front Matter를 이용한 메타데이터 관리
- **반응형 디자인**: 모바일 친화적 레이아웃
- **다크/라이트 모드**: 자동/수동 테마 전환
- **실시간 검색**: 클라이언트 사이드 검색
- **태그 필터링**: 게시글 태그별 필터링
- **코드 하이라이팅**: Prism.js 기반 구문 강조
- **댓글 시스템**: Giscus (GitHub Discussions)
- **자동 배포**: GitHub Actions CI/CD

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Markdown Parser**: Marked.js
- **Code Highlighting**: Prism.js
- **Comments**: Giscus
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📝 게시글 작성 가이드

### Front Matter 형식

```yaml
---
title: '게시글 제목'
date: 2025-01-26
tags: ['JavaScript', 'Web']
category: 'Development'
description: '간단한 설명'
---
```

### 지원되는 마크다운 기능

- 헤더 (# ## ###)
- **볼드**와 *이탤릭*
- `인라인 코드`와 코드 블록
- [링크](url)
- 이미지 ![alt](url)
- 목록 (-, 1. 2. 3.)
- 인용문 (>)
- 테이블

## 🎨 커스터마이징

### 색상 테마 변경

`css/style.css`의 CSS 변수 수정:

```css
:root {
  --bg-primary: #ffffff;     /* 메인 배경색 */
  --text-primary: #212529;   /* 메인 텍스트 */
  --accent-color: #007bff;   /* 강조색 */
}
```

### 폰트 변경

Google Fonts에서 원하는 폰트를 선택하고 `index.html`과 `post.html`의 link 태그 수정.

## 🚀 배포 워크플로우

1. `pages/` 폴더에 `.md` 파일 작성
2. Git에 커밋 & 푸시
3. GitHub Actions가 자동으로 `posts.json` 생성
4. GitHub Pages에 배포
5. `https://{username}.github.io`에서 확인

## 🤝 기여

이 블로그는 오픈소스입니다. 개선사항이나 버그 수정은 언제든 환영합니다!

## 📄 라이선스

MIT License - 자유롭게 사용하세요.
