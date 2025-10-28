/**
 * 블로그 검색 기능
 * 클라이언트 사이드 검색 구현
 */

// 검색 상태 관리
let searchTimeout = null;
const SEARCH_DELAY = 300; // 검색 딜레이 (ms)

// 로컬 변수들 (전역 충돌 방지)
let localSearchInput, localSearchClear;

// 검색 기능 초기화
document.addEventListener('DOMContentLoaded', function() {
    localSearchInput = document.getElementById('search-input');
    localSearchClear = document.getElementById('search-clear');

    if (localSearchInput) {
        // 디바운스된 검색 이벤트
        localSearchInput.addEventListener('input', debounceSearch);

        // 엔터 키로 검색
        localSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performInstantSearch();
            }

            // ESC 키로 검색 초기화
            if (e.key === 'Escape') {
                clearSearchInput();
            }
        });
    }

    if (localSearchClear) {
        localSearchClear.addEventListener('click', clearSearchInput);
    }

    console.log('🔍 검색 기능 초기화 완료');
});

// 디바운스된 검색 (성능 최적화)
function debounceSearch(e) {
    const query = e.target.value;

    // 검색어 초기화 버튼 표시/숨김
    updateClearButton(query);

    // 이전 타이머 취소
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // 새로운 타이머 설정
    searchTimeout = setTimeout(() => {
        performInstantSearch(query);
    }, SEARCH_DELAY);
}

// 즉시 검색 수행
function performInstantSearch(query) {
    if (typeof query === 'undefined') {
        query = localSearchInput ? localSearchInput.value : '';
    }

    query = query.toLowerCase().trim();

    if (!query) {
        // 검색어가 없으면 현재 필터 적용
        if (window.BlogApp && window.BlogApp.applyCurrentFilter) {
            window.BlogApp.applyCurrentFilter();
        }
        return;
    }

    console.log(`🔍 검색 실행: "${query}"`);

    // 검색 수행 (외부 함수 호출)
    if (window.BlogApp && window.BlogApp.searchPosts) {
        window.BlogApp.searchPosts(query);
    }
}

// 검색어 초기화
function clearSearchInput() {
    if (localSearchInput) {
        localSearchInput.value = '';
        localSearchInput.focus();
    }

    updateClearButton('');

    // 검색 초기화
    if (window.BlogApp && window.BlogApp.clearSearch) {
        window.BlogApp.clearSearch();
    }
}

// 검색어 초기화 버튼 상태 업데이트
function updateClearButton(query) {
    if (localSearchClear) {
        localSearchClear.style.display = query ? 'block' : 'none';
    }
}

// 고급 검색 기능들 (추후 확장 가능)

// 검색어 하이라이트
function highlightSearchTerms(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// 정규식 이스케이프
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 검색 결과 통계
function getSearchStats(query, results) {
    return {
        query: query,
        totalResults: results.length,
        hasResults: results.length > 0
    };
}

// 검색 히스토리 관리 (로컬 스토리지)
const SearchHistory = {
    KEY: 'blog_search_history',
    MAX_ITEMS: 10,

    save: function(query) {
        if (!query.trim()) return;

        try {
            const history = this.get();
            const filtered = history.filter(item => item !== query);
            filtered.unshift(query);

            const limited = filtered.slice(0, this.MAX_ITEMS);
            localStorage.setItem(this.KEY, JSON.stringify(limited));
        } catch (error) {
            console.warn('검색 히스토리 저장 실패:', error);
        }
    },

    get: function() {
        try {
            const history = localStorage.getItem(this.KEY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.warn('검색 히스토리 로드 실패:', error);
            return [];
        }
    },

    clear: function() {
        try {
            localStorage.removeItem(this.KEY);
        } catch (error) {
            console.warn('검색 히스토리 삭제 실패:', error);
        }
    }
};

// 검색 제안 기능 (추후 구현)
function getSearchSuggestions(query) {
    // 현재는 빈 배열 반환 (추후 구현 가능)
    return [];
}

// 내보내기 (다른 모듈에서 사용 가능)
window.BlogSearch = {
    performSearch: performInstantSearch,
    clearSearch: clearSearchInput,
    highlightTerms: highlightSearchTerms,
    getStats: getSearchStats,
    history: SearchHistory
};
