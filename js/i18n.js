/**
 * Block.md ウェブサイトの多言語対応モジュール
 */
export class LanguageManager {
  /**
   * 言語マネージャーを初期化
   * @param {string} defaultLang - デフォルト言語コード
   */
  constructor(defaultLang = 'ja') {
    this.currentLang = defaultLang;
    this.translations = {};
    this.DEFAULT_LANG = 'ja';
    this.SUPPORTED_LANGS = ['en', 'ja'];
  }

  /**
   * 言語設定を初期化
   */
  init() {
    const initialLang = this.determineInitialLanguage();
    this.switchLanguage(initialLang);
  }

  /**
   * 初期言語を決定
   * @returns {string} 決定された言語コード
   */
  determineInitialLanguage() {
    // 1. ローカルストレージをチェック
    const savedLang = this.getLanguagePreference();
    if (savedLang && this.isLanguageSupported(savedLang)) {
      return savedLang;
    }

    // 2. ブラウザ言語を検出
    const browserLang = this.detectBrowserLanguage();
    return browserLang;
  }

  /**
   * 言語がサポートされているかチェック
   * @param {string} lang - 言語コード
   * @returns {boolean} サポートされている場合はtrue
   */
  isLanguageSupported(lang) {
    return this.SUPPORTED_LANGS.includes(lang);
  }

  /**
   * ブラウザの言語設定を検出
   * @returns {string} 検出された言語コード
   */
  detectBrowserLanguage() {
    const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
    
    for (const browserLang of browserLanguages) {
      const normalizedLang = browserLang.toLowerCase();
      
      // 完全一致をチェック
      if (this.SUPPORTED_LANGS.includes(normalizedLang)) {
        return normalizedLang;
      }
      
      // 言語部分だけを抽出してチェック
      const primaryLang = normalizedLang.split('-')[0];
      if (this.SUPPORTED_LANGS.includes(primaryLang)) {
        return primaryLang;
      }
    }
    
    return this.DEFAULT_LANG;
  }

  /**
   * ローカルストレージから言語設定を取得
   * @returns {string|null} 保存されている言語コード
   */
  getLanguagePreference() {
    try {
      return localStorage.getItem('blockmd_language');
    } catch (error) {
      console.error('Failed to get language preference:', error);
      return null;
    }
  }

  /**
   * 翻訳リソースをロード
   * @param {Object} translations - 翻訳データオブジェクト
   */
  loadTranslations(translations) {
    this.translations = translations;
  }

  /**
   * 言語を切り替え
   * @param {string} lang - 切り替える言語コード
   */
  switchLanguage(lang) {
    if (!this.isLanguageSupported(lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }
    
    this.currentLang = lang;
    this.updatePageContent();
    this.updateLanguageSwitcherUI();
    
    // HTML lang属性を更新
    document.documentElement.lang = lang;
    
    // 言語設定を保存
    this.saveLanguagePreference(lang);
  }

  /**
   * 言語設定をローカルストレージに保存
   * @param {string} lang - 保存する言語コード
   */
  saveLanguagePreference(lang) {
    try {
      localStorage.setItem('blockmd_language', lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }

  /**
   * ページコンテンツを更新
   */
  updatePageContent() {
    // テキストコンテンツの翻訳
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translatedText = this.translate(key);
      if (translatedText) {
        element.textContent = translatedText;
      }
    });

    // プレースホルダーの翻訳
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translatedText = this.translate(key);
      if (translatedText) {
        element.placeholder = translatedText;
      }
    });

    // ページタイトルの更新
    const pageTitle = this.translate('page.title');
    if (pageTitle) {
      document.title = pageTitle;
    }
  }

  /**
   * 言語切り替えUIを更新
   */
  updateLanguageSwitcherUI() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(button => {
      const lang = button.getAttribute('data-lang');
      if (lang === this.currentLang) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  /**
   * 翻訳キーから翻訳テキストを取得
   * @param {string} key - 翻訳キー（ドット表記）
   * @returns {string} 翻訳されたテキスト
   */
  translate(key) {
    try {
      const keys = key.split('.');
      let value = this.translations;
      
      for (const k of keys) {
        value = value[k];
        if (!value) break;
      }
      
      if (value && value[this.currentLang]) {
        return value[this.currentLang];
      }
      
      // フォールバック：デフォルト言語を使用
      if (value && value[this.DEFAULT_LANG]) {
        console.warn(`Missing translation for key "${key}" in "${this.currentLang}". Using default language.`);
        return value[this.DEFAULT_LANG];
      }
      
      console.error(`Translation key "${key}" not found.`);
      return key;
    } catch (error) {
      console.error(`Error translating key "${key}":`, error);
      return key;
    }
  }

  /**
   * 言語切り替えボタンのイベントリスナーを初期化
   */
  initLanguageSwitcher() {
    const languageButtons = document.querySelectorAll('.lang-btn');
    languageButtons.forEach(button => {
      const lang = button.getAttribute('data-lang');
      button.addEventListener('click', () => {
        this.switchLanguage(lang);
      });
    });
  }
}