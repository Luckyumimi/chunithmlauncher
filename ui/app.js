const byId = id => document.getElementById(id);

// The static launcher keeps its translations in one small catalog so the same
// wording is reused by HTML, dynamic cards, status messages and accessibility
// labels.  "system" intentionally resolves to the browser/Windows locale and
// falls back to Simplified Chinese for locales we do not ship yet.
const UI_TEXT = Object.freeze({
  "appTitle": [
    "Chunithm Launcher",
    "Chunithm Launcher",
    "Chunithm Launcher",
    "Chunithm Launcher",
    "Chunithm Launcher",
    "Chunithm Launcher",
    "Chunithm Launcher"
  ],
  "navLabel": [
    "主导航",
    "Main navigation",
    "メインナビゲーション",
    "메인 내비게이션",
    "Navigation principale",
    "Navegación principal",
    "Hauptnavigation"
  ],
  "backHome": [
    "返回首页",
    "Back to home",
    "ホームに戻る",
    "홈으로 돌아가기",
    "Retour à l’accueil",
    "Volver al inicio",
    "Zur Startseite"
  ],
  "navHome": [
    "首页",
    "Home",
    "ホーム",
    "홈",
    "Accueil",
    "Inicio",
    "Startseite"
  ],
  "navActivities": [
    "活动",
    "Activities",
    "イベント",
    "이벤트",
    "Événements",
    "Eventos",
    "Events"
  ],
  "navScores": [
    "查分",
    "Rating",
    "Rating",
    "Rating",
    "Rating",
    "Rating",
    "Rating"
  ],
  "navShop": [
    "商城",
    "Shop",
    "ショップ",
    "상점",
    "Boutique",
    "Tienda",
    "Shop"
  ],
  "navSocial": [
    "好友",
    "Friends",
    "フレンド",
    "친구",
    "Amis",
    "Amigos",
    "Freunde"
  ],
  "navAime": [
    "Aime",
    "Aime",
    "Aime",
    "Aime",
    "Aime",
    "Aime",
    "Aime"
  ],
  "navCheckin": [
    "签到",
    "Check-in",
    "チェックイン",
    "출석",
    "Check-in",
    "Check-in",
    "Check-in"
  ],
  "navSettings": [
    "设置",
    "Settings",
    "設定",
    "설정",
    "Paramètres",
    "Ajustes",
    "Einstellungen"
  ],
  "statusIdle": [
    "待机",
    "Idle",
    "待機中",
    "대기",
    "Inactif",
    "Inactivo",
    "Bereit"
  ],
  "themeDark": [
    "深色",
    "Dark",
    "ダーク",
    "다크",
    "Sombre",
    "Oscuro",
    "Dunkel"
  ],
  "themeLight": [
    "浅色",
    "Light",
    "ライト",
    "라이트",
    "Clair",
    "Claro",
    "Hell"
  ],
  "themeDarkMode": [
    "深色模式",
    "Dark mode",
    "ダークモード",
    "다크 모드",
    "Mode sombre",
    "Modo oscuro",
    "Dunkler Modus"
  ],
  "themeLightMode": [
    "浅色模式",
    "Light mode",
    "ライトモード",
    "라이트 모드",
    "Mode clair",
    "Modo claro",
    "Heller Modus"
  ],
  "accountDemo": [
    "演示账户　Lv.12",
    "Demo account　Lv.12",
    "デモアカウント　Lv.12",
    "데모 계정　Lv.12",
    "Compte démo　Nv.12",
    "Cuenta de demostración　Nv.12",
    "Demo-Konto　Lvl.12"
  ],
  "portalDefault": [
    "打开MuNET",
    "Open MuNET",
    "MuNETを開く",
    "MuNET 열기",
    "Ouvrir MuNET",
    "Abrir MuNET",
    "MuNET öffnen"
  ],
  "homeEyebrow": [
    "SEASON 01　/　COMMUNITY UPDATE",
    "SEASON 01　/　COMMUNITY UPDATE",
    "SEASON 01　/　COMMUNITY UPDATE",
    "SEASON 01　/　COMMUNITY UPDATE",
    "SEASON 01　/　COMMUNITY UPDATE",
    "SEASON 01　/　COMMUNITY UPDATE",
    "SEASON 01　/　COMMUNITY UPDATE"
  ],
  "homeSubtitle": [
    "启动游戏、记录成绩，和同样喜欢 CHUNITHM 的玩家一起探索新的节奏。",
    "Launch the game, track scores, and explore new rhythms with fellow CHUNITHM players.",
    "ゲームを起動し、スコアを記録して、CHUNITHMを愛するプレイヤーと新しいリズムを探そう。",
    "게임을 실행하고 점수를 기록하며, CHUNITHM을 좋아하는 플레이어들과 새로운 리듬을 찾아보세요.",
    "Lancez le jeu, suivez vos scores et explorez de nouveaux rythmes avec d’autres joueurs de CHUNITHM.",
    "Inicia el juego, registra tus puntuaciones y descubre nuevos ritmos con otros jugadores de CHUNITHM.",
    "Starte das Spiel, verfolge deine Ergebnisse und entdecke neue Rhythmen mit anderen CHUNITHM-Spielern."
  ],
  "launchGame": [
    "▶　启动游戏",
    "▶　Launch game",
    "▶　ゲームを起動",
    "▶　게임 시작",
    "▶　Lancer le jeu",
    "▶　Iniciar juego",
    "▶　Spiel starten"
  ],
  "eventPrev": [
    "上一张活动",
    "Previous event",
    "前のイベント",
    "이전 이벤트",
    "Événement précédent",
    "Evento anterior",
    "Vorheriges Event"
  ],
  "eventNext": [
    "下一张活动",
    "Next event",
    "次のイベント",
    "다음 이벤트",
    "Événement suivant",
    "Siguiente evento",
    "Nächstes Event"
  ],
  "eventPages": [
    "活动页码",
    "Event pages",
    "イベントページ",
    "이벤트 페이지",
    "Pages des événements",
    "Páginas de eventos",
    "Eventseiten"
  ],
  "latest": [
    "最新资讯",
    "Latest updates",
    "最新情報",
    "최신 소식",
    "Dernières actualités",
    "Últimas novedades",
    "Neuigkeiten"
  ],
  "viewAll": [
    "查看全部 →",
    "View all →",
    "すべて見る →",
    "모두 보기 →",
    "Tout voir →",
    "Ver todo →",
    "Alle anzeigen →"
  ],
  "newsActivities": [
    "活动",
    "Events",
    "イベント",
    "이벤트",
    "Événements",
    "Eventos",
    "Events"
  ],
  "newsAnnouncements": [
    "公告",
    "Announcements",
    "お知らせ",
    "공지",
    "Annonces",
    "Anuncios",
    "Ankündigungen"
  ],
  "newsUpdates": [
    "资讯",
    "Updates",
    "ニュース",
    "소식",
    "Actualités",
    "Noticias",
    "Neuigkeiten"
  ],
  "dailyCheckin": [
    "每日签到",
    "Daily check-in",
    "毎日チェックイン",
    "매일 출석",
    "Check-in quotidien",
    "Check-in diario",
    "Täglicher Check-in"
  ],
  "dailyCheckinDesc": [
    "领取今日运势与积分奖励",
    "Claim today's fortune and points",
    "今日の運勢とポイント報酬を受け取る",
    "오늘의 운세와 포인트 보상을 받으세요",
    "Recevez la fortune du jour et des points",
    "Reclama tu fortuna del día y tus puntos",
    "Hole dein Tagesglück und Punkte ab"
  ],
  "goCheckin": [
    "去签到",
    "Check in",
    "チェックインする",
    "출석하기",
    "Faire le check-in",
    "Hacer check-in",
    "Einchecken"
  ],
  "playerData": [
    "PLAYER DATA",
    "PLAYER DATA",
    "PLAYER DATA",
    "PLAYER DATA",
    "PLAYER DATA",
    "PLAYER DATA",
    "PLAYER DATA"
  ],
  "weekPoints": [
    "本周积分　↑ 18%",
    "Weekly points　↑ 18%",
    "今週のポイント　↑ 18%",
    "이번 주 포인트　↑ 18%",
    "Points de la semaine　↑ 18%",
    "Puntos de esta semana　↑ 18%",
    "Punkte diese Woche　↑ 18%"
  ],
  "viewScores": [
    "查看成绩",
    "View scores",
    "成績を見る",
    "기록 보기",
    "Voir les scores",
    "Ver puntuaciones",
    "Ergebnisse anzeigen"
  ],
  "targetMode": [
    "目标模式",
    "Target mode",
    "目標モード",
    "목표 모드",
    "Mode cible",
    "Modo objetivo",
    "Zielmodus"
  ],
  "originalResolution": [
    "原始分辨率",
    "Original resolution",
    "元の解像度",
    "원본 해상도",
    "Résolution d’origine",
    "Resolución original",
    "Ursprüngliche Auflösung"
  ],
  "primaryDisplay": [
    "主显示器",
    "Primary display",
    "メインディスプレイ",
    "주 디스플레이",
    "Écran principal",
    "Pantalla principal",
    "Hauptanzeige"
  ],
  "unread": [
    "未读取",
    "Not read",
    "未読み取り",
    "읽지 않음",
    "Non lue",
    "No leída",
    "Nicht gelesen"
  ],
  "unselected": [
    "未选择",
    "Not selected",
    "未選択",
    "선택 안 됨",
    "Non sélectionné",
    "Sin seleccionar",
    "Nicht ausgewählt"
  ],
  "startBatNotSelected": [
    "尚未选择 start.bat",
    "start.bat not selected",
    "start.bat が未選択",
    "start.bat가 선택되지 않음",
    "start.bat non sélectionné",
    "start.bat no seleccionado",
    "start.bat nicht ausgewählt"
  ],
  "launchMode": [
    "启动模式",
    "Launch mode",
    "起動モード",
    "실행 모드",
    "Mode de lancement",
    "Modo de inicio",
    "Startmodus"
  ],
  "smartMode": [
    "智能切换",
    "Smart switch",
    "スマート切り替え",
    "스마트 전환",
    "Bascule intelligente",
    "Cambio inteligente",
    "Intelligenter Wechsel"
  ],
  "manualMode": [
    "仅启动",
    "Launch only",
    "起動のみ",
    "실행만",
    "Lancer uniquement",
    "Solo iniciar",
    "Nur starten"
  ],
  "exclusiveDisplay": [
    "独占显示器",
    "Exclusive display",
    "ディスプレイを占有",
    "전용 디스플레이",
    "Écran exclusif",
    "Pantalla exclusiva",
    "Exklusive Anzeige"
  ],
  "testSwitch": [
    "测试切换",
    "Test switch",
    "テスト切り替え",
    "테스트 전환",
    "Tester le basculement",
    "Probar cambio",
    "Wechsel testen"
  ],
  "activityAlt": [
    "心跳文学部联动活动主视觉",
    "Doki Doki Literature Club! collaboration artwork",
    "ドキドキ文芸部！コラボイベントのメインビジュアル",
    "Doki Doki Literature Club! 콜라보 이벤트 메인 아트",
    "Visuel principal de la collaboration Doki Doki Literature Club !",
    "Arte principal de la colaboración de Doki Doki Literature Club!",
    "Hauptmotiv der Doki-Doki-Literature-Club!-Kooperation"
  ],
  "currentActivityAlt": [
    "当前活动宣传图",
    "Current event artwork",
    "現在のイベント画像",
    "현재 이벤트 이미지",
    "Illustration de l’événement actuel",
    "Imagen del evento actual",
    "Bild des aktuellen Events"
  ],
  "activityDetail": [
    "查看活动详情",
    "View event details",
    "イベント詳細を見る",
    "이벤트 상세 보기",
    "Voir les détails de l’événement",
    "Ver detalles del evento",
    "Eventdetails anzeigen"
  ],
  "currentRating": [
    "当前 Rating",
    "Current Rating",
    "現在の Rating",
    "현재 Rating",
    "Rating actuel",
    "Rating actual",
    "Aktuelles Rating"
  ],
  "ratingWeeklyChange": [
    "↑ 0.18 本周",
    "↑ 0.18 this week",
    "↑ 0.18 今週",
    "↑ 0.18 이번 주",
    "↑ 0.18 cette semaine",
    "↑ 0.18 esta semana",
    "↑ 0.18 diese Woche"
  ],
  "highestScore": [
    "最高达成",
    "Best score",
    "最高達成",
    "최고 기록",
    "Meilleur score",
    "Mejor puntuación",
    "Bestleistung"
  ],
  "excCount": [
    "EXC 23 首",
    "23 EXC songs",
    "EXC 23曲",
    "EXC 23곡",
    "23 morceaux EXC",
    "23 canciones EXC",
    "23 EXC-Songs"
  ],
  "weeklyPlay": [
    "本周游玩",
    "Played this week",
    "今週のプレイ",
    "이번 주 플레이",
    "Joués cette semaine",
    "Jugadas esta semana",
    "Diese Woche gespielt"
  ],
  "weekLabel": [
    "本周",
    "this week",
    "今週",
    "이번 주",
    "cette semaine",
    "esta semana",
    "diese Woche"
  ],
  "songs": [
    "首歌曲",
    "songs",
    "曲",
    "곡",
    "morceaux",
    "canciones",
    "Songs"
  ],
  "recentScores": [
    "近期成绩",
    "Recent scores",
    "最近の成績",
    "최근 기록",
    "Scores récents",
    "Puntuaciones recientes",
    "Letzte Ergebnisse"
  ],
  "filter": [
    "筛选",
    "Filter",
    "絞り込み",
    "필터",
    "Filtrer",
    "Filtrar",
    "Filtern"
  ],
  "nextPlay": [
    "NEXT PLAY",
    "NEXT PLAY",
    "NEXT PLAY",
    "NEXT PLAY",
    "NEXT PLAY",
    "NEXT PLAY",
    "NEXT PLAY"
  ],
  "scoreRecommendation": [
    "推分推荐",
    "Score recommendations",
    "スコアアップおすすめ",
    "점수 향상 추천",
    "Recommandations de score",
    "Recomendaciones de puntuación",
    "Score-Empfehlungen"
  ],
  "scoreRecommendationBody": [
    "根据你的近期成绩，试试一首速度和滑键都更接近的曲目。",
    "Based on your recent scores, try a song with a similar speed and slide pattern.",
    "最近の成績をもとに、速度とスライド傾向が近い曲に挑戦してみよう。",
    "최근 기록을 바탕으로 속도와 슬라이드 패턴이 비슷한 곡을 시도해 보세요.",
    "D’après vos scores récents, essayez un morceau au rythme et aux glissés similaires.",
    "Según tus resultados recientes, prueba una canción con una velocidad y un patrón de slides similares.",
    "Probiere anhand deiner letzten Ergebnisse ein Stück mit ähnlicher Geschwindigkeit und Slide-Struktur."
  ],
  "viewRecommendation": [
    "查看推荐",
    "View recommendation",
    "おすすめを見る",
    "추천 보기",
    "Voir les recommandations",
    "Ver recomendaciones",
    "Empfehlung anzeigen"
  ],
  "allItems": [
    "全部",
    "All",
    "すべて",
    "전체",
    "Tout",
    "Todo",
    "Alle"
  ],
  "badges": [
    "徽章",
    "Badges",
    "バッジ",
    "배지",
    "Badges",
    "Insignias",
    "Abzeichen"
  ],
  "clothing": [
    "服饰",
    "Clothing",
    "コスチューム",
    "의상",
    "Vêtements",
    "Ropa",
    "Kleidung"
  ],
  "deskItems": [
    "桌面物件",
    "Desk items",
    "デスクアイテム",
    "데스크 아이템",
    "Objets de bureau",
    "Objetos de escritorio",
    "Schreibtisch-Objekte"
  ],
  "productImage": [
    "商品图",
    "Product image",
    "商品画像",
    "상품 이미지",
    "Image du produit",
    "Imagen del producto",
    "Produktbild"
  ],
  "badgeSet": [
    "节奏徽章套装",
    "Rhythm badge set",
    "リズムバッジセット",
    "리듬 배지 세트",
    "Ensemble de badges de rythme",
    "Set de insignias de ritmo",
    "Rhythmus-Abzeichen-Set"
  ],
  "limitedEvent": [
    "限定活动纪念",
    "Limited event keepsake",
    "限定イベント記念品",
    "한정 이벤트 기념품",
    "Souvenir d’événement limité",
    "Recuerdo de evento limitado",
    "Limitierte Event-Erinnerung"
  ],
  "rhythmMat": [
    "街机节奏桌垫",
    "Arcade rhythm desk mat",
    "アーケードリズムデスクマット",
    "아케이드 리듬 데스크 매트",
    "Tapis de bureau rythmique arcade",
    "Alfombrilla de escritorio arcade",
    "Arcade-Rhythmus-Schreibtischmatte"
  ],
  "antiSlip": [
    "防滑织物材质",
    "Anti-slip fabric",
    "滑り止め生地",
    "미끄럼 방지 패브릭",
    "Tissu antidérapant",
    "Tejido antideslizante",
    "Rutschfestes Gewebe"
  ],
  "songCards": [
    "曲目收藏卡",
    "Song collection cards",
    "楽曲コレクションカード",
    "곡 수집 카드",
    "Cartes de collection de morceaux",
    "Tarjetas de colección de canciones",
    "Song-Sammelkarten"
  ],
  "randomThree": [
    "随机 3 张",
    "Random 3 cards",
    "ランダム3枚",
    "랜덤 3장",
    "3 cartes aléatoires",
    "3 cartas aleatorias",
    "3 zufällige Karten"
  ],
  "dailyRoutine": [
    "DAILY ROUTINE / 04",
    "DAILY ROUTINE / 04",
    "DAILY ROUTINE / 04",
    "DAILY ROUTINE / 04",
    "DAILY ROUTINE / 04",
    "DAILY ROUTINE / 04",
    "DAILY ROUTINE / 04"
  ],
  "dailyRoutineTitle": [
    "每日签到",
    "Daily check-in",
    "毎日チェックイン",
    "매일 출석",
    "Check-in quotidien",
    "Check-in diario",
    "Täglicher Check-in"
  ],
  "dailyRoutineBody": [
    "每天打开启动器，抽取一份属于今天的节奏运势。",
    "Open the launcher each day to draw your rhythm fortune.",
    "毎日ランチャーを開いて、今日のリズム運勢を引こう。",
    "매일 런처를 열고 오늘의 리듬 운세를 뽑아 보세요.",
    "Ouvrez le launcher chaque jour pour tirer votre horoscope rythmique.",
    "Abre el launcher cada día para sacar tu fortuna rítmica.",
    "Öffne den Launcher jeden Tag und ziehe dein Rhythmus-Horoskop."
  ],
  "todayFortune": [
    "TODAY'S FORTUNE",
    "TODAY'S FORTUNE",
    "TODAY'S FORTUNE",
    "TODAY'S FORTUNE",
    "TODAY'S FORTUNE",
    "TODAY'S FORTUNE",
    "TODAY'S FORTUNE"
  ],
  "greatFortune": [
    "大吉",
    "Excellent luck",
    "大吉",
    "대길",
    "Chance exceptionnelle",
    "Mucha suerte",
    "Großes Glück"
  ],
  "fortuneBody": [
    "适合挑战熟悉曲目的高难度谱面，今天的手感会比平时更稳定。",
    "A good day to challenge hard charts you know. Your touch should feel steadier than usual.",
    "知っている高難度譜面に挑戦するのにぴったり。今日はいつもより手応えが安定しそう。",
    "익숙한 고난도 채보에 도전하기 좋은 날입니다. 오늘은 평소보다 손感이 더 안정적일 거예요.",
    "Idéal pour tenter des charts difficiles que vous connaissez ; votre toucher devrait être plus stable aujourd’hui.",
    "Un buen día para desafiar charts difíciles que conoces; hoy tu precisión debería ser más estable.",
    "Ideal, um bekannte schwere Charts zu spielen; dein Spielgefühl sollte heute stabiler sein."
  ],
  "drawFortune": [
    "抽取今日运势",
    "Draw today's fortune",
    "今日の運勢を引く",
    "오늘의 운세 뽑기",
    "Tirer la fortune du jour",
    "Sacar la fortuna de hoy",
    "Tagesglück ziehen"
  ],
  "consecutiveCheckin": [
    "连续签到",
    "Consecutive check-in",
    "連続チェックイン",
    "연속 출석",
    "Série de check-ins",
    "Racha de check-ins",
    "Check-in-Serie"
  ],
  "checkinStreak": [
    "4 / 7 天",
    "4 / 7 days",
    "4 / 7日",
    "4 / 7일",
    "4 / 7 jours",
    "4 / 7 días",
    "4 / 7 Tage"
  ],
  "days": [
    "天",
    "days",
    "日",
    "일",
    "jours",
    "días",
    "Tage"
  ],
  "socialTitle": [
    "好友动态",
    "Friend activity",
    "フレンドアクティビティ",
    "친구 활동",
    "Activité des amis",
    "Actividad de amigos",
    "Freunde-Aktivität"
  ],
  "friendsEyebrow": [
    "FRIENDS",
    "FRIENDS",
    "FRIENDS",
    "FRIENDS",
    "FRIENDS",
    "FRIENDS",
    "FRIENDS"
  ],
  "onlineFriends": [
    "在线好友",
    "Online friends",
    "オンラインのフレンド",
    "온라인 친구",
    "Amis en ligne",
    "Amigos en línea",
    "Online-Freunde"
  ],
  "onlineCount": [
    "3 人在线",
    "3 online",
    "3人オンライン",
    "온라인 3명",
    "3 en ligne",
    "3 en línea",
    "3 online"
  ],
  "friendSearch": [
    "搜索好友昵称或 ID",
    "Search nickname or ID",
    "フレンド名またはIDを検索",
    "닉네임 또는 ID 검색",
    "Rechercher un pseudo ou un ID",
    "Buscar apodo o ID",
    "Spitznamen oder ID suchen"
  ],
  "addFriend": [
    "添加",
    "Add",
    "追加",
    "추가",
    "Ajouter",
    "Añadir",
    "Hinzufügen"
  ],
  "online": [
    "在线",
    "Online",
    "オンライン",
    "온라인",
    "En ligne",
    "En línea",
    "Online"
  ],
  "viewProfile": [
    "查看主页",
    "View profile",
    "プロフィールを見る",
    "프로필 보기",
    "Voir le profil",
    "Ver perfil",
    "Profil anzeigen"
  ],
  "activityCompleted": [
    "刚刚完成了「World Vanquisher」的 SSS",
    "Just achieved SSS on “World Vanquisher”",
    "たった今「World Vanquisher」でSSSを達成",
    "방금 「World Vanquisher」에서 SSS 달성",
    "Vient d’obtenir un SSS sur « World Vanquisher »",
    "Acaba de lograr SSS en « World Vanquisher »",
    "Gerade SSS in „World Vanquisher“ erreicht"
  ],
  "profileUpdated": [
    "更新了个人简介：今晚继续推分",
    "Updated profile: pushing scores tonight",
    "プロフィールを更新：今夜もスコア更新",
    "프로필 업데이트: 오늘 밤도 점수 올리기",
    "Profil mis à jour : amélioration des scores ce soir",
    "Perfil actualizado: a subir puntuación esta noche",
    "Profil aktualisiert: heute Abend weiter Punkte sammeln"
  ],
  "challenging": [
    "正在挑战 World Vanquisher",
    "Challenging World Vanquisher",
    "「World Vanquisher」に挑戦中",
    "「World Vanquisher」에 도전 중",
    "Joue actuellement à « World Vanquisher »",
    "Desafiando « World Vanquisher »",
    "Spielt gerade „World Vanquisher“"
  ],
  "preparing": [
    "准备开始推分",
    "Preparing to push scores",
    "スコア更新の準備中",
    "점수 올릴 준비 중",
    "Se prépare à améliorer son score",
    "Preparándose para subir puntuación",
    "Bereitet sich auf neue Bestleistungen vor"
  ],
  "viewedActivity": [
    "刚刚查看了活动",
    "Just viewed an event",
    "イベントを見たばかり",
    "방금 이벤트를 확인함",
    "Vient de consulter un événement",
    "Acaba de ver un evento",
    "Hat gerade ein Event angesehen"
  ],
  "aimeTitle": [
    "下载Android Aime NFC 读卡器",
    "Download Android Aime NFC Reader",
    "Android Aime NFCリーダーをダウンロード",
    "Android Aime NFC 리더 다운로드",
    "Télécharger le lecteur NFC Aime Android",
    "Descargar el lector NFC Aime para Android",
    "Android-Aime-NFC-Lesegerät herunterladen"
  ],
  "installApp": [
    "安装应用",
    "Install the app",
    "アプリをインストール",
    "앱 설치",
    "Installer l’application",
    "Instalar la aplicación",
    "App installieren"
  ],
  "installAppBody": [
    "下载并安装 NFC Aime Reader。",
    "Download and install NFC Aime Reader.",
    "NFC Aime Readerをダウンロードしてインストールします。",
    "NFC Aime Reader를 다운로드하고 설치하세요.",
    "Téléchargez et installez NFC Aime Reader.",
    "Descarga e instala NFC Aime Reader.",
    "Lade NFC Aime Reader herunter und installiere es."
  ],
  "openNfc": [
    "打开 NFC",
    "Turn on NFC",
    "NFCをオンにする",
    "NFC 켜기",
    "Activer le NFC",
    "Activar NFC",
    "NFC einschalten"
  ],
  "openNfcBody": [
    "将手机靠近 Aime 卡片完成读取。",
    "Bring your phone close to the Aime card to read it.",
    "スマートフォンをAimeカードに近づけて読み取ります。",
    "휴대폰을 Aime 카드에 가까이 대어 읽으세요.",
    "Approchez votre téléphone de la carte Aime pour la lire.",
    "Acerca el teléfono a la tarjeta Aime para leerla.",
    "Halte dein Smartphone zum Lesen an die Aime-Karte."
  ],
  "connectGame": [
    "连接游戏",
    "Connect to the game",
    "ゲームに接続",
    "게임 연결",
    "Connecter au jeu",
    "Conectar al juego",
    "Mit dem Spiel verbinden"
  ],
  "connectGameBody": [
    "按照项目说明配置本地读卡器。",
    "Configure the local reader using the project guide.",
    "プロジェクトの説明に従ってローカルリーダーを設定します。",
    "프로젝트 안내에 따라 로컬 리더를 설정하세요.",
    "Configurez le lecteur local en suivant le guide du projet.",
    "Configura el lector local siguiendo la guía del proyecto.",
    "Konfiguriere das lokale Lesegerät anhand der Projektanleitung."
  ],
  "projectGuide": [
    "查看项目说明　↗",
    "View project guide　↗",
    "プロジェクトガイドを見る　↗",
    "프로젝트 안내 보기　↗",
    "Voir le guide du projet　↗",
    "Ver la guía del proyecto　↗",
    "Projektanleitung anzeigen　↗"
  ],
  "firstRun": [
    "首次配置",
    "First-time setup",
    "初回設定",
    "최초 설정",
    "Première configuration",
    "Configuración inicial",
    "Ersteinrichtung"
  ],
  "firstRunBody": [
    "先完成游戏路径、主显示器和界面主题配置。",
    "Set the game path, primary display and interface theme first.",
    "まずゲームパス、メインディスプレイ、インターフェーステーマを設定してください。",
    "먼저 게임 경로, 주 디스플레이, 인터페이스 테마를 설정하세요.",
    "Configurez d’abord le chemin du jeu, l’écran principal et le thème de l’interface.",
    "Configura primero la ruta del juego, la pantalla principal y el tema de la interfaz.",
    "Lege zuerst Spielpfad, Hauptanzeige und Oberflächenthema fest."
  ],
  "startupDisplay": [
    "启动与显示器",
    "Startup and display",
    "起動とディスプレイ",
    "실행 및 디스플레이",
    "Lancement et affichage",
    "Inicio y pantalla",
    "Start und Anzeige"
  ],
  "startBatPath": [
    "start.bat 路径",
    "start.bat path",
    "start.bat のパス",
    "start.bat 경로",
    "Chemin de start.bat",
    "Ruta de start.bat",
    "Pfad zu start.bat"
  ],
  "chooseStartBat": [
    "请选择 start.bat",
    "Choose start.bat",
    "start.batを選択してください",
    "start.bat를 선택하세요",
    "Choisissez start.bat",
    "Elige start.bat",
    "start.bat auswählen"
  ],
  "choose": [
    "选择",
    "Choose",
    "選択",
    "선택",
    "Choisir",
    "Elegir",
    "Auswählen"
  ],
  "refresh": [
    "刷新",
    "Refresh",
    "更新",
    "새로 고침",
    "Actualiser",
    "Actualizar",
    "Aktualisieren"
  ],
  "chooseDisplay": [
    "请选择主显示器",
    "Choose a primary display",
    "メインディスプレイを選択してください",
    "주 디스플레이를 선택하세요",
    "Choisissez l’écran principal",
    "Elige la pantalla principal",
    "Hauptanzeige auswählen"
  ],
  "originalModeExample": [
    "例如 2560×1440 @ 144Hz",
    "For example 2560×1440 @ 144Hz",
    "例：2560×1440 @ 144Hz",
    "예: 2560×1440 @ 144Hz",
    "Ex. 2560×1440 @ 144Hz",
    "Ejemplo: 2560×1440 @ 144Hz",
    "Beispiel 2560×1440 @ 144Hz"
  ],
  "interfaceTheme": [
    "界面主题",
    "Interface theme",
    "インターフェーステーマ",
    "인터페이스 테마",
    "Thème de l’interface",
    "Tema de la interfaz",
    "Oberflächenthema"
  ],
  "finishSetup": [
    "完成配置",
    "Finish setup",
    "設定を完了",
    "설정 완료",
    "Terminer la configuration",
    "Finalizar configuración",
    "Einrichtung abschließen"
  ],
  "settings": [
    "设置",
    "Settings",
    "設定",
    "설정",
    "Paramètres",
    "Ajustes",
    "Einstellungen"
  ],
  "appliesImmediately": [
    "选择后即刻生效",
    "Changes apply immediately",
    "選択後すぐに反映",
    "선택 후 즉시 적용",
    "Les changements s’appliquent immédiatement",
    "Los cambios se aplican de inmediato",
    "Änderungen werden sofort angewendet"
  ],
  "close": [
    "关闭",
    "Close",
    "閉じる",
    "닫기",
    "Fermer",
    "Cerrar",
    "Schließen"
  ],
  "startupResolution": [
    "启动与分辨率",
    "Startup and resolution",
    "起動と解像度",
    "실행 및 해상도",
    "Lancement et résolution",
    "Inicio y resolución",
    "Start und Auflösung"
  ],
  "migrateAppleChu": [
    "从segatool迁移至Applechu",
    "Migrate from segatool to AppleChu",
    "segatoolからAppleChuへ移行",
    "segatool에서 AppleChu로 이전",
    "Migrer de segatool vers AppleChu",
    "Migrar de segatool a AppleChu",
    "Von segatool zu AppleChu migrieren"
  ],
  "editAppleChu": [
    "编辑 AppleChu.toml",
    "Edit AppleChu.toml",
    "AppleChu.tomlを編集",
    "AppleChu.toml 편집",
    "Modifier AppleChu.toml",
    "Editar AppleChu.toml",
    "AppleChu.toml bearbeiten"
  ],
  "runAdmin": [
    "使用管理员权限运行 bat",
    "Run bat with administrator privileges",
    "管理者権限でbatを実行",
    "관리자 권한으로 bat 실행",
    "Exécuter le fichier bat avec les droits administrateur",
    "Ejecutar el bat con permisos de administrador",
    "bat mit Administratorrechten ausführen"
  ],
  "terminateCmd": [
    "启动前关闭残留 CMD",
    "Close leftover CMD before launch",
    "起動前に残ったCMDを閉じる",
    "시작 전에 남은 CMD 닫기",
    "Fermer les CMD restants avant le lancement",
    "Cerrar los CMD restantes antes de iniciar",
    "Übrige CMD-Fenster vor dem Start schließen"
  ],
  "saveImmediately": [
    "选择后立即保存",
    "Saved immediately after selection",
    "選択後すぐに保存",
    "선택 후 즉시 저장",
    "Enregistré immédiatement après la sélection",
    "Se guarda inmediatamente tras la selección",
    "Nach der Auswahl sofort speichern"
  ],
  "read": [
    "读取",
    "Read",
    "読み取る",
    "읽기",
    "Lire",
    "Leer",
    "Lesen"
  ],
  "targetResolution": [
    "目标分辨率",
    "Target resolution",
    "目標解像度",
    "목표 해상도",
    "Résolution cible",
    "Resolución objetivo",
    "Zielauflösung"
  ],
  "appearance": [
    "外观",
    "Appearance",
    "外観",
    "모양",
    "Apparence",
    "Apariencia",
    "Darstellung"
  ],
  "language": [
    "语言",
    "Language",
    "言語",
    "언어",
    "Langue",
    "Idioma",
    "Sprache"
  ],
  "followSystem": [
    "跟随系统",
    "Follow system",
    "システムに従う",
    "시스템 설정 따르기",
    "Suivre le système",
    "Seguir el sistema",
    "Systemeinstellungen verwenden"
  ],
  "simplifiedChinese": [
    "简体中文",
    "Simplified Chinese",
    "簡体字中国語",
    "중국어 간체",
    "Chinois simplifié",
    "Chino simplificado",
    "Vereinfachtes Chinesisch"
  ],
  "english": [
    "English",
    "English",
    "英語",
    "영어",
    "Anglais",
    "Inglés",
    "Englisch"
  ],
  "themeColor": [
    "主题色",
    "Theme color",
    "テーマカラー",
    "테마 색상",
    "Couleur du thème",
    "Color del tema",
    "Designfarbe"
  ],
  "backgroundImage": [
    "背景图片",
    "Background image",
    "背景画像",
    "배경 이미지",
    "Image d’arrière-plan",
    "Imagen de fondo",
    "Hintergrundbild"
  ],
  "localPathUrl": [
    "本地路径或 URL",
    "Local path or URL",
    "ローカルパスまたはURL",
    "로컬 경로 또는 URL",
    "Chemin local ou URL",
    "Ruta local o URL",
    "Lokaler Pfad oder URL"
  ],
  "allNetProvider": [
    "ALL.Net提供商",
    "ALL.Net provider",
    "ALL.Netプロバイダー",
    "ALL.Net 제공업체",
    "Fournisseur ALL.Net",
    "Proveedor de ALL.Net",
    "ALL.Net-Anbieter"
  ],
  "buttonText": [
    "按钮文字",
    "Button text",
    "ボタンの文字",
    "버튼 텍스트",
    "Texte du bouton",
    "Texto del botón",
    "Schaltflächentext"
  ],
  "webLink": [
    "网页链接",
    "Web link",
    "ウェブリンク",
    "웹 링크",
    "Lien web",
    "Enlace web",
    "Weblink"
  ],
  "about": [
    "关于",
    "About",
    "概要",
    "정보",
    "À propos",
    "Acerca de",
    "Über"
  ],
  "projectHome": [
    "项目主页",
    "Project home",
    "プロジェクトホーム",
    "프로젝트 홈",
    "Page du projet",
    "Página del proyecto",
    "Projektseite"
  ],
  "githubHome": [
    "GitHub 主页",
    "GitHub home",
    "GitHubホーム",
    "GitHub 홈페이지",
    "Page GitHub",
    "Página de GitHub",
    "GitHub-Seite"
  ],
  "versionUpdate": [
    "版本更新",
    "Version update",
    "バージョン更新",
    "버전 업데이트",
    "Mise à jour de la version",
    "Actualización de versión",
    "Versionsupdate"
  ],
  "checkUpdate": [
    "检查更新",
    "Check for updates",
    "更新を確認",
    "업데이트 확인",
    "Vérifier les mises à jour",
    "Buscar actualizaciones",
    "Nach Updates suchen"
  ],
  "supportProject": [
    "支持项目",
    "Support the project",
    "プロジェクトを支援",
    "프로젝트 후원",
    "Soutenir le projet",
    "Apoyar el proyecto",
    "Projekt unterstützen"
  ],
  "donate": [
    "捐赠",
    "Donate",
    "寄付",
    "기부",
    "Faire un don",
    "Donar",
    "Spenden"
  ],
  "saveSettings": [
    "保存设置",
    "Save settings",
    "設定を保存",
    "설정 저장",
    "Enregistrer les paramètres",
    "Guardar ajustes",
    "Einstellungen speichern"
  ],
  "donationTitle": [
    "支持项目",
    "Support the project",
    "プロジェクトを支援",
    "프로젝트 후원",
    "Soutenir le projet",
    "Apoyar el proyecto",
    "Projekt unterstützen"
  ],
  "donationBody": [
    "感谢你的支持，捐赠完全自愿",
    "Thanks for your support. Donations are completely optional.",
    "ご支援ありがとうございます。寄付は完全に任意です",
    "응원해 주셔서 감사합니다. 기부는 전적으로 자율입니다",
    "Merci pour votre soutien. Les dons sont entièrement facultatifs.",
    "Gracias por tu apoyo. Las donaciones son totalmente voluntarias.",
    "Danke für deine Unterstützung. Spenden sind völlig freiwillig."
  ],
  "donationCopy": [
    "如果这个启动器帮到了你，可以通过 USDT（TRON）支持后续维护。",
    "If this launcher helps you, you can support maintenance with USDT (TRON).",
    "このランチャーがお役に立ったら、USDT（TRON）で今後のメンテナンスを支援できます。",
    "이 런처가 도움이 되었다면 USDT(TRON)로 유지 보수를 후원할 수 있습니다.",
    "Si ce launcher vous aide, vous pouvez soutenir sa maintenance avec de l’USDT (TRON).",
    "Si este launcher te ayuda, puedes apoyar su mantenimiento con USDT (TRON).",
    "Wenn dir dieser Launcher hilft, kannst du die weitere Pflege mit USDT (TRON) unterstützen."
  ],
  "copyAddress": [
    "复制地址",
    "Copy address",
    "アドレスをコピー",
    "주소 복사",
    "Copier l’adresse",
    "Copiar dirección",
    "Adresse kopieren"
  ],
  "donationHint": [
    "请确认网络为 TRON（TRC-20），转账前请仔细核对地址。",
    "Confirm the network is TRON (TRC-20) and check the address before sending.",
    "ネットワークがTRON（TRC-20）であることを確認し、送金前にアドレスをよく確認してください。",
    "네트워크가 TRON(TRC-20)인지 확인하고 송금 전에 주소를 꼭 확인하세요.",
    "Vérifiez que le réseau est TRON (TRC-20) et contrôlez soigneusement l’adresse avant l’envoi.",
    "Confirma que la red sea TRON (TRC-20) y revisa bien la dirección antes de enviar.",
    "Bestätige, dass das Netzwerk TRON (TRC-20) ist, und prüfe die Adresse vor dem Senden."
  ],
  "projectAnnouncement": [
    "项目公告",
    "Project announcement",
    "プロジェクトのお知らせ",
    "프로젝트 공지",
    "Annonce du projet",
    "Anuncio del proyecto",
    "Projektankündigung"
  ],
  "viewDetails": [
    "查看详情",
    "View details",
    "詳細を見る",
    "자세히 보기",
    "Voir les détails",
    "Ver detalles",
    "Details anzeigen"
  ],
  "aboutNote": [
    "本项目与MuNET无附属关系",
    "This project is not affiliated with MuNET",
    "このプロジェクトはMuNETと提携・関係ありません",
    "이 프로젝트는 MuNET과 제휴 관계가 없습니다",
    "Ce projet n’est pas affilié à MuNET",
    "Este proyecto no está afiliado a MuNET",
    "Dieses Projekt ist nicht mit MuNET verbunden"
  ],
  "eventDokiTitle": [
    "9/25(周五)《心跳文学部！》联动活动开始！",
    "9/25 (Fri) Doki Doki Literature Club! collaboration begins!",
    "9/25(金)「ドキドキ文芸部！」コラボイベント開始！",
    "9/25(금) 「두근두근 문예부!」 콜라보 이벤트 시작!",
    "9/25 (ven.) La collaboration Doki Doki Literature Club ! commence !",
    "¡La colaboración de Doki Doki Literature Club! comienza el 25/9 (vie.)",
    "9/25 (Fr.) Kooperation mit Doki Doki Literature Club! beginnt!"
  ],
  "eventDokiBody": [
    "今天9/22(周二)是莫妮卡的生日！\n为了纪念生日，将举办《心跳文学部！》联动活动！\n9/25(周五)起，「Your Reality (Kenji Mizuno Remix)」将登场！\n活动期间可获得《心跳文学部！》的角色、名牌以及舞台背景！",
    "Today, 9/22 (Tue), is Monika’s birthday!\nTo celebrate, we are holding a Doki Doki Literature Club! collaboration.\n“Your Reality (Kenji Mizuno Remix)” arrives on 9/25 (Fri).\nEarn characters, nameplates and stage backgrounds during the event!",
    "今日は9/22(火)、モニカの誕生日です！\n誕生日を記念して、「ドキドキ文芸部！」コラボイベントを開催します！\n9/25(金)から「Your Reality (Kenji Mizuno Remix)」が登場！\nイベント期間中に「ドキドキ文芸部！」のキャラクター、ネームプレート、背景を獲得できます！",
    "오늘 9/22(화)는 모니카의 생일입니다!\n생일을 기념해 「두근두근 문예부!」 콜라보 이벤트를 개최합니다!\n9/25(금)부터 「Your Reality (Kenji Mizuno Remix)」가 등장합니다!\n이벤트 기간 동안 「두근두근 문예부!」 캐릭터와 명찰, 스테이지 배경을 획득할 수 있습니다!",
    "Le 22/9 (mar.) est l’anniversaire de Monika !\nPour le célébrer, une collaboration Doki Doki Literature Club ! est organisée.\n« Your Reality (Kenji Mizuno Remix) » arrive le 25/9 (ven.).\nObtenez des personnages, des plaques et des arrière-plans de scène pendant l’événement !",
    "¡Hoy, 22/9 (mar.), es el cumpleaños de Monika!\nPara celebrarlo, organizamos una colaboración de Doki Doki Literature Club!\n« Your Reality (Kenji Mizuno Remix) » llegará el 25/9 (vie.).\nConsigue personajes, placas de nombre y fondos de escenario durante el evento.",
    "Am 22.9. (Di.) hat Monika Geburtstag!\nZu diesem Anlass findet eine Kooperation mit Doki Doki Literature Club! statt.\n„Your Reality (Kenji Mizuno Remix)“ erscheint am 25.9. (Fr.).\nWährend des Events kannst du Charaktere, Namensschilder und Bühnenhintergründe erhalten!"
  ],
  "eventSongsTitle": [
    "9/25(周五) 曲目新增！",
    "New songs on 9/25 (Fri)!",
    "9/25(金) 新曲追加！",
    "9/25(금) 신곡 추가!",
    "Nouveaux morceaux le 25/9 (ven.) !",
    "¡Nuevas canciones el 25/9 (vie.)!",
    "Neue Songs am 25.9. (Fr.)!"
  ],
  "eventSongsBody": [
    "从9/25(周五)起，POPS＆ANIME中「LaVI-Bavellabion」，VARIETY中「奇々解体」将在CHUNITHM登场！\n此外，大受欢迎的曲目「きゅうくらりん」将以「ULTIMA」强化版登场哦！\n一定要来玩玩看呢！",
    "From 9/25 (Fri), “LaVI-Bavellabion” joins POPS & ANIME and “奇々解体” joins VARIETY.\nThe popular “きゅうくらりん” also gets an ULTIMA chart.\nCome and try them!",
    "9/25(金)から、POPS＆ANIMEに「LaVI-Bavellabion」、VARIETYに「奇々解体」がCHUNITHMに登場！\nさらに、人気曲「きゅうくらりん」が「ULTIMA」譜面で登場します！\nぜひ遊んでみてください！",
    "9/25(금)부터 POPS＆ANIME에 「LaVI-Bavellabion」, VARIETY에 「奇々解体」가 CHUNITHM에 등장합니다!\n인기 곡 「きゅうくらりん」도 「ULTIMA」 채보로 추가됩니다!\n꼭 플레이해 보세요!",
    "À partir du 25/9 (ven.), « LaVI-Bavellabion » arrive dans POPS & ANIME et « 奇々解体 » dans VARIETY sur CHUNITHM !\nLe morceau populaire « きゅうくらりん » reçoit aussi un chart ULTIMA !\nVenez l’essayer !",
    "Desde el 25/9 (vie.), « LaVI-Bavellabion » llegará a POPS & ANIME y « 奇々解体 » a VARIETY en CHUNITHM.\nLa popular « きゅうくらりん » también tendrá una chart ULTIMA.\n¡Ven a probarla!",
    "Ab dem 25.9. (Fr.) erscheinen „LaVI-Bavellabion“ in POPS & ANIME und „奇々解体“ in VARIETY in CHUNITHM!\nDer beliebte Song „きゅうくらりん“ erhält außerdem einen ULTIMA-Chart.\nKomm und probiere ihn aus!"
  ],
  "eventIyowaTitle": [
    "9/25(周五)『いよわ』联名活动重启！",
    "Iyowa collaboration returns on 9/25 (Fri)!",
    "9/25(金)「いよわ」コラボイベント再開催！",
    "9/25(금) 「いよわ」 콜라보 이벤트 재개!",
    "La collaboration « いよわ » revient le 25/9 (ven.) !",
    "¡La colaboración con « いよわ » vuelve el 25/9 (vie.)!",
    "„いよわ“-Kooperation kehrt am 25.9. (Fr.) zurück!"
  ],
  "eventIyowaBody": [
    "9/25(周五)起，『いよわ』的活动地图重启！\n在地图中，过去活动中获得的角色将再次可获得，而且还能获得舞台背景哦！\n抓住这个机会一起玩吧！",
    "The Iyowa event map returns on 9/25 (Fri).\nCharacters from the previous run will be available again, along with a stage background.\nDon’t miss the chance to play!",
    "9/25(金)から「いよわ」イベントマップが再開します！\nマップでは、過去のイベントで獲得したキャラクターをもう一度入手でき、ステージ背景も手に入ります！\nこの機会に一緒に遊びましょう！",
    "9/25(금)부터 「いよわ」 이벤트 맵이 다시 열립니다!\n맵에서 과거 이벤트 캐릭터를 다시 획득할 수 있으며 스테이지 배경도 받을 수 있습니다!\n이번 기회에 함께 플레이해 보세요!",
    "La carte de l’événement « いよわ » revient le 25/9 (ven.) !\nVous pourrez de nouveau obtenir les personnages des événements précédents, ainsi qu’un arrière-plan de scène !\nProfitez-en pour jouer avec nous !",
    "¡El mapa del evento « いよわ » vuelve el 25/9 (vie.)!\nPodrás conseguir de nuevo los personajes de eventos anteriores y un fondo de escenario.\n¡Aprovecha la ocasión para jugar!",
    "Die Eventkarte „いよわ“ kehrt am 25.9. (Fr.) zurück!\nDu kannst die Charaktere vergangener Events erneut erhalten und bekommst außerdem einen Bühnenhintergrund.\nNutze die Gelegenheit und spiel mit!"
  ],
  "eventEmperorTitle": [
    "全国对战活动 ～ 盟帝「第9回 皇帝活动」结果公布！",
    "National Battle: 9th Emperor Event results!",
    "全国対戦イベント ～ 皇帝「第9回皇帝イベント」結果発表！",
    "전국 대전 이벤트 ~ 황제 「제9회 황제 이벤트」 결과 발표!",
    "Bataille nationale : résultats du 9e événement Empereur !",
    "Batalla nacional: ¡resultados del 9.º evento Emperador!",
    "Nationaler Wettkampf: Ergebnisse des 9. Kaiser-Events!"
  ],
  "eventEmperorBody": [
    "9/10(周四)～9/13(周日)举办的「第9回 皇帝活动」中排名靠前的用户大公布！\n※称号已发放完毕。\n官方站点的排行榜页面已更新！",
    "The top players from the 9th Emperor Event, held from 9/10 (Thu) to 9/13 (Sun), have been announced.\nTitles have already been awarded.\nThe official leaderboard is updated!",
    "9/10(木)～9/13(日)に開催された「第9回皇帝イベント」の上位プレイヤーを発表！\n※称号は配布済みです。\n公式サイトのランキングページを更新しました！",
    "9/10(목)～9/13(일)에 개최된 「제9회 황제 이벤트」 상위 플레이어를 발표합니다!\n※ 칭호는 이미 지급되었습니다.\n공식 사이트의 랭킹 페이지가 업데이트되었습니다!",
    "Voici les meilleurs joueurs du 9e événement Empereur, organisé du 10/9 (jeu.) au 13/9 (dim.) !\n※ Les titres ont déjà été distribués.\nLa page du classement officiel a été mise à jour !",
    "¡Estos son los mejores jugadores del 9.º evento Emperador, celebrado del 10/9 (jue.) al 13/9 (dom.)!\n※ Los títulos ya se han entregado.\n¡La página de clasificación oficial se ha actualizado!",
    "Die besten Spieler des 9. Kaiser-Events vom 10.9. (Do.) bis 13.9. (So.) stehen fest!\n※ Die Titel wurden bereits vergeben.\nDie offizielle Ranglistenseite wurde aktualisiert!"
  ],
  "eventMaimaiTitle": [
    "9月17日(周四)「maimai でらっくす」联动活动举办！",
    "maimai DX collaboration begins on 9/17 (Thu)!",
    "9月17日(木)「maimai でらっくす」コラボイベント開催！",
    "9월 17일(목) 「maimai でらっくす」 콜라보 이벤트 개최!",
    "Collaboration « maimai でらっくす » le 17/9 (jeu.) !",
    "¡Colaboración de « maimai でらっくす » el 17/9 (jue.)!",
    "„maimai でらっくす“-Kooperation am 17.9. (Do.)!"
  ],
  "eventMaimaiBody": [
    "为了纪念《maimai でらっくす MAGiCAL》的启动，我们将开始maimai でらっくす的联动活动！\n活动期间，每天玩maimai でらっくす的日子，在CHUNITHM中可以获得1张【当日限定】SPECIALチケット，每天1张哦！请一定要来玩玩看吧！",
    "To celebrate the launch of maimai DX MAGiCAL, a maimai DX collaboration is starting.\nDuring the event, you can earn one daily SPECIAL ticket in CHUNITHM for each day you play maimai DX. Come join in!",
    "「maimai でらっくす MAGiCAL」の稼働を記念して、maimai でらっくすコラボイベントを開催します！\nイベント期間中、maimai でらっくすをプレイした日ごとに、CHUNITHMで【当日限定】SPECIALチケットを1枚獲得できます。1日1枚です！ぜひ遊んでみてください！",
    "「maimai でらっくす MAGiCAL」 가동을 기념해 maimai でらっくす 콜라보 이벤트를 개최합니다!\n이벤트 기간 동안 maimai でらっくす를 플레이한 날마다 CHUNITHM에서 【당일 한정】 SPECIAL 티켓 1장을 받을 수 있습니다. 하루에 1장입니다! 꼭 플레이해 보세요!",
    "Pour célébrer le lancement de « maimai でらっくす MAGiCAL », une collaboration maimai でらっくす commence !\nPendant l’événement, vous pouvez obtenir un ticket SPECIAL 【valable le jour même】 dans CHUNITHM pour chaque jour où vous jouez à maimai でらっくす. Un par jour ! Venez jouer !",
    "Para celebrar el lanzamiento de « maimai でらっくす MAGiCAL », comienza una colaboración con maimai でらっくす.\nDurante el evento, puedes conseguir una entrada SPECIAL 【solo para ese día】 en CHUNITHM por cada día que juegues a maimai でらっくす. ¡Una al día! ¡Ven a jugar!",
    "Zur Feier des Starts von „maimai でらっくす MAGiCAL“ beginnt eine maimai-でらっくす-Kooperation!\nWährend des Events erhältst du in CHUNITHM für jeden Tag, an dem du maimai でらっくす spielst, ein 【nur an diesem Tag gültiges】 SPECIAL-Ticket. Eines pro Tag! Komm und spiel mit!"
  ],
  "newsActivity1": [
    "「心跳文学部！」联动活动开始",
    "Doki Doki Literature Club! collaboration begins",
    "「ドキドキ文芸部！」コラボイベント開始",
    "「두근두근 문예부!」 콜라보 이벤트 시작",
    "La collaboration Doki Doki Literature Club ! commence",
    "Comienza la colaboración de Doki Doki Literature Club!",
    "Kooperation mit Doki Doki Literature Club! beginnt"
  ],
  "newsActivity2": [
    "活动限定角色与名牌开放获取",
    "Event characters and nameplates available",
    "イベント限定キャラクターとネームプレートを獲得可能",
    "이벤트 한정 캐릭터와 명찰 획득 가능",
    "Personnages et plaques exclusifs disponibles",
    "Personajes y placas exclusivos disponibles",
    "Event-exklusive Charaktere und Namensschilder verfügbar"
  ],
  "newsAnnouncement1": [
    "CHUNITHM Launcher 前端工作台更新",
    "CHUNITHM Launcher interface updated",
    "CHUNITHM Launcherのフロントエンドを更新",
    "CHUNITHM Launcher 프런트엔드 업데이트",
    "Interface de CHUNITHM Launcher mise à jour",
    "Interfaz de CHUNITHM Launcher actualizada",
    "CHUNITHM-Launcher-Oberfläche aktualisiert"
  ],
  "newsAnnouncement2": [
    "窗口尺寸已固定为 1296×730",
    "Window size set to 1296×730",
    "ウィンドウサイズを1296×730に固定",
    "창 크기를 1296×730으로 고정",
    "Taille de fenêtre fixée à 1296×730",
    "Tamaño de ventana fijado en 1296×730",
    "Fenstergröße auf 1296×730 festgelegt"
  ],
  "newsUpdate1": [
    "社区内容展示页开放投稿",
    "Community showcase submissions open",
    "コミュニティ展示ページで投稿受付開始",
    "커뮤니티 전시 페이지에 게시물 제출 가능",
    "Les contributions sont ouvertes sur la vitrine communautaire",
    "Abiertas las contribuciones en la galería comunitaria",
    "Beiträge für die Community-Galerie geöffnet"
  ],
  "newsUpdate2": [
    "版本 2.5.0 更新说明",
    "Version 2.5.0 release notes",
    "バージョン2.5.0更新内容",
    "버전 2.5.0 업데이트 안내",
    "Notes de version 2.5.0",
    "Notas de la versión 2.5.0",
    "Versionshinweise 2.5.0"
  ],
  "weekdayMon": [
    "一",
    "Mon",
    "月",
    "월",
    "lun.",
    "lun.",
    "Mo."
  ],
  "weekdayTue": [
    "二",
    "Tue",
    "火",
    "화",
    "mar.",
    "mar.",
    "Di."
  ],
  "weekdayWed": [
    "三",
    "Wed",
    "水",
    "수",
    "mer.",
    "mié.",
    "Mi."
  ],
  "weekdayThu": [
    "四",
    "Thu",
    "木",
    "목",
    "jeu.",
    "jue.",
    "Do."
  ],
  "weekdayFri": [
    "五",
    "Fri",
    "金",
    "금",
    "ven.",
    "vie.",
    "Fr."
  ],
  "weekdaySat": [
    "六",
    "Sat",
    "土",
    "토",
    "sam.",
    "sáb.",
    "Sa."
  ],
  "weekdaySun": [
    "日",
    "Sun",
    "日",
    "일",
    "dim.",
    "dom.",
    "So."
  ],
  "statusLaunching": [
    "启动中",
    "Launching",
    "起動中",
    "실행 중",
    "Lancement",
    "Iniciando",
    "Wird gestartet"
  ],
  "statusSetupRequired": [
    "请先完成配置",
    "Complete setup first",
    "まず設定を完了してください",
    "먼저 설정을 완료하세요",
    "Terminez d’abord la configuration",
    "Completa primero la configuración",
    "Schließe zuerst die Einrichtung ab"
  ],
  "statusSaved": [
    "设置已保存",
    "Settings saved",
    "設定を保存しました",
    "설정이 저장되었습니다",
    "Paramètres enregistrés",
    "Ajustes guardados",
    "Einstellungen gespeichert"
  ],
  "statusCopied": [
    "地址已复制到剪贴板。请确认网络为 TRON（TRC-20）。",
    "Address copied. Confirm the network is TRON (TRC-20).",
    "アドレスをクリップボードにコピーしました。ネットワークがTRON（TRC-20）であることを確認してください。",
    "주소가 클립보드에 복사되었습니다. 네트워크가 TRON(TRC-20)인지 확인하세요.",
    "Adresse copiée. Vérifiez que le réseau est TRON (TRC-20).",
    "Dirección copiada. Confirma que la red sea TRON (TRC-20).",
    "Adresse kopiert. Bestätige, dass das Netzwerk TRON (TRC-20) ist."
  ],
  "statusCopyFailed": [
    "复制失败，请手动选择并复制上方地址。",
    "Copy failed. Select and copy the address above manually.",
    "コピーに失敗しました。上のアドレスを手動で選択してコピーしてください。",
    "복사하지 못했습니다. 위 주소를 직접 선택해 복사하세요.",
    "Échec de la copie. Sélectionnez et copiez l’adresse ci-dessus manuellement.",
    "No se pudo copiar. Selecciona y copia manualmente la dirección de arriba.",
    "Kopieren fehlgeschlagen. Wähle die obige Adresse manuell aus und kopiere sie."
  ],
  "statusBadUrl": [
    "网页链接格式不正确",
    "The web link format is invalid",
    "ウェブリンクの形式が正しくありません",
    "웹 링크 형식이 올바르지 않습니다",
    "Le format du lien web est incorrect",
    "El formato del enlace web no es válido",
    "Das Weblink-Format ist ungültig"
  ],
  "japanese": [
    "日本語",
    "Japanese",
    "日本語",
    "일본어",
    "Japonais",
    "Japonés",
    "Japanisch"
  ],
  "korean": [
    "한국어",
    "Korean",
    "韓国語",
    "한국어",
    "Coréen",
    "Coreano",
    "Koreanisch"
  ],
  "french": [
    "Français",
    "French",
    "フランス語",
    "프랑스어",
    "Français",
    "Francés",
    "Französisch"
  ],
  "spanish": [
    "Español",
    "Spanish",
    "スペイン語",
    "스페인어",
    "Espagnol",
    "Español",
    "Spanisch"
  ],
  "german": [
    "Deutsch",
    "German",
    "ドイツ語",
    "독일어",
    "Allemand",
    "Alemán",
    "Deutsch"
  ],
  "statusApplied": [
    "设置已保存并生效",
    "Settings saved and applied",
    "設定を保存して適用しました",
    "설정이 저장되고 적용되었습니다",
    "Paramètres enregistrés et appliqués",
    "Ajustes guardados y aplicados",
    "Einstellungen gespeichert und angewendet"
  ],
  "statusPrimarySaved": [
    "主显示器已保存",
    "Primary display saved",
    "メインディスプレイを保存しました",
    "주 디스플레이가 저장되었습니다",
    "Écran principal enregistré",
    "Pantalla principal guardada",
    "Hauptanzeige gespeichert"
  ],
  "statusParseError": [
    "消息解析失败",
    "Message parsing failed",
    "メッセージの解析に失敗しました",
    "메시지 분석에 실패했습니다",
    "Échec de l’analyse du message",
    "No se pudo analizar el mensaje",
    "Nachricht konnte nicht analysiert werden"
  ],
  "statusCheckingUpdates": [
    "正在检查更新...",
    "Checking for updates...",
    "更新を確認中…",
    "업데이트 확인 중…",
    "Recherche de mises à jour…",
    "Buscando actualizaciones…",
    "Nach Updates wird gesucht …"
  ],
  "statusUpdateFailed": [
    "检查更新失败",
    "Update check failed",
    "更新の確認に失敗しました",
    "업데이트 확인에 실패했습니다",
    "Échec de la vérification des mises à jour",
    "Error al buscar actualizaciones",
    "Suche nach Updates fehlgeschlagen"
  ],
  "statusUpToDate": [
    "当前已是最新版本",
    "You are already up to date",
    "最新バージョンです",
    "최신 버전입니다",
    "Vous utilisez déjà la dernière version",
    "Ya tienes la última versión",
    "Du hast bereits die neueste Version"
  ],
  "statusGithubOpened": [
    "已打开 GitHub 主页",
    "GitHub home opened",
    "GitHubホームを開きました",
    "GitHub 홈페이지를 열었습니다",
    "Page GitHub ouverte",
    "Página de GitHub abierta",
    "GitHub-Seite geöffnet"
  ],
  "statusGithubOpenFailed": [
    "打开 GitHub 主页失败",
    "Failed to open GitHub home",
    "GitHubホームを開けませんでした",
    "GitHub 홈페이지를 열지 못했습니다",
    "Impossible d’ouvrir la page GitHub",
    "No se pudo abrir la página de GitHub",
    "GitHub-Seite konnte nicht geöffnet werden"
  ],
  "statusInvalidMunet": [
    "MuNET 链接无效",
    "Invalid MuNET link",
    "MuNETリンクが無効です",
    "MuNET 링크가 잘못되었습니다",
    "Lien MuNET invalide",
    "Enlace de MuNET no válido",
    "Ungültiger MuNET-Link"
  ],
  "statusMunetNotReady": [
    "MuNET 页面尚未准备好",
    "MuNET page is not ready",
    "MuNETページの準備ができていません",
    "MuNET 페이지가 준비되지 않았습니다",
    "La page MuNET n’est pas prête",
    "La página de MuNET no está lista",
    "MuNET-Seite ist noch nicht bereit"
  ],
  "statusSwitchingResolution": [
    "正在切换分辨率...",
    "Switching resolution...",
    "解像度を切り替えています…",
    "해상도 전환 중…",
    "Changement de résolution…",
    "Cambiando resolución…",
    "Auflösung wird gewechselt …"
  ],
  "statusResolutionRestored": [
    "已恢复分辨率",
    "Resolution restored",
    "解像度を復元しました",
    "해상도가 복원되었습니다",
    "Résolution restaurée",
    "Resolución restaurada",
    "Auflösung wiederhergestellt"
  ],
  "statusRestoreFailed": [
    "恢复失败",
    "Restore failed",
    "復元に失敗しました",
    "복원에 실패했습니다",
    "Échec de la restauration",
    "Error al restaurar",
    "Wiederherstellung fehlgeschlagen"
  ],
  "statusGameStarting": [
    "游戏启动中...",
    "Starting game...",
    "ゲームを起動中…",
    "게임 시작 중…",
    "Démarrage du jeu…",
    "Iniciando el juego…",
    "Spiel wird gestartet …"
  ],
  "statusWaitingGame": [
    "等待游戏窗口...",
    "Waiting for game window...",
    "ゲームウィンドウを待機中…",
    "게임 창을 기다리는 중…",
    "En attente de la fenêtre du jeu…",
    "Esperando la ventana del juego…",
    "Warten auf das Spielfenster …"
  ],
  "statusGameRunning": [
    "游戏运行中...",
    "Game running...",
    "ゲーム実行中…",
    "게임 실행 중…",
    "Jeu en cours…",
    "Juego en ejecución…",
    "Spiel läuft …"
  ],
  "statusLaunchFailed": [
    "启动失败",
    "Launch failed",
    "起動に失敗しました",
    "실행에 실패했습니다",
    "Échec du lancement",
    "Error al iniciar",
    "Start fehlgeschlagen"
  ],
  "statusNoDisplay": [
    "未找到显示器",
    "No display found",
    "ディスプレイが見つかりません",
    "디스플레이를 찾을 수 없습니다",
    "Aucun écran trouvé",
    "No se encontró ninguna pantalla",
    "Kein Display gefunden"
  ],
  "eventArchive": [
    "活动档案",
    "Event archive",
    "イベントアーカイブ",
    "이벤트 아카이브",
    "Dossier de l’événement",
    "Archivo del evento",
    "Event-Archiv"
  ],
  "eventType": [
    "联动活动",
    "Collab event",
    "コラボイベント",
    "콜라보 이벤트",
    "Événement collab",
    "Evento colab",
    "Kollab-Event"
  ],
  "eventRewards": [
    "角色 / 名牌 / 舞台背景",
    "Characters / nameplates / stage",
    "キャラクター / ネームプレート / ステージ",
    "캐릭터 / 이름표 / 스테이지",
    "Personnages / plaques / scène",
    "Personajes / placas / escenario",
    "Charaktere / Namensschilder / Bühne"
  ],
  "eventTime": [
    "活动时间",
    "Dates",
    "開催期間",
    "기간",
    "Dates",
    "Fechas",
    "Zeitraum"
  ],
  "eventCategory": [
    "活动类型",
    "Format",
    "内容",
    "콘텐츠",
    "Contenu",
    "Contenido",
    "Inhalt"
  ],
  "eventRewardLabel": [
    "活动奖励",
    "Rewards",
    "報酬",
    "보상",
    "Récompenses",
    "Recompensas",
    "Belohnungen"
  ],
  "eventRewardCharacter": [
    "角色",
    "Characters",
    "キャラクター",
    "캐릭터",
    "Personnages",
    "Personajes",
    "Charaktere"
  ],
  "eventRewardNameplate": [
    "名牌",
    "Nameplates",
    "ネームプレート",
    "이름표",
    "Plaques",
    "Placas",
    "Namensschilder"
  ],
  "eventRewardStage": [
    "舞台背景",
    "Stage backgrounds",
    "ステージ背景",
    "스테이지 배경",
    "Décors de scène",
    "Fondos de escenario",
    "Bühnenhintergründe"
  ]
});

const LANGUAGE_OPTIONS = Object.freeze(['system', 'zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'es-ES', 'de-DE']);
const LANGUAGE_INDEX = Object.freeze({ 'zh-CN': 0, 'en-US': 1, 'ja-JP': 2, 'ko-KR': 3, 'fr-FR': 4, 'es-ES': 5, 'de-DE': 6 });
const normalizeLanguagePreference = value => LANGUAGE_OPTIONS.includes(value) ? value : 'system';
let hostSystemLanguage = '';
const detectSystemLanguage = () => {
  const locale = String(hostSystemLanguage || navigator.languages?.[0] || navigator.language || 'zh-CN').toLowerCase();
  if (locale.startsWith('en')) return 'en-US';
  if (locale.startsWith('ja')) return 'ja-JP';
  if (locale.startsWith('ko')) return 'ko-KR';
  if (locale.startsWith('fr')) return 'fr-FR';
  if (locale.startsWith('es')) return 'es-ES';
  if (locale.startsWith('de')) return 'de-DE';
  return 'zh-CN';
};
let languagePreference = normalizeLanguagePreference(localStorage.getItem('chunithm-language'));
let activeLanguage = languagePreference === 'system' ? detectSystemLanguage() : languagePreference;
let currentStatus = '';
const t = key => UI_TEXT[key]?.[LANGUAGE_INDEX[activeLanguage] ?? 0] ?? UI_TEXT[key]?.[0] ?? key;
const textKeyByChinese = new Map(Object.entries(UI_TEXT).map(([key, values]) => [values[0], key]));
const STATUS_TEXT = Object.freeze({"启动中": "statusLaunching", "请先完成配置": "statusSetupRequired", "设置已保存": "statusSaved", "设置已保存并生效": "statusApplied", "主显示器已保存": "statusPrimarySaved", "消息解析失败": "statusParseError", "正在检查更新...": "statusCheckingUpdates", "检查更新失败": "statusUpdateFailed", "当前已是最新版本": "statusUpToDate", "已打开 GitHub 主页": "statusGithubOpened", "打开 GitHub 主页失败": "statusGithubOpenFailed", "MuNET 链接无效": "statusInvalidMunet", "MuNET 页面尚未准备好": "statusMunetNotReady", "网页链接格式不正确": "statusBadUrl", "测试切换": "testSwitch", "正在切换分辨率...": "statusSwitchingResolution", "已恢复分辨率": "statusResolutionRestored", "恢复失败": "statusRestoreFailed", "游戏启动中...": "statusGameStarting", "等待游戏窗口...": "statusWaitingGame", "游戏运行中...": "statusGameRunning", "启动失败": "statusLaunchFailed", "未找到显示器": "statusNoDisplay"});
const dynamicTextSelector = '#homeNewsList, #activityEventDate, #activityEventTitle, #activityEventBody, #announcementTitle, #announcementBody, #btnAnnouncementAction, #portalTab, #statusText, #version, #targetMode, #originalMode, #primaryDisplay, #startBatPath, #btnMigrateToAppleChu, #btnTestSwitch';
function translateTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!node.parentElement || node.parentElement.closest(`script,style,input,textarea,${dynamicTextSelector}`)) continue;
    if (!Object.prototype.hasOwnProperty.call(node, '__i18nOriginal')) node.__i18nOriginal = node.nodeValue || '';
    const original = String(node.__i18nOriginal).trim();
    const key = textKeyByChinese.get(original);
    if (!key) continue;
    const value = t(key);
    const leading = String(node.__i18nOriginal).match(/^\s*/)?.[0] || '';
    const trailing = String(node.__i18nOriginal).match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${value}${trailing}`;
  }
}
function setTranslatedText(selector, key) {
  const nodes = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
  nodes.forEach(node => { if (node) node.textContent = t(key); });
}
function setTranslatedAttribute(selector, attribute, key) {
  document.querySelectorAll(selector).forEach(node => node.setAttribute(attribute, t(key)));
}
function applyTranslations() {
  document.documentElement.lang = activeLanguage;
  document.title = t('appTitle');
  setTranslatedAttribute('.launcher-rail', 'aria-label', 'navLabel');
  setTranslatedAttribute('.rail-brand', 'aria-label', 'backHome');
  byId('statusText').textContent = currentStatus ? translateKnownText(currentStatus) : t('statusIdle');
  setTranslatedText('#themeLabel', theme === 'dark' ? 'themeLight' : 'themeDark');
  setTranslatedText('#accountButton span', 'accountDemo');
  setTranslatedAttribute('#accountButton .account-avatar', 'alt', 'accountDemo');
  setTranslatedText('.hero-copy .eyebrow', 'homeEyebrow');
  setTranslatedText('.hero-subtitle', 'homeSubtitle');
  setTranslatedText('#btnLaunch', 'launchGame');
  setTranslatedText('.news-panel h2', 'latest');
  setTranslatedText('.news-panel .text-action', 'viewAll');
  setTranslatedText('.mini-card:first-of-type strong', 'dailyCheckin');
  setTranslatedText('.mini-card:first-of-type p', 'dailyCheckinDesc');
  setTranslatedText('.mini-card:first-of-type button', 'goCheckin');
  setTranslatedText('.score-card p', 'weekPoints');
  setTranslatedText('.score-card button', 'viewScores');
  setTranslatedText('.target-label', 'targetMode');
  setTranslatedText('.launch-mode-label', 'launchMode');
  setTranslatedText('#launchMode [data-mode="smart"]', 'smartMode');
  setTranslatedText('#launchMode [data-mode="manual"]', 'manualMode');
  setTranslatedText('.metric-card:nth-child(1) span', 'currentRating');
  setTranslatedText('.metric-card:nth-child(1) small', 'ratingWeeklyChange');
  setTranslatedText('.metric-card:nth-child(2) span', 'highestScore');
  setTranslatedText('.metric-card:nth-child(2) small', 'excCount');
  setTranslatedText('.metric-card:nth-child(3) span', 'weeklyPlay');
  setTranslatedText('.metric-card:nth-child(3) small', 'songs');
  setTranslatedText('.score-list h3', 'recentScores');
  setTranslatedText('.score-list .text-action', 'filter');
  setTranslatedText('.recommendation h3', 'scoreRecommendation');
  setTranslatedText('.recommendation p', 'scoreRecommendationBody');
  setTranslatedText('.recommendation button', 'viewRecommendation');
  setTranslatedText('.fortune-card strong', 'greatFortune');
  setTranslatedText('.fortune-card p', 'fortuneBody');
  setTranslatedText('.fortune-card button', 'drawFortune');
  setTranslatedText('.calendar-card h3', 'consecutiveCheckin');
  setTranslatedText('.calendar-card .panel-heading > strong', 'checkinStreak');
  setTranslatedText('.social-heading h2', 'socialTitle');
  setTranslatedText('.friends-panel h3', 'onlineFriends');
  setTranslatedText('.friends-count', 'onlineCount');
  setTranslatedText('#friendSearchForm button', 'addFriend');
  setTranslatedText('.aime-title', 'aimeTitle');
  setTranslatedText('.aime-steps > div:nth-child(1) h3', 'installApp');
  setTranslatedText('.aime-steps > div:nth-child(1) p', 'installAppBody');
  setTranslatedText('.aime-steps > div:nth-child(2) h3', 'openNfc');
  setTranslatedText('.aime-steps > div:nth-child(2) p', 'openNfcBody');
  setTranslatedText('.aime-steps > div:nth-child(3) h3', 'connectGame');
  setTranslatedText('.aime-steps > div:nth-child(3) p', 'connectGameBody');
  setTranslatedText('.aime-steps > a', 'projectGuide');
  setTranslatedText('#firstRun h2', 'firstRun');
  setTranslatedText('#firstRun > .modal-card > p', 'firstRunBody');
  setTranslatedText('#settingsModal h2', 'settings');
  setTranslatedText('#settingsModal .modal-heading small', 'appliesImmediately');
  setTranslatedText('#btnCloseSettings', 'close');
  setTranslatedText('#donationTitle', 'donationTitle');
  setTranslatedText('#donationModal .modal-heading small', 'donationBody');
  setTranslatedText('.donation-copy', 'donationCopy');
  setTranslatedText('#btnCopyDonation', 'copyAddress');
  setTranslatedText('#donationHint', 'donationHint');
  setTranslatedText('#announcementModal .modal-heading small', 'projectAnnouncement');
  setTranslatedText('#btnCloseDonation, #btnCloseAnnouncement', 'close');
  setTranslatedText('#btnSaveSettings', 'saveSettings');
  setTranslatedText('.event-media-label', 'eventArchive');
  setTranslatedText('#activityEventType, .event-meta-strip > div:nth-child(2) strong', 'eventType');
  setTranslatedText('#activityEventRewardCharacter', 'eventRewardCharacter');
  setTranslatedText('#activityEventRewardNameplate', 'eventRewardNameplate');
  setTranslatedText('#activityEventRewardStage', 'eventRewardStage');
  setTranslatedText('.event-meta-strip > div:nth-child(1) span', 'eventTime');
  setTranslatedText('.event-meta-strip > div:nth-child(2) span', 'eventCategory');
  setTranslatedText('.event-meta-strip > div:nth-child(3) span', 'eventRewardLabel');
  setTranslatedText('.event-meta-strip > div:nth-child(3) strong', 'eventRewards');
  setTranslatedText('#btnSave', 'finishSetup');
  setTranslatedText(aboutNote, 'aboutNote');
  document.querySelectorAll('.event-hero-controls button').forEach(button => button.setAttribute('aria-label', t(button.id === 'eventPrev' || button.dataset.eventPrev !== undefined ? 'eventPrev' : 'eventNext')));
  setTranslatedAttribute('#eventIndicator, .event-indicator', 'aria-label', 'eventPages');
  setTranslatedAttribute('#friendSearchInput', 'aria-label', 'friendSearch');
  setTranslatedAttribute('.online-friends', 'aria-label', 'onlineFriends');
  setTranslatedAttribute('.online-friend i', 'aria-label', 'online');
  setTranslatedAttribute('#homeEventImage', 'alt', 'activityAlt');
  setTranslatedAttribute('#activityEventImage', 'alt', 'currentActivityAlt');
  setTranslatedAttribute('.phone-placeholder img', 'alt', 'aimeTitle');
  setTranslatedAttribute('#friendSearchInput', 'placeholder', 'friendSearch');
  setTranslatedAttribute('#startBat, #startBatSetting', 'placeholder', 'chooseStartBat');
  setTranslatedAttribute('#originalModeInputSetting', 'placeholder', 'originalModeExample');
  setTranslatedAttribute('#bgImageInput', 'placeholder', 'localPathUrl');
  setTranslatedAttribute('#portalButtonText', 'placeholder', 'portalDefault');
  byId('languageSelect').value = languagePreference;
  translateTextNodes();
  syncThemeDropdown(theme);
  syncLanguageDropdown(languagePreference);
  syncAppleChuStatus();
  renderEvent(activeEventIndex, false);
  renderNewsTab(currentNewsTab);
  render();
}
function setLanguagePreference(value, { persist = true } = {}) {
  languagePreference = normalizeLanguagePreference(value);
  activeLanguage = languagePreference === 'system' ? detectSystemLanguage() : languagePreference;
  if (persist) localStorage.setItem('chunithm-language', languagePreference);
  applyTranslations();
}
const translateKnownText = value => {
  const key = textKeyByChinese.get(value);
  if (key) return t(key);
  const pair = STATUS_TEXT[value];
  return pair ? t(pair) : value;
};

const aboutNote = document.createElement('small');
aboutNote.textContent = '本项目与MuNET无附属关系';
byId('btnCheckUpdate')?.parentElement?.after(aboutNote);
const post = (type, payload = {}) => window.chrome?.webview
  ? window.chrome.webview.postMessage({ type, payload })
  : console.info('[preview]', type, payload);

function selectWorkspace(view) {
  const target = view || 'home';
  document.querySelectorAll('[data-view-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.viewPanel === target));
  document.querySelectorAll('[data-view]').forEach(link => link.classList.toggle('active', link.dataset.view === target));
  document.querySelector('.view-stack')?.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', event => {
  const link = event.target.closest('[data-view]');
  if (link) { event.preventDefault(); selectWorkspace(link.dataset.view); }
  const chip = event.target.closest('.filter-chip');
  if (chip) { chip.parentElement?.querySelectorAll('.filter-chip').forEach(item => item.classList.toggle('active', item === chip)); }
  const tab = event.target.closest('.news-tabs button');
  if (tab) tab.parentElement?.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === tab));
});

const state = {
  startBatPath: '', appleChuEnabled: false, primaryDisplay: '', primaryDisplayName: '', originalMode: '',
  targetMode: '1920×1080 @ 120Hz', launchMode: 'smart', smartDisplayEnabled: false, runBatAsAdministrator: true, terminateCmdBeforeLaunch: true,
  themeColor: '#fdd500', backgroundImagePath: '', displays: [], language: 'system',
};
const eventSlides = [
  { image: 'assets/events/event-doki.png', date: '09.25 — 10.06', titleKey: 'eventDokiTitle', bodyKey: 'eventDokiBody' },
  { image: 'assets/events/event-songs.png', date: '09.25', titleKey: 'eventSongsTitle', bodyKey: 'eventSongsBody' },
  { image: 'assets/events/event-iyowa.png', date: '09.25 — 11.11', titleKey: 'eventIyowaTitle', bodyKey: 'eventIyowaBody' },
  { image: 'assets/events/event-emperor.png', date: '09.10 — 09.13', titleKey: 'eventEmperorTitle', bodyKey: 'eventEmperorBody' },
  { image: 'assets/events/event-maimai.png', date: '09.17 — 09.30', titleKey: 'eventMaimaiTitle', bodyKey: 'eventMaimaiBody' },
];
const newsTabs = {
  activities: [['newsActivity1', '09/25'], ['newsActivity2', '09/25']],
  announcements: [['newsAnnouncement1', '09/22'], ['newsAnnouncement2', '09/21']],
  updates: [['newsUpdate1', '09/14'], ['newsUpdate2', '09/08']],
};
let currentNewsTab = 'activities';
function renderNewsTab(key = 'activities') {
  currentNewsTab = key;
  const list = byId('homeNewsList');
  if (!list) return;
  list.innerHTML = (newsTabs[key] || newsTabs.activities).map(([titleKey, date]) => `<button><span>${t(titleKey)}</span><time>${date}</time></button>`).join('');
  document.querySelectorAll('[data-news-tab]').forEach(tab => tab.classList.toggle('active', tab.dataset.newsTab === key));
}
let activeEventIndex = 0;
let eventTransitionTimer = null;
let eventCopyTimer = null;
const eventSlideDuration = 520;
const eventCopyFadeDelay = 180;
let eventTransitionRunning = false;
function queueEventStep(direction) {
  if (eventTransitionRunning) return;
  renderEvent(activeEventIndex + direction, true, direction);
}
function renderEvent(index, animate = true, direction = 1) {
  const nextIndex = (index + eventSlides.length) % eventSlides.length;
  if (animate && eventTransitionRunning) return;
  activeEventIndex = nextIndex;
  const sliders = [
    { current: byId('homeEventImage'), next: byId('homeEventImageNext') },
    { current: byId('activityEventImage'), next: byId('activityEventImageNext') },
  ].filter(slider => slider.current && slider.next);
  const copy = document.querySelector('.workspace-view[data-view-panel="activities"] .feature-copy');
  const slideDirection = direction < 0 ? -1 : 1;
  sliders.forEach(({ current, next }) => {
    current.classList.remove('event-slide-out');
    next.classList.remove('event-slide-in');
    current.style.setProperty('--event-direction', String(slideDirection));
    next.style.setProperty('--event-direction', String(slideDirection));
  });
  const updateEvent = () => {
    const event = eventSlides[activeEventIndex];
    document.querySelectorAll('.event-indicator').forEach(indicator => {
      indicator.replaceChildren(...eventSlides.map((slide, dotIndex) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'event-dot';
        dot.dataset.eventIndex = dotIndex;
        dot.setAttribute('aria-label', activeLanguage === 'en-US' ? `Event ${dotIndex + 1}: ${t(slide.titleKey)}` : `第 ${dotIndex + 1} 张活动：${t(slide.titleKey)}`);
        if (dotIndex === activeEventIndex) dot.setAttribute('aria-current', 'true');
        return dot;
      }));
    });
    byId('activityEventDate').textContent = event.date;
    byId('activityEventMetaDate').textContent = event.date;
    byId('activityEventMetaDateLabel').textContent = event.date;
    byId('activityEventIndex').textContent = String(activeEventIndex + 1).padStart(2, '0');
    byId('activityEventTitle').textContent = t(event.titleKey);
    byId('activityEventBody').textContent = t(event.bodyKey);
  };
  const event = eventSlides[activeEventIndex];
  if (!animate || sliders.length === 0) {
    window.clearTimeout(eventCopyTimer);
    copy?.classList.remove('event-copy-fade-out', 'event-copy-fade-in');
    sliders.forEach(({ current, next }) => {
      current.src = event.image;
      current.alt = t(event.titleKey);
      next.src = event.image;
      next.alt = '';
    });
    updateEvent();
    return;
  }
  eventTransitionRunning = true;
  window.clearTimeout(eventCopyTimer);
  copy?.classList.remove('event-copy-fade-in');
  copy?.classList.add('event-copy-fade-out');
  eventCopyTimer = window.setTimeout(() => {
    if (!eventTransitionRunning) return;
    updateEvent();
    copy?.classList.remove('event-copy-fade-out');
    copy?.classList.add('event-copy-fade-in');
  }, eventCopyFadeDelay);
  sliders.forEach(({ current, next }) => {
    next.src = event.image;
    next.alt = t(event.titleKey);
    current.classList.add('event-slide-out');
    next.classList.add('event-slide-in');
  });
  eventTransitionTimer = window.setTimeout(() => {
    if (!copy?.classList.contains('event-copy-fade-in')) updateEvent();
    copy?.classList.remove('event-copy-fade-out', 'event-copy-fade-in');
    sliders.forEach(({ current, next }) => {
      current.src = event.image;
      current.alt = t(event.titleKey);
      current.classList.remove('event-slide-out');
      next.classList.remove('event-slide-in');
    });
    eventTransitionTimer = null;
    eventCopyTimer = null;
    eventTransitionRunning = false;
  }, eventSlideDuration);
}
document.querySelectorAll('#eventPrev, [data-event-prev]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); queueEventStep(-1); }));
document.querySelectorAll('#eventNext, [data-event-next]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); queueEventStep(1); }));
document.addEventListener('click', event => { const dot = event.target.closest('[data-event-index]'); if (dot) { const nextIndex = Number(dot.dataset.eventIndex); renderEvent(nextIndex, true, nextIndex >= activeEventIndex ? 1 : -1); } });
document.querySelectorAll('[data-news-tab]').forEach(tab => tab.addEventListener('click', () => renderNewsTab(tab.dataset.newsTab)));
let eventSwipeStart = null;
  document.querySelectorAll('.event-hero, .event-feature').forEach(slider => {
  slider.addEventListener('pointerdown', event => { if (event.target.closest('.event-hero-controls, button')) return; eventSwipeStart = event.clientX; slider.setPointerCapture?.(event.pointerId); });
  slider.addEventListener('pointerup', event => {
    if (eventSwipeStart === null) return;
    const distance = event.clientX - eventSwipeStart;
    eventSwipeStart = null;
    if (Math.abs(distance) > 42) queueEventStep(distance < 0 ? 1 : -1);
  });
  slider.addEventListener('pointercancel', () => { eventSwipeStart = null; });
});
renderEvent(0, false);
renderNewsTab();
let testTimer;
let theme = localStorage.getItem('chunithm-theme') || 'light';
const defaultPortalUrl = 'https://portal.mumur.net/';
const readStoredValue = (key, legacyKey) => localStorage.getItem(key) || localStorage.getItem(legacyKey) || '';
let portalUrl = readStoredValue('chunithm-portal-url', 'chunithm-munet-url');
const storedPortalButtonText = readStoredValue('chunithm-portal-text', 'chunithm-munet-text');
let portalButtonText = storedPortalButtonText || t('portalDefault');
const moonPath = 'M512 964c-249.24 0-452-202.76-452-452 0-114.48 42.88-223.72 120.76-307.56 77.44-83.36 182.4-134.2 295.44-143.04a36.04 36.04 0 0 1 34.32 18.48 36 36 0 0 1-2.6 38.88C471.32 167.96 452 226.48 452 288c0 156.6 127.4 284 284 284 61.48 0 120-19.32 169.24-55.92a36 36 0 0 1 38.88-2.6 36.04 36.04 0 0 1 18.48 34.32c-8.88 113.08-59.68 218-143.04 295.44C735.72 921.12 626.52 964 512 964zM409.36 146.12C249.12 191.36 132 340 132 512c0 209.52 170.48 380 380 380 172 0 320.64-117.08 365.88-277.36-44.36 19.32-92.36 29.36-141.88 29.36-196.28 0-356-159.72-356-356 0-49.52 10-97.52 29.36-141.88z';
const sunPath = 'M752.41931153 240.7063601c8.36993432 0 15.62255883 3.08990502 21.72821045 9.16589356 6.1353147 6.08093262 9.18566918 13.3928833 9.18566918 21.73315382 0 8.55285621-3.05035376 15.85986352-9.18566918 21.94079614l-43.67394996 43.66900658c-5.93261719 5.97216773-13.17041016 8.95825195-21.72326709 8.95825195-8.87420678 0-16.20098901-2.98608422-22.08911085-8.75061035-5.88317847-5.87329102-8.80004906-13.2890625-8.80004906-22.14843774 0-8.54791283 2.95642114-15.75604272 8.91375732-21.72821044l43.66900659-43.67394996c6.14025879-6.07598853 13.44726539-9.16589356 21.98034668-9.16589356zM790.0815432 481.10095191h61.79809547c8.52813721 0 15.82031227 2.98608422 21.83697534 9.06207276C879.78271508 496.24395728 882.78857422 503.45208717 882.78857422 512c0 8.55285621-3.00585914 15.85986352-9.07196021 21.83697533-6.01666236 6.07598853-13.30883813 9.06207276-21.83697534 9.06207276h-61.79809547c-8.52813721 0-15.80053734-2.98608422-21.86663841-9.06207276-6.01666236-5.97711182-9.05712867-13.2890625-9.05712867-21.83697533 0-8.55285621 3.04046631-15.76098609 9.05712867-21.83697533 6.06610156-6.07598853 13.33850122-9.06207276 21.86663841-9.06207276zM512 141.21142578c8.52813721 0 15.79064917 3.08990502 21.85180688 9.06207276 6.02160645 6.08093262 9.05712867 13.3928833 9.05712867 21.83697533v61.79809546c0 8.55285621-3.03552222 15.85986352-9.0521853 21.83697534-6.06610107 6.07598853-13.32861305 9.16589355-21.85675025 9.16589355-8.53802467 0-15.80053734-3.08990502-21.86663842-9.16589355-6.01666236-5.97711182-9.0521853-13.2890625-9.05218458-21.83697534V172.11047387c0-8.44409203 3.03552222-15.76098609 9.05218458-21.83697533C496.20440674 144.3013308 503.46691871 141.21142578 512.00494408 141.21142578zM271.81304907 240.7063601c8.36499023 0 15.61267066 3.08990502 21.743042 9.16589356l43.66900659 43.67394996c6.14025879 6.07598853 9.17083764 13.38793922 9.17083764 21.72821044 0 8.55285621-3.01080323 15.86480689-9.05712938 21.83697534-6.03149391 6.08093262-13.30389404 9.06207276-21.85180617 9.06207275-8.69622827 0-16.02795386-2.98608422-21.95068359-8.85443115l-43.68383814-43.67395068c-5.97216773-5.97216773-8.92858886-13.28411842-8.92858886-22.03967284 0-8.55285621 3.00585914-15.76098609 9.07196021-21.83697462 6.01666236-5.97216773 13.30883813-9.06207276 21.85675096-9.06207276h-.03955126zM708.75030493 677.61889625c8.36499023 0 15.60772729 2.98608422 21.72326709 9.16589355l43.67394995 43.67395067c6.1353147 6.17980933 9.18566918 13.38793922 9.18566919 21.93585205 0 8.34521461-3.05035376 15.65716529-9.18566919 21.73315382-6.1105957 6.17980933-13.35827613 9.16589356-21.72326636 9.16589356-8.52813721 0-15.84008789-2.98608422-21.98034668-9.16589356l-43.66900659-43.66900587c-5.95733618-5.87329102-8.91375732-13.1852417-8.91375732-21.73315453 0-8.55285621 3.01080323-15.86480689 9.05712866-21.94079614 6.03149391-6.07598853 13.32861305-9.16589355 21.85180689-9.16589355h-.01977564zM512.00494408 388.40380836c-34.12243628 0-63.22192359 12.05310035-87.39239525 36.2532351-24.1358645 24.10125732-36.21368384 53.25018335-36.21368384 87.34295654 0 34.0927732 12.07782007 63.24169922 36.21368384 87.44677734C448.78796387 623.53814721 477.88250781 635.59619164 512 635.59619164c34.12243628 0 63.23181176-12.05310035 87.4072268-36.15435838C623.51837158 575.2466433 635.59619164 546.09771729 635.59619164c-34.0927732-34.12243628-12.07782007-63.24169922-36.18896484-87.34295654C575.23181176 400.45690942 546.12243628 388.40380836 512 388.40380836zM172.12036133 481.10095191h61.79809547c8.53802467 0 15.80053734 2.98608422 21.86663841 9.06207276 6.01666236 6.08093262 9.05712867 13.2890625 9.05712867 21.83697533 0 8.55285621-3.04046631 15.85986352-9.05712867 21.83697533-6.06610156 6.07598853-13.32861305 9.06207276-21.86663841 9.06207276h-61.79809547c-8.52813721 0-15.81042481-2.98608422-21.83697534-9.06207276C144.21728492 527.85986352 141.21142578 520.54791283 141.21142578 512c0-8.55285621 3.00585914-15.76098609 9.07196021-21.83697533 6.03149391-6.07598853 13.30883813-9.06207276 21.83697534-9.06207276zM512.00494408 759.19238258c8.52813721 0 15.79064917 2.98608422 21.85180617 9.06207274 6.02160645 6.08093262 9.05712867 13.2890625 9.05712938 21.83697535v61.79809546c0 8.52813721-3.03552222 15.85986352-9.0521853 21.83697533C527.79559326 879.80249 520.53308129 882.78857422 512 882.78857422c-8.53802467 0-15.80053734-2.98608422-21.86663842-9.06207276-6.01666236-5.97711182-9.0521853-13.2890625-9.05218458-21.83697533v-61.79809546c0-8.55285621 3.03552222-15.76098609 9.05218458-21.83697534 6.06610156-6.07598853 13.32861305-9.16589355 21.86663842-9.16589355zM315.52655029 677.61889625c8.5034182 0 15.80053734 2.98608422 21.84686279 9.16589355 6.03149391 6.08093262 9.07196021 13.3928833 9.07196021 21.94079614 0 8.44409203-3.08001685 15.65222192-9.19555664 21.72821044l-43.67394995 43.67394996c-6.10565162 6.17980933-13.34838867 9.16589356-21.72326637 9.16589356-8.54791283 0-15.84008789-2.98608422-21.85180687-8.96319533-6.07104516-6.07598853-9.0769043-13.38793922-9.0769043-21.93585205 0-8.65173364 2.95642114-15.96862769 8.92858887-21.94079614l43.68383813-43.66900658c6.10565162-6.17980933 13.44232202-9.16589355 21.95068359-9.16589355h.03955054zM512 326.60571289c33.628052 0 64.6506958 8.34521461 93.0481565 24.81811547 28.427123 16.69042992 50.921631 39.1404419 67.4637456 67.56756568 16.57177758 28.32824708 24.86755347 59.32617188 24.86755347 93.00860596 0 33.68243408-8.27600098 64.68035888-24.86755347 93.10748267-16.58166504 28.32824708-39.08605981 50.77825904-67.4637456 67.4637456-28.36285424 16.58166504-59.37561059 24.82305884-93.0481565 24.82305884-33.66760254 0-64.67047143-8.24139381-93.05804468-24.81811547-28.37768578-16.69042992-50.86230492-39.14538598-67.46374487-67.46868897-16.58166504-28.42712378-24.86755347-59.42504859-24.86755348-93.10748267 0-33.68243408 8.31555152-64.68035888 24.86755348-93.00860596 16.55200195-28.42712378 39.03662109-50.87713647 67.46374487-67.56262231C447.35424828 334.94598413 478.371948 326.60571289 512 326.60571289z';

const fixedSunMarkup = '<circle cx="512" cy="512" r="152" fill="currentColor"></circle><path d="M512 64v170M512 790v170M64 512h170M790 512h170M195 195l120 120M709 709l120 120M829 195L709 315M315 709L195 829" fill="none" stroke="currentColor" stroke-width="64" stroke-linecap="round"></path>';

function applyTheme(value) {
  theme = value === 'dark' ? 'dark' : 'light';
  document.querySelector('.page').classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('dark-mode', theme === 'dark');
  document.documentElement.classList.remove('theme-dark-preload');
  document.querySelectorAll('[data-icon-light][data-icon-dark]').forEach(icon => {
    icon.src = theme === 'dark' ? icon.dataset.iconDark : icon.dataset.iconLight;
  });
  byId('themeLabel').textContent = t(theme === 'dark' ? 'themeLight' : 'themeDark');
  byId('themeIcon').innerHTML = theme === 'dark' ? fixedSunMarkup : `<path d="${moonPath}"></path>`;
  byId('themeSelect').value = theme;
  syncThemeDropdown(theme);
  localStorage.setItem('chunithm-theme', theme);
}

function status(text, color = '#5caa74') {
  currentStatus = text;
  byId('statusText').textContent = translateKnownText(text);
  byId('statusDot').style.background = color;
  byId('statusDot').style.boxShadow = `0 0 0 4px ${color}22`;
}

function show(id, visible) {
  const element = byId(id);
  window.clearTimeout(element.hideTimer);
  element.classList.remove('closing');
  if (visible) {
    element.classList.add('show');
    return;
  }
  if (!element.classList.contains('show')) return;
  element.classList.add('closing');
  element.hideTimer = window.setTimeout(() => element.classList.remove('show', 'closing'), 210);
}

function render() {
  applyUserBackground(state.backgroundImagePath);
  byId('targetMode').textContent = state.targetMode;
  byId('originalMode').textContent = state.originalMode || t('unread');
  byId('primaryDisplay').textContent = state.primaryDisplayName || t('unselected');
  byId('startBatPath').textContent = state.startBatPath ? `⌘　${state.startBatPath}` : `⌘　${t('startBatNotSelected')}`;
  byId('version').textContent = `v${state.version || '1.4.0'}`;
  if (!storedPortalButtonText && ['打开MuNET', 'Open MuNET'].includes(portalButtonText)) portalButtonText = t('portalDefault');
  byId('portalTab').textContent = portalButtonText || t('portalDefault');
  byId('smartDisplayToggle').checked = !!state.smartDisplayEnabled;
  document.documentElement.style.setProperty('--accent', state.themeColor || '#fdd500');
  document.querySelectorAll('#launchMode button').forEach(button => button.classList.toggle('active', button.dataset.mode === state.launchMode));
  byId('launchMode').dataset.mode = state.launchMode;
}

let backgroundProbeToken = 0;
function applyUserBackground(path) {
  const page = document.querySelector('.page');
  if (!page) return;
  const normalizedPath = String(path || '').trim().replaceAll('\\', '/');
  const token = ++backgroundProbeToken;
  page.classList.remove('has-user-background');
  document.documentElement.style.setProperty('--user-bg', 'none');
  if (!normalizedPath) return;
  const cssPath = /^(?:https?:|data:|blob:|file:)/i.test(normalizedPath)
    ? normalizedPath
    : `file:///${normalizedPath.replace(/^\/+/, '')}`;
  const probe = new Image();
  probe.onload = () => {
    if (token !== backgroundProbeToken) return;
    document.documentElement.style.setProperty('--user-bg', `url("${cssPath.replaceAll('"', '\\"')}")`);
    page.classList.add('has-user-background');
  };
  probe.onerror = () => {
    if (token !== backgroundProbeToken) return;
    page.classList.remove('has-user-background');
  };
  probe.src = cssPath;
}

function fillDisplays(select, selected) {
  if (!select) return;
  select.innerHTML = `<option value="">${t('chooseDisplay')}</option>`;
  state.displays.forEach(display => {
    const option = document.createElement('option'); option.value = display.id; option.textContent = display.name;
    option.selected = display.id === selected; select.appendChild(option);
  });
  select.value = selected || '';
  if (select.id === 'displaySelectSetting') syncDisplayDropdown(selected);
  if (select.id === 'displaySelect') syncFirstRunDropdown(selected);
}

function syncDisplayDropdown(selected = byId('displaySelectSetting')?.value || '') {
  const valueNode = byId('displaySelectValue');
  const optionsNode = byId('displaySelectOptions');
  if (!valueNode || !optionsNode) return;
  const selectedDisplay = state.displays.find(display => display.id === selected);
  valueNode.textContent = selectedDisplay?.name || t('chooseDisplay');
  optionsNode.innerHTML = '';
  state.displays.forEach(display => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'display-picker-option';
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', display.id === selected ? 'true' : 'false');
    option.textContent = display.name;
    option.onclick = () => {
      setPrimary(display.id);
      setDisplayDropdownOpen(false);
    };
    optionsNode.appendChild(option);
  });
}

function syncFirstRunDropdown(selected = byId('displaySelect')?.value || '') {
  const valueNode = byId('displaySelectValueFirstRun');
  const optionsNode = byId('displaySelectOptionsFirstRun');
  if (!valueNode || !optionsNode) return;
  const selectedDisplay = state.displays.find(display => display.id === selected);
  valueNode.textContent = selectedDisplay?.name || t('chooseDisplay');
  optionsNode.innerHTML = '';
  state.displays.forEach(display => {
    const option = document.createElement('button');
    option.type = 'button'; option.className = 'display-picker-option'; option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', display.id === selected ? 'true' : 'false'); option.textContent = display.name;
    option.onclick = () => { setPrimary(display.id); setFirstRunDropdownOpen(false); };
    optionsNode.appendChild(option);
  });
}

function positionDisplayDropdown() {
  const dropdown = byId('displayDropdownSetting');
  const trigger = byId('displaySelectTrigger');
  const panel = byId('displaySelectPanel');
  if (!dropdown?.classList.contains('open') || !trigger || !panel) return;
  const rect = trigger.getBoundingClientRect();
  const gap = 7;
  const contentHeight = Math.min(280, panel.scrollHeight || 280);
  const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - gap);
  const spaceAbove = Math.max(0, rect.top - gap);
  const opensAbove = spaceBelow < contentHeight && spaceAbove > spaceBelow;
  const maxHeight = Math.max(0, Math.min(contentHeight, opensAbove ? spaceAbove : spaceBelow));
  const top = opensAbove ? rect.top - gap - maxHeight : rect.bottom + gap;
  panel.style.setProperty('--dropdown-top', `${Math.max(8, top)}px`);
  panel.style.setProperty('--dropdown-left', `${rect.left}px`);
  panel.style.setProperty('--dropdown-width', `${rect.width}px`);
  panel.style.setProperty('--dropdown-max-height', `${maxHeight}px`);
}

function setDisplayDropdownOpen(open) {
  const dropdown = byId('displayDropdownSetting');
  const trigger = byId('displaySelectTrigger');
  const panel = byId('displaySelectPanel');
  if (!dropdown || !trigger || !panel) return;
  dropdown.classList.toggle('open', open);
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) {
    requestAnimationFrame(positionDisplayDropdown);
  }
}

function positionFirstRunDropdown() {
  const dropdown = byId('displayDropdownFirstRun');
  const trigger = byId('displaySelectTriggerFirstRun');
  const panel = byId('displaySelectPanelFirstRun');
  if (!dropdown?.classList.contains('open') || !trigger || !panel) return;
  const rect = trigger.getBoundingClientRect(); const gap = 7;
  const contentHeight = Math.min(280, panel.scrollHeight || 280);
  const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - gap); const spaceAbove = Math.max(0, rect.top - gap);
  const opensAbove = spaceBelow < contentHeight && spaceAbove > spaceBelow;
  const maxHeight = Math.max(0, Math.min(contentHeight, opensAbove ? spaceAbove : spaceBelow));
  panel.style.setProperty('--dropdown-top', `${Math.max(8, opensAbove ? rect.top - gap - maxHeight : rect.bottom + gap)}px`);
  panel.style.setProperty('--dropdown-left', `${rect.left}px`); panel.style.setProperty('--dropdown-width', `${rect.width}px`);
  panel.style.setProperty('--dropdown-max-height', `${maxHeight}px`);
}

function setFirstRunDropdownOpen(open) {
  const dropdown = byId('displayDropdownFirstRun'); const trigger = byId('displaySelectTriggerFirstRun'); const panel = byId('displaySelectPanelFirstRun');
  if (!dropdown || !trigger || !panel) return;
  dropdown.classList.toggle('open', open); trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) requestAnimationFrame(positionFirstRunDropdown);
}

function syncThemeDropdown(value = theme) {
  const valueNode = byId('themeSelectValueFirstRun'); const optionsNode = byId('themeSelectOptionsFirstRun');
  if (!valueNode || !optionsNode) return;
  const labels = { light: t('themeLightMode'), dark: t('themeDarkMode') };
  valueNode.textContent = labels[value] || labels.light;
  optionsNode.innerHTML = '';
  Object.entries(labels).forEach(([key, label]) => {
    const option = document.createElement('button'); option.type = 'button'; option.className = 'display-picker-option'; option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', key === value ? 'true' : 'false'); option.textContent = label;
    option.onclick = () => { byId('themeSelect').value = key; applyTheme(key); setThemeDropdownOpen(false); };
    optionsNode.appendChild(option);
  });
}

function positionThemeDropdown() {
  const dropdown = byId('themeDropdownFirstRun'); const trigger = byId('themeSelectTriggerFirstRun'); const panel = byId('themeSelectPanelFirstRun');
  if (!dropdown?.classList.contains('open') || !trigger || !panel) return;
  const rect = trigger.getBoundingClientRect(); const gap = 7; const contentHeight = Math.min(280, panel.scrollHeight || 280);
  const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - gap); const spaceAbove = Math.max(0, rect.top - gap);
  const opensAbove = spaceBelow < contentHeight && spaceAbove > spaceBelow; const maxHeight = Math.max(0, Math.min(contentHeight, opensAbove ? spaceAbove : spaceBelow));
  panel.style.setProperty('--dropdown-top', `${Math.max(8, opensAbove ? rect.top - gap - maxHeight : rect.bottom + gap)}px`); panel.style.setProperty('--dropdown-left', `${rect.left}px`); panel.style.setProperty('--dropdown-width', `${rect.width}px`); panel.style.setProperty('--dropdown-max-height', `${maxHeight}px`);
}

function setThemeDropdownOpen(open) {
  const dropdown = byId('themeDropdownFirstRun'); const trigger = byId('themeSelectTriggerFirstRun'); const panel = byId('themeSelectPanelFirstRun');
  if (!dropdown || !trigger || !panel) return;
  dropdown.classList.toggle('open', open); trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) requestAnimationFrame(positionThemeDropdown);
}

function syncLanguageDropdown(value = languagePreference) {
  const valueNode = byId('languageSelectValue');
  const optionsNode = byId('languageSelectOptions');
  if (!valueNode || !optionsNode) return;
  const labels = { system: t('followSystem'), 'zh-CN': t('simplifiedChinese'), 'en-US': t('english'), 'ja-JP': t('japanese'), 'ko-KR': t('korean'), 'fr-FR': t('french'), 'es-ES': t('spanish'), 'de-DE': t('german') };
  valueNode.textContent = labels[value] || labels.system;
  optionsNode.replaceChildren(...Object.entries(labels).map(([key, label]) => {
    const option = document.createElement('button');
    option.type = 'button'; option.className = 'display-picker-option'; option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', key === value ? 'true' : 'false'); option.textContent = label;
    option.onclick = () => { byId('languageSelect').value = key; setLanguagePreference(key); setLanguageDropdownOpen(false); };
    return option;
  }));
}

function positionLanguageDropdown() {
  const dropdown = byId('languageDropdownSetting');
  const trigger = byId('languageSelectTrigger');
  const panel = byId('languageSelectPanel');
  if (!dropdown?.classList.contains('open') || !trigger || !panel) return;
  const rect = trigger.getBoundingClientRect(); const gap = 7;
  const contentHeight = Math.min(280, panel.scrollHeight || 280);
  const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - gap); const spaceAbove = Math.max(0, rect.top - gap);
  const opensAbove = spaceBelow < contentHeight && spaceAbove > spaceBelow; const maxHeight = Math.max(0, Math.min(contentHeight, opensAbove ? spaceAbove : spaceBelow));
  panel.style.setProperty('--dropdown-top', `${Math.max(8, opensAbove ? rect.top - gap - maxHeight : rect.bottom + gap)}px`);
  panel.style.setProperty('--dropdown-left', `${rect.left}px`); panel.style.setProperty('--dropdown-width', `${rect.width}px`); panel.style.setProperty('--dropdown-max-height', `${maxHeight}px`);
}

function setLanguageDropdownOpen(open) {
  const dropdown = byId('languageDropdownSetting'); const trigger = byId('languageSelectTrigger');
  if (!dropdown || !trigger) return;
  dropdown.classList.toggle('open', open); trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) requestAnimationFrame(positionLanguageDropdown);
}

function fillSettings() {
  byId('runBatAsAdministrator').checked = state.runBatAsAdministrator !== false;
  byId('terminateCmdBeforeLaunch').checked = state.terminateCmdBeforeLaunch !== false;
  byId('startBatSetting').value = state.startBatPath;
  byId('originalModeInputSetting').value = state.originalMode;
  byId('targetModeSetting').value = state.targetMode;
  byId('target60HzToggle').checked = /@ 60hz/i.test(state.targetMode);
  byId('themeColor').value = state.themeColor;
  byId('themeColorText').value = state.themeColor;
  byId('bgImageInput').value = state.backgroundImagePath;
  byId('portalButtonText').value = portalButtonText;
  byId('portalUrl').value = portalUrl || defaultPortalUrl;
  byId('languageSelect').value = languagePreference;
  fillDisplays(byId('displaySelectSetting'), state.primaryDisplay);
  byId('languageSelect').value = languagePreference;
  syncLanguageDropdown(languagePreference);
}

function setPrimary(id) {
  const display = state.displays.find(item => item.id === id); if (!display) return;
  state.primaryDisplay = id; state.primaryDisplayName = display.name;
  byId('displaySelect').value = id; byId('displaySelectSetting').value = id; syncFirstRunDropdown(id); syncDisplayDropdown(id); render();
  post('set-primary-display', { primaryDisplay: id });
}

function detectDisplays() {
  post('detect-displays-preview');
  if (window.chrome?.webview) return;
  state.displays = [
    { id: '\\\\.\\DISPLAY1', name: '\\\\.\\DISPLAY1 · 2560×1440 @ 144Hz', selected: true },
    { id: '\\\\.\\DISPLAY2', name: '\\\\.\\DISPLAY2 · 1920×1080 @ 60Hz' },
  ];
  state.primaryDisplay = state.displays[0].id; state.primaryDisplayName = state.displays[0].name;
  fillDisplays(byId('displaySelect'), state.primaryDisplay); fillDisplays(byId('displaySelectSetting'), state.primaryDisplay); render();
}

function saveSettings() {
  const startBatPath = byId('startBatSetting').value || byId('startBat').value;
  const primaryDisplay = byId('displaySelectSetting').value || state.primaryDisplay;
  if (!startBatPath.trim() || !primaryDisplay) return status('请先完成配置', '#bd5f68');
  state.startBatPath = startBatPath; state.primaryDisplay = primaryDisplay;
  state.originalMode = byId('originalModeInputSetting').value; state.targetMode = byId('targetModeSetting').value;
  state.themeColor = byId('themeColorText').value || byId('themeColor').value;
  applyTheme(byId('themeSelect').value);
  state.backgroundImagePath = byId('bgImageInput').value;
  portalButtonText = byId('portalButtonText').value.trim() || t('portalDefault');
  portalUrl = byId('portalUrl').value.trim() || defaultPortalUrl;
  localStorage.setItem('chunithm-portal-text', portalButtonText);
  localStorage.setItem('chunithm-portal-url', portalUrl);
  state.runBatAsAdministrator = byId('runBatAsAdministrator').checked;
  state.terminateCmdBeforeLaunch = byId('terminateCmdBeforeLaunch').checked;
  state.language = byId('languageSelect').value;
  setLanguagePreference(state.language);
  post('save-settings', { startBatPath, primaryDisplay, originalMode: state.originalMode, targetMode: state.targetMode, launchMode: state.launchMode, smartDisplayEnabled: state.smartDisplayEnabled, runBatAsAdministrator: state.runBatAsAdministrator, terminateCmdBeforeLaunch: state.terminateCmdBeforeLaunch, themeColor: state.themeColor, backgroundImagePath: state.backgroundImagePath, language: state.language });
  show('settingsModal', false); show('firstRun', false); render(); status('设置已保存');
}

function openPortal() {
  let url = portalUrl.trim();
  if (!url) {
    const enteredUrl = window.prompt(activeLanguage === 'en-US' ? 'Before opening MuNET, confirm the web link:' : '首次打开 MuNET，请确认网页链接：', defaultPortalUrl);
    if (enteredUrl === null) return;
    url = enteredUrl.trim() || defaultPortalUrl;
  }
  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('unsupported protocol');
  } catch {
    return status('网页链接格式不正确', '#bd5f68');
  }
  portalUrl = url;
  localStorage.setItem('chunithm-portal-url', portalUrl);
  if (window.chrome?.webview) {
    post('open-munet', { url: portalUrl });
  } else {
    window.open(portalUrl, '_blank', 'noopener,noreferrer');
  }
}

function init(payload) {
  Object.assign(state, payload, { displays: payload.displays || [] });
  if (payload.language) setLanguagePreference(payload.language, { persist: false });
  syncAppleChuStatus();
  state.primaryDisplay = state.primaryDisplay || state.displays.find(item => item.selected)?.id || '';
  state.primaryDisplayName = state.primaryDisplayName && state.primaryDisplayName !== '未选择' ? state.primaryDisplayName : state.displays.find(item => item.id === state.primaryDisplay)?.name || '';
  byId('startBat').value = state.startBatPath; fillDisplays(byId('displaySelect'), state.primaryDisplay); render();
  show('firstRun', !state.startBatPath || !state.primaryDisplay);
}

function showAnnouncement(payload) {
  const title = String(payload.title || '').trim();
  const body = String(payload.body || '').trim();
  if (!title || !body) return;

  byId('announcementTitle').textContent = title;
  byId('announcementBody').textContent = body;
  const actionButton = byId('btnAnnouncementAction');
  const action = payload.action;
  const hasAction = action && typeof action.url === 'string' && /^https:\/\//i.test(action.url);
  actionButton.hidden = !hasAction;
  actionButton.textContent = hasAction ? String(action.label || '查看详情') : '';
  actionButton.dataset.url = hasAction ? action.url : '';
  show('announcementModal', true);
  byId(hasAction ? 'btnAnnouncementAction' : 'btnCloseAnnouncement').focus();
}

function syncAppleChuStatus() {
  const button = byId('btnMigrateToAppleChu');
  if (!button) return;
  const enabled = !!state.appleChuEnabled;
  button.textContent = enabled ? (activeLanguage === 'en-US' ? 'AppleChu enabled' : '已启用Applechu') : t('migrateAppleChu');
  button.classList.toggle('applechu-enabled', enabled);
  button.disabled = enabled;
}

function handleMessage(event) {
  const data = event.data || event; if (!data?.type) return; const p = data.payload || {};
  if (data.type === 'init') init(p);
  if (data.type === 'announcement') showAnnouncement(p);
  if (data.type === 'status') status(p.text || '待机', p.color || '#5caa74');
  if (data.type === 'update-target') { state.targetMode = p.value || ''; byId('targetModeSetting').value = state.targetMode; render(); }
  if (data.type === 'update-original') { state.originalMode = p.value || ''; byId('originalModeInputSetting').value = state.originalMode; render(); }
  if (data.type === 'update-start-bat') { state.startBatPath = p.path || ''; state.appleChuEnabled = !!p.appleChuEnabled; syncAppleChuStatus(); byId('startBat').value = state.startBatPath; byId('startBatSetting').value = state.startBatPath; render(); }
  if (data.type === 'update-background-image') {
    state.backgroundImagePath = p.path || '';
    byId('bgImageInput').value = state.backgroundImagePath;
    render();
  }
  if (data.type === 'update-displays') { state.displays = p.displays || []; state.primaryDisplay = state.displays.find(item => item.selected)?.id || ''; state.primaryDisplayName = p.primaryDisplayName && p.primaryDisplayName !== '未选择' ? p.primaryDisplayName : ''; fillDisplays(byId('displaySelect'), state.primaryDisplay); fillDisplays(byId('displaySelectSetting'), state.primaryDisplay); render(); }
  if (data.type === 'test-switch-state') {
    if (p.active) {
      byId('btnTestSwitch').textContent = activeLanguage === 'en-US' ? `Restore original resolution (${p.timeoutSeconds || 15}s)` : `恢复原始分辨率 (${p.timeoutSeconds || 15}s)`;
    } else {
      byId('btnTestSwitch').textContent = t('testSwitch');
    }
  }
}

byId('btnLaunch').onclick = () => {
  post('launch-game');
  status('启动中', '#d6944e');
};
byId('friendSearchForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const input = byId('friendSearchInput');
  if (input) input.value = '';
});
byId('btnSettings').onclick = () => { fillSettings(); show('settingsModal', true); };
byId('portalTab').onclick = openPortal;
byId('themeToggle').onclick = () => applyTheme(theme === 'dark' ? 'light' : 'dark');
byId('themeSelect').onchange = event => applyTheme(event.target.value);
byId('languageSelectTrigger').onclick = () => setLanguageDropdownOpen(!byId('languageDropdownSetting').classList.contains('open'));
byId('languageSelectTrigger').onkeydown = event => {
  if (event.key === 'Escape') setLanguageDropdownOpen(false);
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setLanguageDropdownOpen(true); }
};
byId('themeSelectTriggerFirstRun').onclick = () => setThemeDropdownOpen(!byId('themeDropdownFirstRun').classList.contains('open'));
byId('themeSelectTriggerFirstRun').onkeydown = event => {
  if (event.key === 'Escape') setThemeDropdownOpen(false);
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setThemeDropdownOpen(true); }
};
byId('btnCloseSettings').onclick = () => show('settingsModal', false);
byId('btnDonate').onclick = () => { show('donationModal', true); byId('btnCopyDonation').focus(); };
byId('btnCloseDonation').onclick = () => show('donationModal', false);
byId('btnCloseAnnouncement').onclick = () => show('announcementModal', false);
byId('btnAnnouncementAction').onclick = () => {
  const url = byId('btnAnnouncementAction').dataset.url;
  if (url) post('open-announcement-link', { url });
};
byId('btnCopyDonation').onclick = async () => {
  const address = byId('donationAddress').textContent.trim();
  const hint = byId('donationHint');
  try {
    await navigator.clipboard.writeText(address);
    hint.textContent = t('statusCopied');
  } catch {
    hint.textContent = t('statusCopyFailed');
  }
};
byId('btnSaveSettings').onclick = saveSettings; byId('btnSave').onclick = saveSettings;
byId('btnPickBat').onclick = () => post('pick-start-bat'); byId('btnPickBatSetting').onclick = () => post('pick-start-bat-preview');
byId('btnDetectDisplays').onclick = detectDisplays; byId('btnDetectDisplaysSetting').onclick = detectDisplays;
byId('btnReadCurrentSetting').onclick = () => post('read-current-mode-preview', { primaryDisplay: byId('displaySelectSetting').value });
byId('displaySelectTrigger').onclick = () => setDisplayDropdownOpen(!byId('displayDropdownSetting').classList.contains('open'));
byId('displaySelectTrigger').onkeydown = event => {
  if (event.key === 'Escape') setDisplayDropdownOpen(false);
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    setDisplayDropdownOpen(true);
  }
};
byId('displaySelectTriggerFirstRun').onclick = () => setFirstRunDropdownOpen(!byId('displayDropdownFirstRun').classList.contains('open'));
byId('displaySelectTriggerFirstRun').onkeydown = event => {
  if (event.key === 'Escape') setFirstRunDropdownOpen(false);
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFirstRunDropdownOpen(true); }
};
byId('btnMigrateToAppleChu').onclick = () => post('open-chuchart-manager-actions');
byId('btnEditAppleChu').onclick = () => post('open-chuchart-manager-actions');
byId('btnBrowseBg').onclick = () => post('pick-background-image-preview'); byId('btnCheckUpdate').onclick = () => post('check-update'); byId('btnOpenGithubHome').onclick = () => post('open-github-home');
byId('smartDisplayToggle').onchange = event => { state.smartDisplayEnabled = event.target.checked; post('set-smart-display', { enabled: state.smartDisplayEnabled }); };
byId('target60HzToggle').onchange = event => { byId('targetModeSetting').value = event.target.checked ? '1920×1080 @ 60Hz' : '1920×1080 @ 120Hz'; };
byId('themeColor').oninput = event => { byId('themeColorText').value = event.target.value; document.documentElement.style.setProperty('--accent', event.target.value); };
byId('themeColorText').onchange = event => { byId('themeColor').value = event.target.value; document.documentElement.style.setProperty('--accent', event.target.value); };
byId('displaySelectSetting').onchange = event => setPrimary(event.target.value); byId('displaySelect').onchange = event => setPrimary(event.target.value);
document.addEventListener('click', event => {
  if (!byId('displayDropdownSetting')?.contains(event.target)) setDisplayDropdownOpen(false);
  if (!byId('displayDropdownFirstRun')?.contains(event.target)) setFirstRunDropdownOpen(false);
  if (!byId('themeDropdownFirstRun')?.contains(event.target)) setThemeDropdownOpen(false);
  if (!byId('languageDropdownSetting')?.contains(event.target)) setLanguageDropdownOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && byId('donationModal')?.classList.contains('show')) show('donationModal', false);
  if (event.key === 'Escape' && byId('announcementModal')?.classList.contains('show')) show('announcementModal', false);
});
window.addEventListener('resize', positionDisplayDropdown);
window.addEventListener('resize', positionFirstRunDropdown);
window.addEventListener('scroll', positionDisplayDropdown, true);
window.addEventListener('scroll', positionFirstRunDropdown, true);
window.addEventListener('resize', positionThemeDropdown);
window.addEventListener('scroll', positionThemeDropdown, true);
window.addEventListener('resize', positionLanguageDropdown);
window.addEventListener('scroll', positionLanguageDropdown, true);
document.querySelectorAll('#launchMode button').forEach(button => button.onclick = () => { state.launchMode = button.dataset.mode; post('set-launch-mode', { mode: state.launchMode }); render(); });
byId('btnTestSwitch').onclick = () => { if (testTimer) { post('restore-original'); clearInterval(testTimer); testTimer = null; byId('btnTestSwitch').textContent = '测试切换'; return; } post('test-switch'); let seconds = 15; byId('btnTestSwitch').textContent = `恢复原始分辨率 (${seconds}s)`; testTimer = setInterval(() => { seconds -= 1; byId('btnTestSwitch').textContent = `恢复原始分辨率 (${seconds}s)`; if (seconds <= 0) { clearInterval(testTimer); testTimer = null; byId('btnTestSwitch').textContent = '测试切换'; } }, 1000); };

window.addEventListener('message', handleMessage);
window.chrome?.webview?.addEventListener('message', handleMessage);
render();
applyTheme(theme);
applyTranslations();
// 浏览器预览:仅当非 WebView2 环境且 URL 带 ?preview 时注入假数据。
// 版本号不再硬编码(缺省显示 'preview',可用 ?version=x 覆盖),避免与发布版本漂移。
if (!window.chrome?.webview && new URLSearchParams(location.search).has('preview')) {
  const previewVersion = new URLSearchParams(location.search).get('version') || 'preview';
  setTimeout(() => init({ version: previewVersion, startBatPath: 'D:\\SDHD\\bin\\start.bat', primaryDisplayName: '\\\\.\\DISPLAY1 · 2560×1440 @ 144Hz', primaryDisplay: '\\\\.\\DISPLAY1', originalMode: '2560×1440 @ 144Hz', displays: [{ id: '\\\\.\\DISPLAY1', name: '\\\\.\\DISPLAY1 · 2560×1440 @ 144Hz', selected: true }, { id: '\\\\.\\DISPLAY2', name: '\\\\.\\DISPLAY2 · 1920×1080 @ 60Hz' }] }), 180);
}
