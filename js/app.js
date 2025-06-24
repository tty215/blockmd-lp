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