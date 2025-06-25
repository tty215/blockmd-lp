/**
 * Block.md ウェブサイトのメインスクリプト
 */
import { translations } from './translations.js';
import { LanguageManager } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  // アプリケーションの初期化
  initApp();
});

/**
 * アプリケーションの初期化
 */
function initApp() {
  // 言語マネージャーの初期化
  const languageManager = new LanguageManager();
  languageManager.loadTranslations(translations);
  languageManager.init();
  languageManager.initLanguageSwitcher();
  
  // モバイルメニューの初期化
  initMobileMenu();
  
  // スクロールアニメーションの初期化
  initScrollAnimation();
  
  // フローティングヘッダーの初期化
  initFloatingHeader();
  
  // ヒーローセクションフェードインの初期化
  initHeroFadeIn();
}

/**
 * モバイルメニューの初期化
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const header = document.querySelector('header');
  
  if (menuToggle && header) {
    menuToggle.addEventListener('click', () => {
      header.classList.toggle('mobile-menu-open');
    });
    
    // メニュー項目をクリックしたらメニューを閉じる
    const menuItems = document.querySelectorAll('nav a');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        header.classList.remove('mobile-menu-open');
      });
    });
  }
}

/**
 * フローティングヘッダーの初期化
 */
function initFloatingHeader() {
  const header = document.querySelector('header');
  let scrollTimeout;
  
  if (!header) return;
  
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const featuresSection = document.querySelector('#features');
    
    if (!featuresSection) return;
    
    // featuresセクションの位置を取得
    const featuresTop = featuresSection.offsetTop;
    const triggerPoint = featuresTop - window.innerHeight * 0.3; // ビューポートの30%手前でトリガー
    
    // スクロール位置がトリガーポイントを過ぎた場合
    if (scrollTop > triggerPoint) {
      header.classList.add('visible');
    } else {
      header.classList.remove('visible');
    }
  };
  
  // スクロールイベントリスナーを追加（パフォーマンス向上のためrequestAnimationFrameを使用）
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(handleScroll);
  });
  
  // 初期状態でも実行
  handleScroll();
}

/**
 * ヒーローセクションフェードインの初期化
 */
function initHeroFadeIn() {
  const heroText = document.querySelector('.hero-text');
  const heroImage = document.querySelector('.hero-image');
  const fullscreenTitle = document.getElementById('fullscreenTitle');
  
  if (!heroText || !heroImage || !fullscreenTitle) return;
  
  const startAnimation = () => {
    // スクロールを無効にする
    document.body.classList.add('fullscreen-title-active');
    
    // 初期読み込み用のオーバーレイを非表示
    document.body.classList.add('content-loaded');
    
    // 第1段階：全画面タイトルを表示
    setTimeout(() => {
      fullscreenTitle.classList.add('show');
    }, 300);
    
    // 第2段階：全画面タイトルをフェードアウト後、通常UIをフェードイン
    setTimeout(() => {
      fullscreenTitle.classList.remove('show');
      fullscreenTitle.classList.add('hide');
      
      // スクロールを再有効化
      document.body.classList.remove('fullscreen-title-active');
      
      // 通常のヒーローコンテンツをフェードイン
      setTimeout(() => {
        heroText.classList.add('fade-in');
        heroImage.classList.add('fade-in');
      }, 400);
    }, 2500); // 全画面タイトルを2.5秒表示
  };
  
  // ページロード完了後にアニメーション開始
  window.addEventListener('load', startAnimation);
  
  // ページがすでに読み込まれている場合（キャッシュされた場合）
  if (document.readyState === 'complete') {
    startAnimation();
  }
}

/**
 * スクロールアニメーションの初期化
 */
function initScrollAnimation() {
  // スクロール時のアニメーション
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('visible');
      }
    });
  };
  
  // スクロールイベントリスナーを追加
  window.addEventListener('scroll', animateOnScroll);
  
  // 初期表示時にもアニメーションを実行
  animateOnScroll();
  
  // スムーススクロール
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}