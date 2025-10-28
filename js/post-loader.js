/**
 * 게시글 로더
 * 마크다운 파일 로드 및 HTML 변환, Giscus 댓글 통합
 */

// DOM 요소들
const postLoading = document.getElementById('post-loading');
const postContent = document.getElementById('post-content');
const postError = document.getElementById('post-error');
const commentsSection = document.getElementById('comments-section');

// 게시글 로더 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 게시글 로더 초기화 중...');

    // URL 파라미터에서 파일명 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const filename = urlParams.get('file');

    if (!filename) {
        showPostError('게시글 파일이 지정되지 않았습니다.');
        return;
    }

    // 게시글 로드
    loadPost(filename);

    console.log('✅ 게시글 로더 초기화 완료');
});

// 게시글 로드
async function loadPost(filename) {
    try {
        console.log(`📖 게시글 로드 중: ${filename}`);

        // 마크다운 파일 로드
        const response = await fetch(`./pages/${filename}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const markdown = await response.text();

        // 마크다운 파싱 및 HTML 변환
        const postData = parseMarkdown(markdown);

        // 페이지 메타데이터 업데이트
        updatePageMeta(postData, filename);

        // 게시글 표시
        displayPost(postData);

        // Giscus 댓글 로드
        loadGiscus(filename);

        console.log(`✅ 게시글 로드 완료: ${postData.title}`);

    } catch (error) {
        console.error('❌ 게시글 로드 실패:', error);
        showPostError('게시글을 불러오는 중 오류가 발생했습니다.');
    }
}

// 마크다운 파싱
function parseMarkdown(markdown) {
    // Front Matter 파싱
    const frontMatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    let metadata = {};
    let content = markdown;

    if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1];
        content = frontMatterMatch[2];

        // Front Matter 라인 파싱
        const lines = frontMatter.split('\n');
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();

                // 따옴표 제거
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                // 배열 파싱 (tags)
                if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                    try {
                        value = JSON.parse(value);
                    } catch {
                        value = value.slice(1, -1)
                            .split(',')
                            .map(tag => tag.trim().replace(/^['"]|['"]$/g, ''));
                    }
                }

                metadata[key] = value;
            }
        });
    }

    // 마크다운을 HTML로 변환
    const htmlContent = marked.parse(content);

    return {
        title: metadata.title || '제목 없음',
        date: metadata.date || '',
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        category: metadata.category || '',
        description: metadata.description || '',
        content: htmlContent,
        metadata: metadata
    };
}

// 페이지 메타데이터 업데이트
function updatePageMeta(postData, filename) {
    // 페이지 제목 업데이트
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = postData.title;
    }

    // 문서 제목 업데이트
    document.title = `${postData.title} - 나의 블로그`;

    // 메타 설명 업데이트
    const pageDescription = document.getElementById('page-description');
    if (pageDescription) {
        pageDescription.content = postData.description || `${postData.title} - 나의 블로그`;
    }

    console.log('📋 페이지 메타데이터 업데이트 완료');
}

// 게시글 표시
function displayPost(postData) {
    // 로딩 숨기기
    if (postLoading) postLoading.style.display = 'none';

    // 게시글 표시
    if (postContent) postContent.style.display = 'block';

    // 게시글 HTML 생성
    const postHTML = createPostHTML(postData);
    postContent.innerHTML = postHTML;

    // 코드 하이라이팅 적용
    highlightCodeBlocks();

    console.log('📝 게시글 표시 완료');
}

// 게시글 HTML 생성
function createPostHTML(postData) {
    const tagsHTML = postData.tags.map(tag =>
        `<span class="post-tag">${escapeHtml(tag)}</span>`
    ).join('');

    return `
        <header class="post-header">
            <h1 class="post-title">${escapeHtml(postData.title)}</h1>
            <div class="post-meta">
                ${postData.date ? `<span class="post-date">${formatDate(postData.date)}</span>` : ''}
                ${tagsHTML ? `<div class="post-tags">${tagsHTML}</div>` : ''}
            </div>
        </header>

        <div class="post-body">
            ${postData.content}
        </div>
    `;
}

// 코드 블록 하이라이팅
function highlightCodeBlocks() {
    // Prism.js가 로드되었는지 확인
    if (typeof Prism !== 'undefined') {
        // 모든 코드 블록 하이라이팅
        Prism.highlightAll();

        console.log('🎨 코드 하이라이팅 적용 완료');
    } else {
        console.warn('⚠️ Prism.js가 로드되지 않았습니다.');
    }
}

// Giscus 댓글 로드
function loadGiscus(filename) {
    if (!commentsSection) return;

    // Giscus 스크립트 생성
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;

    // Giscus 설정 (실제 값으로 변경 필요)
    script.setAttribute('data-repo', 'your-github-username/your-github-username.github.io');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // 실제 repo-id로 변경
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // 실제 category-id로 변경
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');

    // 댓글 섹션에 스크립트 추가
    const giscusContainer = document.getElementById('giscus-comments');
    if (giscusContainer) {
        giscusContainer.appendChild(script);
        commentsSection.style.display = 'block';

        console.log('💬 Giscus 댓글 로드 완료');
    } else {
        console.warn('⚠️ Giscus 컨테이너를 찾을 수 없습니다.');
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.warn('날짜 포맷팅 오류:', dateString, error);
        return dateString;
    }
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 게시글 에러 표시
function showPostError(message) {
    if (postLoading) postLoading.style.display = 'none';
    if (postContent) postContent.style.display = 'none';
    if (postError) {
        postError.style.display = 'block';
        const errorTitle = postError.querySelector('h2');
        const errorText = postError.querySelector('p');

        if (errorTitle) errorTitle.textContent = '게시글을 찾을 수 없습니다';
        if (errorText) errorText.textContent = message;
    }

    console.error('🚨 게시글 에러:', message);
}

// 초기화 함수 (외부에서 호출 가능)
window.PostLoader = {
    loadPost: loadPost,
    highlightCode: highlightCodeBlocks
};
