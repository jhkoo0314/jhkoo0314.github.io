/**
 * 블로그 메인 애플리케이션
 * 게시글 목록 로드 및 표시
 */

// 전역 변수
let allPosts = [];
let filteredPosts = [];
let currentFilter = 'all';

// DOM 요소들
const postsLoading = document.getElementById('posts-loading');
const postsList = document.getElementById('posts-list');
const noPosts = document.getElementById('no-posts');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');

// 앱 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('블로그 앱 초기화 중...');

    // 게시글 데이터 로드
    loadPosts();

    // 이벤트 리스너 설정
    setupEventListeners();

    // 초기 로딩 로그
    console.log('✅ 블로그 앱 초기화 완료');
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 입력 이벤트
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                clearSearch();
            }
        });
    }

    // 검색 초기화 버튼
    if (searchClear) {
        searchClear.addEventListener('click', clearSearch);
    }

    // 필터 버튼 이벤트
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            const filter = e.target.dataset.filter;
            setActiveFilter(filter);
        }
    });
}

// 게시글 데이터 로드
async function loadPosts() {
    try {
        console.log('📄 게시글 데이터 로드 중...');

        const response = await fetch('./posts.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        allPosts = data || [];
        filteredPosts = [...allPosts];

        console.log(`✅ ${allPosts.length}개의 게시글 로드 완료`);

        // 게시글 표시
        displayPosts(filteredPosts);

        // 태그 필터 생성
        generateTagFilters();

    } catch (error) {
        console.error('❌ 게시글 로드 실패:', error);
        showError('게시글을 불러오는 중 오류가 발생했습니다.');
    }
}

// 게시글 표시
function displayPosts(posts) {
    // 로딩 숨기기
    if (postsLoading) postsLoading.style.display = 'none';

    if (posts.length === 0) {
        // 게시글이 없는 경우
        if (postsList) postsList.style.display = 'none';
        if (noPosts) noPosts.style.display = 'block';
        return;
    }

    // 게시글 목록 표시
    if (postsList) postsList.style.display = 'grid';
    if (noPosts) noPosts.style.display = 'none';

    // 게시글 HTML 생성
    const postsHTML = posts.map(post => createPostCard(post)).join('');
    postsList.innerHTML = postsHTML;

    console.log(`📋 ${posts.length}개의 게시글 표시`);
}

// 게시글 카드 HTML 생성
function createPostCard(post) {
    const tagsHTML = post.tags.map(tag =>
        `<span class="post-tag">${tag}</span>`
    ).join('');

    return `
        <a href="post.html?file=${encodeURIComponent(post.file)}" class="post-card">
            <h2 class="post-title">${escapeHtml(post.title)}</h2>
            <div class="post-meta">
                <span class="post-date">${formatDate(post.date)}</span>
                <div class="post-tags">${tagsHTML}</div>
            </div>
            <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
            <span class="post-read-more">더 읽기 →</span>
        </a>
    `;
}

// 태그 필터 생성
function generateTagFilters() {
    const tagFilterContainer = document.querySelector('.tag-filter');
    if (!tagFilterContainer) return;

    // 모든 태그 수집
    const allTags = new Set();
    allPosts.forEach(post => {
        post.tags.forEach(tag => allTags.add(tag));
    });

    // 태그 버튼 생성
    const tagButtons = Array.from(allTags).sort().map(tag => {
        const count = allPosts.filter(post => post.tags.includes(tag)).length;
        return `<button class="filter-btn" data-filter="${tag}">${tag} (${count})</button>`;
    }).join('');

    // 기존 버튼들 (전체 버튼 제외) 제거 후 새 버튼들 추가
    const allButton = tagFilterContainer.querySelector('[data-filter="all"]');
    tagFilterContainer.innerHTML = allButton.outerHTML + tagButtons;

    console.log(`🏷️ ${allTags.size}개의 태그 필터 생성`);
}

// 검색 처리
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    // 검색어 초기화 버튼 표시/숨김
    if (searchClear) {
        searchClear.style.display = query ? 'block' : 'none';
    }

    // 검색 실행
    performSearch(query);
}

// 검색 수행
function performSearch(query) {
    if (!query) {
        // 검색어가 없으면 현재 필터 적용
        applyCurrentFilter();
        return;
    }

    // 검색어로 필터링
    filteredPosts = allPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const contentMatch = post.excerpt.toLowerCase().includes(query);
        const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
        const categoryMatch = post.category && post.category.toLowerCase().includes(query);

        return titleMatch || contentMatch || tagsMatch || categoryMatch;
    });

    console.log(`🔍 "${query}" 검색 결과: ${filteredPosts.length}개`);

    displayPosts(filteredPosts);
}

// 검색 초기화
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    if (searchClear) {
        searchClear.style.display = 'none';
    }

    // 현재 필터 재적용
    applyCurrentFilter();
}

// 필터 설정
function setActiveFilter(filter) {
    currentFilter = filter;

    // 버튼 상태 업데이트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // 필터 적용
    applyCurrentFilter();

    console.log(`🏷️ 필터 적용: ${filter}`);
}

// 현재 필터 적용
function applyCurrentFilter() {
    if (currentFilter === 'all') {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post =>
            post.tags.includes(currentFilter)
        );
    }

    // 검색어가 있다면 검색도 함께 적용
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
        filteredPosts = filteredPosts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(query);
            const contentMatch = post.excerpt.toLowerCase().includes(query);
            const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
            const categoryMatch = post.category && post.category.toLowerCase().includes(query);

            return titleMatch || contentMatch || tagsMatch || categoryMatch;
        });
    }

    displayPosts(filteredPosts);
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

// 에러 표시
function showError(message) {
    console.error('🚨 오류:', message);

    if (postsLoading) postsLoading.style.display = 'none';
    if (postsList) postsList.style.display = 'none';
    if (noPosts) {
        noPosts.style.display = 'block';
        noPosts.innerHTML = `<p>${message}</p>`;
    }
}

// 초기화 함수 (외부에서 호출 가능)
window.BlogApp = {
    refreshPosts: loadPosts,
    searchPosts: performSearch,
    setFilter: setActiveFilter
};
