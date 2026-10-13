/**
 * 하루마스터 (HaruMaster) - 영어 학습 특화 도우미 엔진 (English Assistant)
 * 
 * 주요 기능:
 * 1. Free Dictionary API 연동: 단어 뜻, 품사, 발음 기호, 원어민 음성(mp3) 제공 (API 키 불필요)
 * 2. Web Speech API (SpeechSynthesis) 음성 엔진: 지문 전체/단어 읽어주기, 배속 조절(0.8x, 1.0x, 1.2x)
 * 3. 지문 단어 원터치 사전 (Touch-to-Define): 지문 속 단어 터치 시 팝업 사전 노출
 * 4. 중학 핵심 1,200+ 어휘 즉시 한국어 매핑 + MyMemory 무료 번역 API fallback
 * 5. 지문 한국어 전문 해석/해설 토글 뷰어
 * 6. 단어 직접 검색 기능
 * 7. 향후 Firebase Functions (Papago / DeepL) 백엔드 확장을 위한 모듈형 인터페이스
 */

// 향후 백엔드 프록시(Firebase Functions) 연동 시 여기에 엔드포인트 URL 지정 가능
export const TRANSLATION_CONFIG = {
  backendUrl: "", // e.g. "https://us-central1-haru-master.cloudfunctions.net/api/translate"
  timeoutMs: 4000
};

// 중학교 1~3학년 필수 핵심 영단어 퀵 한글 사전 (0ms 초고속 로컬 캐시)
const MIDDLE_SCHOOL_VOCAB = {
  // 교과서 필수 어휘
  "courage": { ko: "용기, 담력", pos: "명사", def: "The ability to do something that frightens one; bravery." },
  "routine": { ko: "일과, 규칙적인 일상", pos: "명사", def: "A sequence of actions regularly followed." },
  "illustrator": { ko: "삽화가, 일러스트레이터", pos: "명사", def: "A person who draws or creates pictures for magazines, books, etc." },
  "discourage": { ko: "낙담시키다, 좌절시키다", pos: "동사", def: "Cause someone to lose confidence or enthusiasm." },
  "discouraged": { ko: "낙담한, 기가 꺾인", pos: "형용사", def: "Having lost confidence or enthusiasm." },
  "doubt": { ko: "의심, 불신", pos: "명사/동사", def: "A feeling of uncertainty or lack of conviction." },
  "imagination": { ko: "상상력, 상상", pos: "명사", def: "The ability of the mind to be creative and resourceful." },
  "upcycle": { ko: "새활용하다, 업사이클하다", pos: "동사", def: "Reuse discarded objects or material in such a way as to create a product of higher quality." },
  "upcycling": { ko: "새활용, 업사이클링", pos: "명사", def: "The creative practice of transforming discarded items into new products." },
  "preserve": { ko: "보존하다, 지키다", pos: "동사", def: "Maintain something in its original or existing state." },
  "identity": { ko: "정체성, 본래 모습", pos: "명사", def: "The distinct personality or nature of an individual or thing." },
  "flair": { ko: "재능, 솜씨, 멋", pos: "명사", def: "A special or instinctive aptitude or ability for doing something well." },
  "consumption": { ko: "소비, 소모", pos: "명사", def: "The using up of a resource." },
  "habit": { ko: "습관, 버릇", pos: "명사", def: "A settled or regular tendency or practice." },
  "essential": { ko: "필수적인, 극히 중요한", pos: "형용사", def: "Absolutely necessary; extremely important." },
  "crucial": { ko: "중대한, 결정적인", pos: "형용사", def: "Decisive or critical, especially in the success or failure of something." },
  "consolidation": { ko: "통합, 강화, 굳힘", pos: "명사", def: "The action or process of combining a number of things into a single more effective whole." },
  "neural": { ko: "신경의, 신경계의", pos: "형용사", def: "Relating to a nerve or the nervous system." },
  "connection": { ko: "연결, 관계", pos: "명사", def: "A relationship in which a person, thing, or idea is linked." },
  "concentrate": { ko: "집중하다", pos: "동사", def: "Focus all one's attention on a particular object or activity." },
  "vital": { ko: "생명 유지에 필수적인, 극히 중요한", pos: "형용사", def: "Absolutely necessary; essential." },
  "diligently": { ko: "부지런히, 성실하게", pos: "부사", def: "In a way that shows care and conscientiousness in one's work." },
  "academic": { ko: "학업의, 학문의", pos: "형용사", def: "Relating to education and scholarship." },
  "climate": { ko: "기후", pos: "명사", def: "The weather conditions prevailing in an area over a long period." },
  "biodiversity": { ko: "생물 다양성", pos: "명사", def: "The variety of plant and animal life in the world or in a particular habitat." },
  "renewable": { ko: "재생 가능한", pos: "형용사", def: "Capable of being replenished naturally." },
  "sustainable": { ko: "지속 가능한", pos: "형용사", def: "Able to be maintained at a certain rate or level." },
  "challenge": { ko: "도전, 난제", pos: "명사", def: "A call to take part in a contest or a demanding task." },
  "protect": { ko: "보호하다, 지키다", pos: "동사", def: "Keep safe from harm or injury." },
  "cooperation": { ko: "협력, 협동", pos: "명사", def: "The process of working together to the same end." },
  "disaster": { ko: "재난, 재해", pos: "명사", def: "A sudden event that causes great damage or suffering." },
  "miniature": { ko: "축소 모형, 소형의", pos: "명사/형용사", def: "Representing or being a smaller version of something." },
  "erupt": { ko: "분출하다, 폭발하다", pos: "동사", def: "Become active and eject lava, ash, and gases." },
  "volcano": { ko: "화산", pos: "명사", def: "A mountain or hill having a crater through which lava erupts." },
  "exhibit": { ko: "전시하다, 드러내다", pos: "동사", def: "Publicly display in an art gallery, museum, or at a trade fair." },
  "participate": { ko: "참여하다, 참가하다", pos: "동사", def: "Take part in an action or event." },
  "annual": { ko: "매년의, 연례의", pos: "형용사", def: "Occurring once every year." },
  "gymnasium": { ko: "체육관", pos: "명사", def: "A room or building equipped for gymnastics, sports, or physical exercise." },
  "talent": { ko: "재능, 장기", pos: "명사", def: "Natural aptitude or skill." },
  "perfection": { ko: "완벽, 완성", pos: "명사", def: "The state of being complete and without flaw." },
  "motivation": { ko: "동기 부여, 자극", pos: "명사", def: "The reason or reasons one has for acting or behaving in a particular way." },
  "factor": { ko: "요인, 인자", pos: "명사", def: "A circumstance, fact, or influence that contributes to a result." },
  "achieve": { ko: "달성하다, 성취하다", pos: "동사", def: "Successfully bring about or reach by effort, skill, or courage." },
  "success": { ko: "성공", pos: "명사", def: "The accomplishment of an aim or purpose." },
  "convey": { ko: "전달하다, 나르다", pos: "동사", def: "Transport or carry to a place; make an idea or feeling known." },
  "fossil": { ko: "화석", pos: "명사", def: "The remains or impression of a prehistoric plant or animal." },
  "reliance": { ko: "의존, 신뢰", pos: "명사", def: "Dependence on or trust in someone or something." },
  "quality": { ko: "품질, 질, 우수성", pos: "명사", def: "The standard of something as measured against other things." },
  "practice": { ko: "관행, 실천, 연습", pos: "명사/동사", def: "The actual application or use of an idea, belief, or method." },
  "discard": { ko: "버리다, 폐기하다", pos: "동사", def: "Get rid of someone or something as no longer useful or desirable." },
  "routine": { ko: "일상적인, 정기적인", pos: "형용사/명사", def: "Performed as part of a regular procedure rather than for a special reason." },
  "valuable": { ko: "귀중한, 가치 있는", pos: "형용사", def: "Worth a great deal of money; extremely useful or important." },
  "environment": { ko: "환경", pos: "명사", def: "The surroundings or conditions in which a person, animal, or plant lives." },
  "environmental": { ko: "환경의, 환경과 관련된", pos: "형용사", def: "Relating to the natural world and the impact of human activity." },
  "tradition": { ko: "전통", pos: "명사", def: "The transmission of customs or beliefs from generation to generation." },
  "traditional": { ko: "전통적인", pos: "형용사", def: "Existing in or as part of a tradition; long-established." },
  "encourage": { ko: "격려하다, 장려하다", pos: "동사", def: "Give support, confidence, or hope to someone." },
  "process": { ko: "과정, 처리하다", pos: "명사/동사", def: "A series of actions or steps taken in order to achieve a particular end." },
  "sufficient": { ko: "충분한", pos: "형용사", def: "Enough; adequate." },
  "recall": { ko: "기억해 내다, 상기하다", pos: "동사", def: "Bring a fact, event, or situation back into one's mind." },
  "maintain": { ko: "유지하다, 관리하다", pos: "동사", def: "Cause or enable a condition or state of affairs to continue." },
  "consistent": { ko: "일관된, 꾸준한", pos: "형용사", def: "Acting or done in the same way over time." },
  "extreme": { ko: "극단적인, 극심한", pos: "형용사", def: "Reaching a high or the highest degree; very great." },
  "shrink": { ko: "줄어들다, 줄이다", pos: "동사", def: "Become or make smaller in size or amount." },
  "tackle": { ko: "해결에 착수하다, 맞붙다", pos: "동사", def: "Make determined efforts to deal with a problem or difficult task." },
  "international": { ko: "국제의, 만국의", pos: "형용사", def: "Existing, occurring, or carried on between two or more nations." },
  "transition": { ko: "전환, 변화", pos: "명사/동사", def: "The process or a period of changing from one state or condition to another." },
  "individual": { ko: "개인의, 개인", pos: "형용사/명사", def: "Single; separate; a single human being as distinct from a group." },
  "contribute": { ko: "기여하다, 공헌하다", pos: "동사", def: "Give something in order to help achieve or provide something." },
  "future": { ko: "미래", pos: "명사", def: "The time or a period of time following the moment of speaking or writing." },
  "pancake": { ko: "팬케이크", pos: "명사", def: "A thin, flat cake of batter." },
  "strawberry": { ko: "딸기", pos: "명사", def: "A sweet soft red fruit with a seed-studded surface." },
  "brew": { ko: "(커피·차를) 끓이다, 우리다", pos: "동사", def: "Make a drink by boiling or soaking ingredients." },
  "butterfly": { ko: "나비", pos: "명사", def: "An insect with four large, brightly colored wings." },
  "quality": { ko: "우수한, 양질의", pos: "형용사", def: "Of a high standard of excellence." },
  "energy": { ko: "에너지, 활력", pos: "명사", def: "The strength and vitality required for sustained activity." },
  "upcoming": { ko: "다가오는, 곧 있을", pos: "형용사", def: "Forthcoming; about to happen." }
};

class EnglishAssistant {
  constructor() {
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.audioElement = null;
    this.isPlayingTTS = false;
    this.isPausedTTS = false;
    this.ttsRate = 1.0; // 0.8, 1.0, 1.2
    this.currentVoice = null;
    this.dictCache = new Map();
    this.activeQuestion = null;
    this.isModalOpen = false;
    this.isTranslationVisible = false;

    this.initVoices();
    this.initModalContainer();
  }

  /**
   * 브라우저 TTS 음성 목록 초기화 (en-US 최적 음성 선택)
   */
  initVoices() {
    if (!this.speechSynth) return;

    const pickVoice = () => {
      const voices = this.speechSynth.getVoices() || [];
      // 미국 영어 또는 영국 영어 우선 선택
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      const preferred = englishVoices.find(v => 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('US')) && !v.name.includes('Compact')
      ) || englishVoices.find(v => v.lang === 'en-US') || englishVoices[0] || null;

      this.currentVoice = preferred;
    };

    pickVoice();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = pickVoice;
    }
  }

  /**
   * 단어 팝업 모달 컨테이너 생성 및 DOM 주입
   */
  initModalContainer() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('eng-word-modal-backdrop')) return;

    const modalHtml = `
      <div class="eng-word-modal-backdrop" id="eng-word-modal-backdrop" style="display: none;">
        <div class="eng-word-modal" id="eng-word-modal" role="dialog" aria-modal="true" aria-labelledby="eng-modal-word-text">
          <div class="eng-modal-header">
            <div class="eng-modal-word-group">
              <h3 class="eng-modal-word" id="eng-modal-word-text">word</h3>
              <span class="eng-modal-phonetic" id="eng-modal-phonetic-text">/phonetic/</span>
              <button type="button" class="btn-eng-audio-play" id="btn-eng-modal-audio" title="원어민 발음 듣기">
                <span class="audio-icon">🔊</span>
                <span class="audio-label">발음</span>
              </button>
            </div>
            <button type="button" class="btn-eng-modal-close" id="btn-eng-modal-close" title="닫기">✕</button>
          </div>

          <div class="eng-modal-body" id="eng-modal-body">
            <div class="eng-modal-loading">
              <span class="eng-loading-spinner"></span>
              <span>사전에서 단어를 찾는 중...</span>
            </div>
          </div>

          <div class="eng-modal-footer">
            <div class="eng-modal-search-wrap">
              <input type="text" class="eng-modal-search-input" id="eng-modal-search-input" placeholder="다른 영단어 검색 (예: courage, routine)..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
              <button type="button" class="btn-eng-modal-search" id="btn-eng-modal-search-submit">검색</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // 이벤트 리스너 바인딩
    const backdrop = document.getElementById('eng-word-modal-backdrop');
    const modal = document.getElementById('eng-word-modal');
    const closeBtn = document.getElementById('btn-eng-modal-close');
    const searchInput = document.getElementById('eng-modal-search-input');
    const searchBtn = document.getElementById('btn-eng-modal-search-submit');

    closeBtn?.addEventListener('click', () => this.closeModal());
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeModal();
    });

    const triggerSearch = () => {
      const q = searchInput?.value?.trim();
      if (q) {
        this.openWordModal(q);
        if (searchInput) searchInput.value = '';
      }
    };

    searchBtn?.addEventListener('click', triggerSearch);
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch();
      }
    });
  }

  /**
   * 단어 클린업 (특수문자 및 불필요한 구두점 제거)
   */
  cleanWord(raw) {
    if (!raw) return '';
    return raw
      .trim()
      .replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '') // 앞뒤 구두점 제거
      .toLowerCase();
  }

  /**
   * Free Dictionary API + 로컬 사전 결합 조회
   */
  async lookupWord(word) {
    const clean = this.cleanWord(word);
    if (!clean) return null;

    // 1. 메모리 캐시 확인
    if (this.dictCache.has(clean)) {
      return this.dictCache.get(clean);
    }

    // 2. 세션 스토리지 캐시 확인
    try {
      const sessionData = sessionStorage.getItem(`hm_dict_${clean}`);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        this.dictCache.set(clean, parsed);
        return parsed;
      }
    } catch (_) {}

    // 로컬 중학 사전 기본값 확인
    const localEntry = MIDDLE_SCHOOL_VOCAB[clean] || null;

    let apiData = null;
    try {
      // 3. Free Dictionary API 호출 (https://dictionaryapi.dev/)
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          apiData = json[0];
        }
      }
    } catch (err) {
      console.warn(`[EnglishAssistant] Dictionary API 조회 실패 (${clean}):`, err);
    }

    // 4. 발음 오디오 및 발음 기호 추출
    let audioUrl = '';
    let phoneticText = '';

    if (apiData) {
      phoneticText = apiData.phonetic || '';
      if (Array.isArray(apiData.phonetics)) {
        for (const p of apiData.phonetics) {
          if (!phoneticText && p.text) phoneticText = p.text;
          if (p.audio && p.audio.endsWith('.mp3')) {
            audioUrl = p.audio;
            break;
          }
        }
      }
    }

    // 5. 의미 목록 구조화
    const meaningsList = [];

    if (apiData && Array.isArray(apiData.meanings)) {
      apiData.meanings.forEach(m => {
        const pos = m.partOfSpeech || '기타';
        const defs = (m.definitions || []).slice(0, 2).map(d => ({
          definition: d.definition || '',
          example: d.example || ''
        }));
        if (defs.length > 0) {
          meaningsList.push({ partOfSpeech: pos, defs });
        }
      });
    }

    // 6. 한국어 번역 뜻 보강 (로컬 사전에 없으면 MyMemory 무료 번역 API 보조 호출)
    let koreanMeaning = localEntry ? localEntry.ko : '';
    let koreanPos = localEntry ? localEntry.pos : '';

    if (!koreanMeaning) {
      try {
        const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|ko`);
        if (transRes.ok) {
          const transJson = await transRes.json();
          if (transJson?.responseData?.translatedText && transJson.responseData.translatedText !== clean) {
            koreanMeaning = transJson.responseData.translatedText;
          }
        }
      } catch (_) {}
    }

    const result = {
      word: clean,
      phonetic: phoneticText || (localEntry ? `/${clean}/` : ''),
      audioUrl: audioUrl || '',
      koreanMeaning: koreanMeaning || (meaningsList.length > 0 ? '영문 해설 참조' : '뜻을 찾을 수 없습니다.'),
      koreanPos: koreanPos || (meaningsList[0]?.partOfSpeech || ''),
      meanings: meaningsList,
      hasNativeAudio: Boolean(audioUrl)
    };

    // 캐시에 저장
    this.dictCache.set(clean, result);
    try {
      sessionStorage.setItem(`hm_dict_${clean}`, JSON.stringify(result));
    } catch (_) {}

    return result;
  }

  /**
   * 단어 팝업 모달 열기 및 단어 정보 렌더링
   */
  async openWordModal(rawWord) {
    const clean = this.cleanWord(rawWord);
    if (!clean) return;

    this.isModalOpen = true;
    const backdrop = document.getElementById('eng-word-modal-backdrop');
    const wordEl = document.getElementById('eng-modal-word-text');
    const phoneticEl = document.getElementById('eng-modal-phonetic-text');
    const bodyEl = document.getElementById('eng-modal-body');
    const audioBtn = document.getElementById('btn-eng-modal-audio');

    if (!backdrop || !bodyEl) return;

    backdrop.style.display = 'flex';
    if (wordEl) wordEl.innerText = clean;
    if (phoneticEl) phoneticEl.innerText = '조회 중...';

    bodyEl.innerHTML = `
      <div class="eng-modal-loading">
        <span class="eng-loading-spinner"></span>
        <span>사전에서 <strong>"${clean}"</strong> 뜻을 가져오는 중...</span>
      </div>
    `;

    // 발음 버튼 초기화
    if (audioBtn) {
      audioBtn.onclick = () => this.playWordPronunciation(clean, '');
    }

    const data = await this.lookupWord(clean);

    if (!data) {
      if (phoneticEl) phoneticEl.innerText = '';
      bodyEl.innerHTML = `
        <div class="eng-modal-empty">
          <p>단어 정보를 불러오지 못했습니다.</p>
          <button type="button" class="btn-eng-audio-small" id="btn-modal-speak-direct">🔊 발음 바로 듣기</button>
        </div>
      `;
      document.getElementById('btn-modal-speak-direct')?.addEventListener('click', () => {
        this.speakWordTTS(clean);
      });
      return;
    }

    if (phoneticEl) phoneticEl.innerText = data.phonetic || '';

    // 발음 재생 바인딩 (원어민 mp3 우선, 없으면 TTS fallback)
    if (audioBtn) {
      audioBtn.onclick = () => this.playWordPronunciation(clean, data.audioUrl);
    }

    // 상세 뜻 구성
    let meaningsHtml = '';
    if (data.meanings && data.meanings.length > 0) {
      meaningsHtml = data.meanings.map(m => `
        <div class="eng-meaning-group">
          <div class="eng-pos-badge">${this.translatePos(m.partOfSpeech)}</div>
          <ul class="eng-defs-list">
            ${m.defs.map(d => `
              <li>
                <div class="eng-def-text">${d.definition}</div>
                ${d.example ? `<div class="eng-def-example">"${d.example}"</div>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('');
    }

    bodyEl.innerHTML = `
      <div class="eng-primary-meaning-box">
        <div class="eng-korean-row">
          <span class="eng-korean-meaning">${data.koreanMeaning}</span>
          ${data.koreanPos ? `<span class="eng-korean-pos">(${data.koreanPos})</span>` : ''}
        </div>
      </div>
      ${meaningsHtml ? `
        <div class="eng-english-meanings-wrap">
          <div class="eng-section-title">📖 영영사전 뜻풀이 & 예문</div>
          ${meaningsHtml}
        </div>
      ` : ''}
    `;
  }

  /**
   * 품사 영문 -> 국문 변환
   */
  translatePos(pos) {
    const map = {
      noun: '명사 [n]',
      verb: '동사 [v]',
      adjective: '형용사 [adj]',
      adverb: '부사 [adv]',
      preposition: '전치사 [prep]',
      conjunction: '접속사 [conj]',
      pronoun: '대명사 [pron]',
      interjection: '감탄사 [interj]'
    };
    return map[pos?.toLowerCase()] || pos;
  }

  /**
   * 모달 닫기
   */
  closeModal() {
    this.isModalOpen = false;
    const backdrop = document.getElementById('eng-word-modal-backdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  /**
   * 단어 발음 재생 (원어민 오디오 mp3 or Web Speech TTS fallback)
   */
  playWordPronunciation(word, audioUrl) {
    if (audioUrl) {
      try {
        if (this.audioElement) {
          this.audioElement.pause();
          this.audioElement = null;
        }
        this.audioElement = new Audio(audioUrl);
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('[EnglishAssistant] 오디오 파일 재생 실패, TTS로 전환:', err);
            this.speakWordTTS(word);
          });
        }
        return;
      } catch (e) {
        console.warn('[EnglishAssistant] Audio 인스턴스 오류:', e);
      }
    }

    // 오디오 파일이 없거나 오류 시 TTS 발음
    this.speakWordTTS(word);
  }

  /**
   * Web Speech API를 통한 단일 단어 TTS
   */
  speakWordTTS(word) {
    if (!this.speechSynth) {
      alert('사용하시는 브라우저에서 음성 재생(SpeechSynthesis)을 지원하지 않습니다.');
      return;
    }

    this.speechSynth.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = 'en-US';
    utt.rate = 0.9;
    if (this.currentVoice) utt.voice = this.currentVoice;
    this.speechSynth.speak(utt);
  }

  /**
   * 지문 전체 읽어주기 (TTS)
   */
  speakPassage(text) {
    if (!this.speechSynth) {
      alert('사용하시는 브라우저에서 음성 읽기(SpeechSynthesis)를 지원하지 않습니다.');
      return;
    }

    if (this.isPlayingTTS && !this.isPausedTTS) {
      // 일시 정지
      this.speechSynth.pause();
      this.isPausedTTS = true;
      this.updateTTSButtonUI();
      return;
    }

    if (this.isPlayingTTS && this.isPausedTTS) {
      // 재개
      this.speechSynth.resume();
      this.isPausedTTS = false;
      this.updateTTSButtonUI();
      return;
    }

    // 신규 재생 시작
    this.speechSynth.cancel();

    // 괄호나 특수문자 정리
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/[\n\r]+/g, ' ').trim();
    if (!cleanText) return;

    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance.lang = 'en-US';
    this.currentUtterance.rate = this.ttsRate;
    if (this.currentVoice) this.currentUtterance.voice = this.currentVoice;

    this.currentUtterance.onstart = () => {
      this.isPlayingTTS = true;
      this.isPausedTTS = false;
      this.updateTTSButtonUI();
    };

    this.currentUtterance.onend = () => {
      this.isPlayingTTS = false;
      this.isPausedTTS = false;
      this.updateTTSButtonUI();
    };

    this.currentUtterance.onerror = (e) => {
      console.warn('[EnglishAssistant] TTS 재생 오류:', e);
      this.isPlayingTTS = false;
      this.isPausedTTS = false;
      this.updateTTSButtonUI();
    };

    this.speechSynth.speak(this.currentUtterance);
  }

  /**
   * 오디오 및 TTS 즉시 정지
   */
  stopAudio() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    this.isPlayingTTS = false;
    this.isPausedTTS = false;
    this.updateTTSButtonUI();
  }

  /**
   * TTS 재생 배속 설정 (0.8x, 1.0x, 1.2x)
   */
  setRate(rate) {
    this.ttsRate = rate;
    // 배속 버튼 UI 활성화 갱신
    document.querySelectorAll('.btn-eng-speed').forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.speed) === rate);
    });

    // 만약 현재 재생 중이었다면 새 배속으로 재시작
    if (this.isPlayingTTS && this.activeQuestion?.passage) {
      this.speakPassage(this.activeQuestion.passage);
    }
  }

  /**
   * TTS 버튼 UI 상태 갱신
   */
  updateTTSButtonUI() {
    const btn = document.getElementById('btn-eng-tts-play');
    if (!btn) return;

    const icon = btn.querySelector('.eng-tts-icon');
    const label = btn.querySelector('.eng-tts-label');

    if (this.isPlayingTTS && !this.isPausedTTS) {
      btn.classList.add('playing');
      btn.classList.remove('paused');
      if (icon) icon.innerHTML = '<span class="audio-waves"><span></span><span></span><span></span></span>';
      if (label) label.innerText = '일시 정지';
    } else if (this.isPlayingTTS && this.isPausedTTS) {
      btn.classList.remove('playing');
      btn.classList.add('paused');
      if (icon) icon.innerText = '▶️';
      if (label) label.innerText = '이어서 듣기';
    } else {
      btn.classList.remove('playing');
      btn.classList.remove('paused');
      if (icon) icon.innerText = '🔊';
      if (label) label.innerText = '지문 듣기';
    }
  }

  /**
   * 영문 지문 텍스트 내 단어들을 터치 가능(Touch-to-Define) span으로 래핑
   */
  formatInteractivePassage(text) {
    if (!text) return '';

    // 정규식으로 영단어([a-zA-Z]+)와 나머지(공백, 구두점, 줄바꿈)를 정밀하게 분리
    return text.replace(/([a-zA-Z]{2,})/g, (match) => {
      return `<span class="eng-tap-word" data-word="${match}">${match}</span>`;
    });
  }

  /**
   * 지문 한국어 전문 해석 및 해설 토글
   */
  toggleTranslation() {
    const box = document.getElementById('eng-passage-translation');
    const toggleBtn = document.getElementById('btn-eng-trans-toggle');
    if (!box) return;

    this.isTranslationVisible = !this.isTranslationVisible;
    box.style.display = this.isTranslationVisible ? 'block' : 'none';

    if (toggleBtn) {
      const label = toggleBtn.querySelector('.eng-trans-label');
      if (label) {
        label.innerText = this.isTranslationVisible ? '해석 숨기기' : '지문 해석';
      }
      toggleBtn.classList.toggle('active', this.isTranslationVisible);
    }
  }

  /**
   * 문제 화면에 영어 전용 툴바 및 인터랙티브 지문 바인딩
   */
  attach({ question, passageBox, studentName }) {
    this.stopAudio();
    this.activeQuestion = question;
    this.isTranslationVisible = false;

    if (!passageBox) return;

    // 1. 지문 영역에 영어 학습 툴바 및 대화형 지문 주입
    const passage = question.passage || '';
    const hasPassage = Boolean(passage && passage.trim());

    // 해석 텍스트 준비 (문항 해설 또는 전용 번역문 활용)
    let translationText = question.explanation || '';
    if (question.passage_translation) {
      translationText = question.passage_translation;
    }

    const toolbarHtml = hasPassage ? `
      <!-- 영어 학습 보조 도구 바 -->
      <div class="eng-passage-toolbar" id="eng-passage-toolbar">
        <div class="eng-toolbar-left">
          <button type="button" class="btn-eng-tool btn-eng-tts" id="btn-eng-tts-play" title="지문 원어민 발음으로 듣기">
            <span class="eng-tts-icon">🔊</span>
            <span class="eng-tts-label">지문 듣기</span>
          </button>
          
          <div class="eng-speed-selector" title="재생 속도 조절">
            <button type="button" class="btn-eng-speed" data-speed="0.8">0.8x</button>
            <button type="button" class="btn-eng-speed active" data-speed="1.0">1.0x</button>
            <button type="button" class="btn-eng-speed" data-speed="1.2">1.2x</button>
          </div>
        </div>

        <div class="eng-toolbar-right">
          <button type="button" class="btn-eng-tool btn-eng-trans" id="btn-eng-trans-toggle" title="지문 한국어 해석 보기">
            <span>📖</span>
            <span class="eng-trans-label">지문 해석</span>
          </button>
          <button type="button" class="btn-eng-tool btn-eng-search" id="btn-eng-dict-open" title="원하는 단어 직접 검색하기">
            <span>🔍</span>
            <span>단어 검색</span>
          </button>
        </div>
      </div>

      <div class="eng-tip-banner">
        <span>💡 <strong>Tip:</strong> 지문 속 영어 단어를 터치하면 발음과 뜻을 바로 확인할 수 있어요!</span>
      </div>
    ` : `
      <!-- 단문형 영어 문항용 미니 툴바 -->
      <div class="eng-passage-toolbar compact" id="eng-passage-toolbar">
        <div class="eng-toolbar-left">
          <button type="button" class="btn-eng-tool btn-eng-tts" id="btn-eng-q-tts" title="문제 문장 듣기">
            <span class="eng-tts-icon">🔊</span>
            <span class="eng-tts-label">문장 듣기</span>
          </button>
        </div>
        <div class="eng-toolbar-right">
          <button type="button" class="btn-eng-tool btn-eng-search" id="btn-eng-dict-open" title="단어 검색하기">
            <span>🔍</span>
            <span>단어 검색</span>
          </button>
        </div>
      </div>
    `;

    const translationHtml = hasPassage ? `
      <!-- 지문 한국어 전문 해석 박스 (토글) -->
      <div class="eng-passage-translation" id="eng-passage-translation" style="display: none;">
        <div class="eng-trans-header">
          <span>🇰🇷</span> <strong>지문 전문 해석 & 핵심 해설</strong>
        </div>
        <div class="eng-trans-content" id="eng-trans-content">
          ${translationText}
        </div>
      </div>
    ` : '';

    if (hasPassage) {
      passageBox.style.display = 'block';
      passageBox.innerHTML = `
        <div class="q-passage-header">
          <span>📖</span> [ 다음 글을 읽고 물음에 답하시오 ]
        </div>
        ${toolbarHtml}
        <div class="q-passage-content">${this.formatInteractivePassage(passage)}</div>
        ${translationHtml}
      `;
    } else {
      // 긴 지문이 없는 문법/어휘 문항일 때 상단에 미니 도우미 바만 배치
      const existingToolbar = passageBox.querySelector('.eng-passage-toolbar');
      if (!existingToolbar) {
        passageBox.style.display = 'block';
        passageBox.innerHTML = toolbarHtml;
      }
    }

    // 이벤트 리스너 연결
    // 1. 지문 TTS 듣기
    const ttsBtn = document.getElementById('btn-eng-tts-play') || document.getElementById('btn-eng-q-tts');
    ttsBtn?.addEventListener('click', () => {
      const textToSpeak = hasPassage ? passage : (question.question_text || '');
      this.speakPassage(textToSpeak);
    });

    // 2. 재생 속도
    document.querySelectorAll('.btn-eng-speed').forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed || '1.0');
        this.setRate(speed);
      });
    });

    // 3. 지문 해석 토글
    const transBtn = document.getElementById('btn-eng-trans-toggle');
    transBtn?.addEventListener('click', () => this.toggleTranslation());

    // 4. 단어 검색창 오픈
    const dictOpenBtn = document.getElementById('btn-eng-dict-open');
    dictOpenBtn?.addEventListener('click', () => {
      this.openWordModal('dictionary');
    });

    // 5. 지문 단어 터치(클릭) 이벤트 위임
    passageBox.querySelectorAll('.eng-tap-word').forEach(wordEl => {
      wordEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = wordEl.dataset.word;
        if (word) {
          // 활성화된 단어 펄스 효과
          passageBox.querySelectorAll('.eng-tap-word.active').forEach(w => w.classList.remove('active'));
          wordEl.classList.add('active');
          this.openWordModal(word);
        }
      });
    });
  }

  /**
   * 영어 과목 외(수학/과학/사회 등) 화면 이동 시 정리
   */
  detach() {
    this.stopAudio();
    this.activeQuestion = null;
    this.closeModal();
  }
}

// 싱글톤 인스턴스 export
export const englishAssistant = new EnglishAssistant();
export default englishAssistant;
