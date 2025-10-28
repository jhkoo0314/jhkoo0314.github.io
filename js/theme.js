/**
 * 블로그 테마 관리 (다크/라이트 모드)
 * 로컬 스토리지에 테마 상태 저장
 */

// 테마 설정
const THEME_KEY = 'blog_theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

// DOM 요소들
let themeToggle, themeIcon;

// 테마 관리 초기화
document.addEventListener('DOMContentLoaded', function() {
    themeToggle = document.getElementById('theme-toggle');
    themeIcon = document.querySelector('.theme-icon');

    // 저장된 테마 로드 또는 시스템 테마 감지
    const savedTheme = localStorage.getItem(THEME_KEY);
    const systemTheme = getSystemTheme();
    const initialTheme = savedTheme || systemTheme;

    // 초기 테마 적용
    setTheme(initialTheme, false); // 애니메이션 없이 적용

    // 이벤트 리스너 설정
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 시스템 테마 변경 감지 (미디어 쿼리)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);

    console.log(`🎨 테마 초기화: ${initialTheme}`);
});

// 테마 토글
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;

    setTheme(newTheme, true);
}

// 테마 설정
function setTheme(theme, animate = true) {
    // data-theme 속성 설정
    document.documentElement.setAttribute('data-theme', theme);

    // 로컬 스토리지에 저장
    localStorage.setItem(THEME_KEY, theme);

    // 토글 버튼 아이콘 업데이트
    updateThemeIcon(theme);

    // 애니메이션 효과 (선택적)
    if (animate) {
        addThemeTransition();
    }

    console.log(`🎨 테마 변경: ${theme}`);
}

// 현재 테마 가져오기
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
}

// 시스템 테마 감지
function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEME_DARK
        : THEME_LIGHT;
}

// 시스템 테마 변경 처리
function handleSystemThemeChange(e) {
    // 사용자가 수동으로 테마를 설정한 경우 시스템 테마 변경 무시
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return;

    const newSystemTheme = e.matches ? THEME_DARK : THEME_LIGHT;
    setTheme(newSystemTheme, true);
}

// 테마 아이콘 업데이트
function updateThemeIcon(theme) {
    if (!themeIcon) return;

    if (theme === THEME_DARK) {
        themeIcon.textContent = '☀️'; // 해 (라이트 모드로 전환)
        themeToggle.setAttribute('aria-label', '라이트 모드로 전환');
    } else {
        themeIcon.textContent = '🌙'; // 달 (다크 모드로 전환)
        themeToggle.setAttribute('aria-label', '다크 모드로 전환');
    }
}

// 테마 전환 애니메이션
function addThemeTransition() {
    // 부드러운 전환을 위한 임시 클래스 추가
    document.body.classList.add('theme-transitioning');

    // 애니메이션 종료 후 클래스 제거
    setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
    }, 300);
}

// 테마 관련 유틸리티 함수들

// 테마가 다크인지 확인
function isDarkTheme() {
    return getCurrentTheme() === THEME_DARK;
}

// 테마가 라이트인지 확인
function isLightTheme() {
    return getCurrentTheme() === THEME_LIGHT;
}

// 테마 강제 설정 (특정 상황에서 사용)
function forceTheme(theme) {
    setTheme(theme, false);
}

// 테마 초기화 (저장된 테마 삭제)
function resetTheme() {
    localStorage.removeItem(THEME_KEY);
    const systemTheme = getSystemTheme();
    setTheme(systemTheme, true);
}

// 내보내기 (외부에서 사용 가능)
window.BlogTheme = {
    setTheme: setTheme,
    getCurrentTheme: getCurrentTheme,
    toggleTheme: toggleTheme,
    isDarkTheme: isDarkTheme,
    isLightTheme: isLightTheme,
    forceTheme: forceTheme,
    resetTheme: resetTheme,
    THEME_LIGHT: THEME_LIGHT,
    THEME_DARK: THEME_DARK
};
