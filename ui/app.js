const ui = {
  statusText: document.querySelector('#status .text'),
  statusDot: document.querySelector('#status .dot'),
  testSwitchButton: document.getElementById('btnTestSwitch'),
  originalModeCard: document.getElementById('originalModeCard'),
  targetMode: document.getElementById('targetMode'),
  appVersion: document.getElementById('appVersion'),
  firstRun: document.getElementById('firstRun'),
  settingsModal: document.getElementById('settingsModal'),
  bgImage: document.getElementById('bgImage'),
  bgImageInput: document.getElementById('bgImageInput'),
  startBat: document.getElementById('startBat'),
  displaySelect: document.getElementById('displaySelect'),
  startBatSetting: document.getElementById('startBatSetting'),
  displaySelectSetting: document.getElementById('displaySelectSetting'),
  originalModeInputSetting: document.getElementById('originalModeInputSetting'),
  targetModeSetting: document.getElementById('targetModeSetting'),
  target60HzToggle: document.getElementById('target60HzToggle'),
  smartDisplayToggle: document.getElementById('smartDisplayToggle'),
  themeColor: document.getElementById('themeColor'),
  themeColorText: document.getElementById('themeColorText'),
  startBatHover: document.getElementById('startBatHover'),
  primaryDisplayHover: document.getElementById('primaryDisplayHover'),
  originalModeHover: document.getElementById('originalModeHover'),
};

let currentThemeColor = '#fdd500';
let currentBgImage = localStorage.getItem('bgImage') || '';
let isTestSwitchActive = false;
let testSwitchCountdownTimer = null;
let testSwitchRemainingSeconds = 0;
let currentSettings = {
  startBatPath: '',
  primaryDisplay: '',
  primaryDisplayName: '未选择',
  originalMode: '',
  targetMode: '1920×1080 @ 120Hz',
  launchMode: 'smart',
  smartDisplayEnabled: false,
  themeColor: '#fdd500',
  backgroundImagePath: '',
  displays: [],
};
let draftSettings = null;

const post = (type, payload = {}) => {
  if (window.chrome && window.chrome.webview) {
    window.chrome.webview.postMessage({ type, payload });
  } else {
    console.log('postMessage', type, payload);
  }
};

const byId = (id) => document.getElementById(id);
const onClick = (id, handler) => {
  const el = byId(id);
  if (el) {
    el.addEventListener('click', handler);
  }
};

const setStatus = (text, color = '#7dffa0') => {
  ui.statusText.textContent = text;
  ui.statusDot.style.background = color;
  ui.statusDot.style.boxShadow = `0 0 10px ${color}`;
};

const cloneSettings = (value) => JSON.parse(JSON.stringify(value));

const getSelectedTargetMode = () => (ui.target60HzToggle?.checked ? '1920×1080 @ 60Hz' : '1920×1080 @ 120Hz');

const syncTargetModeSetting = (value) => {
  const targetMode = value || '1920×1080 @ 120Hz';
  if (ui.targetModeSetting) ui.targetModeSetting.value = targetMode;
  if (ui.target60HzToggle) ui.target60HzToggle.checked = /@ 60hz/i.test(targetMode);
};

const isValidPrimaryDisplay = (value) => {
  const displayId = (value || '').trim();
  return !!displayId && displayId !== '请先选择';
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
};

const rgbToHex = (r, g, b) => {
  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const mixWithWhite = (hex, amount = 0.35) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.round(rgb.r + (255 - rgb.r) * amount);
  const g = Math.round(rgb.g + (255 - rgb.g) * amount);
  const b = Math.round(rgb.b + (255 - rgb.b) * amount);
  return rgbToHex(clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255));
};

const withAlpha = (hex, alpha) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(253, 213, 0, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

const toCssUrl = (value) => {
  const input = (value || '').trim();
  if (!input) return '';
  if (/^https?:\/\//i.test(input) || /^data:/i.test(input) || /^file:\/\//i.test(input)) {
    return input;
  }

  const normalized = input.replace(/\\/g, '/');
  if (/^[a-zA-Z]:\//.test(normalized)) {
    return `file:///${normalized}`;
  }

  return normalized;
};

const applyThemeColor = (color) => {
  const hex = color?.toLowerCase() || '#fdd500';
  if (!/^#[0-9a-f]{6}$/.test(hex)) return;
  currentThemeColor = hex;

  const accent2 = mixWithWhite(hex, 0.35);
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-2', accent2);
  document.documentElement.style.setProperty('--logo-from', hex);
  document.documentElement.style.setProperty('--logo-to', accent2);
  document.documentElement.style.setProperty('--glow-1', withAlpha(hex, 0.45));
  document.documentElement.style.setProperty('--glow-2', withAlpha(accent2, 0.35));

  if (ui.themeColor) ui.themeColor.value = hex;
  if (ui.themeColorText) ui.themeColorText.value = hex;
};

const applyBackground = (value, persist = true) => {
  const path = (value || '').trim();
  currentBgImage = path;

  if (ui.bgImage) {
    const cssUrl = toCssUrl(path);
    ui.bgImage.style.backgroundImage = cssUrl ? `url("${cssUrl}")` : 'none';
  }
  if (ui.bgImageInput) ui.bgImageInput.value = path;

  if (persist) {
    localStorage.setItem('bgImage', path);
    post('set-background-image', { path });
  }
};

const toggleModal = (el, show) => {
  if (!el) return;
  if (show) {
    window.clearTimeout(el._closeTimer);
    el.classList.remove('closing');
    el.classList.add('show');
    return;
  }

  el.classList.add('closing');
  window.clearTimeout(el._closeTimer);
  el._closeTimer = window.setTimeout(() => {
    el.classList.remove('show', 'closing');
  }, 220);
};

const clearTestSwitchCountdown = () => {
  if (testSwitchCountdownTimer) {
    clearInterval(testSwitchCountdownTimer);
    testSwitchCountdownTimer = null;
  }
};

const renderTestSwitchButton = () => {
  if (!ui.testSwitchButton) return;
  if (!isTestSwitchActive) {
    ui.testSwitchButton.dataset.state = 'test';
    ui.testSwitchButton.textContent = '测试切换';
    ui.testSwitchButton.classList.remove('danger');
    return;
  }

  const seconds = Math.max(0, Math.ceil(testSwitchRemainingSeconds));
  ui.testSwitchButton.dataset.state = 'restore';
  ui.testSwitchButton.textContent = `恢复原始分辨率 (${seconds}s)`;
  ui.testSwitchButton.classList.add('danger');
};

const startTestSwitchCountdown = (seconds) => {
  clearTestSwitchCountdown();
  testSwitchRemainingSeconds = Math.max(0, Number(seconds) || 0);
  renderTestSwitchButton();

  if (testSwitchRemainingSeconds <= 0) {
    return;
  }

  testSwitchCountdownTimer = setInterval(() => {
    testSwitchRemainingSeconds = Math.max(0, testSwitchRemainingSeconds - 1);
    renderTestSwitchButton();
    if (testSwitchRemainingSeconds <= 0) {
      clearTestSwitchCountdown();
    }
  }, 1000);
};

const setTestSwitchButtonState = (active, timeoutSeconds = 15) => {
  isTestSwitchActive = active;
  if (!active) {
    clearTestSwitchCountdown();
    testSwitchRemainingSeconds = 0;
    renderTestSwitchButton();
    return;
  }

  startTestSwitchCountdown(timeoutSeconds);
};

const updateMeta = () => {
  const startBat = ui.startBatSetting?.value || ui.startBat?.value || '未选择';
  if (ui.startBatHover) ui.startBatHover.textContent = startBat;
  if (ui.primaryDisplayHover && !ui.primaryDisplayHover.textContent.trim()) ui.primaryDisplayHover.textContent = '未选择';
  if (ui.originalModeHover && !ui.originalModeHover.textContent.trim()) ui.originalModeHover.textContent = '未读取';
};

const renderDisplays = (displays = [], selectedId = '') => {
  const html = '<option value="">请先选择</option>';
  if (ui.displaySelect) ui.displaySelect.innerHTML = html;
  if (ui.displaySelectSetting) ui.displaySelectSetting.innerHTML = html;

  displays.forEach((d) => {
    const selected = d.id === selectedId;

    if (ui.displaySelect) {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      opt.selected = selected;
      ui.displaySelect.appendChild(opt);
    }

    if (ui.displaySelectSetting) {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      opt.selected = selected;
      ui.displaySelectSetting.appendChild(opt);
    }
  });
};

const setLaunchModeUi = (mode) => {
  const normalizedMode = mode === 'manual' ? 'manual' : 'smart';
  const launchMode = document.getElementById('launchMode');
  if (launchMode) launchMode.dataset.mode = normalizedMode;
  segs.forEach((s) => s.classList.toggle('active', s.dataset.mode === mode));
};

const syncDraftToSettingsForm = () => {
  if (!draftSettings) return;

  if (ui.startBatSetting) ui.startBatSetting.value = draftSettings.startBatPath || '';
  if (ui.displaySelectSetting) ui.displaySelectSetting.value = draftSettings.primaryDisplay || '';
  if (ui.originalModeInputSetting) ui.originalModeInputSetting.value = draftSettings.originalMode || '';
  if (ui.smartDisplayToggle) ui.smartDisplayToggle.checked = !!draftSettings.smartDisplayEnabled;
  if (ui.bgImageInput) ui.bgImageInput.value = draftSettings.backgroundImagePath || '';
  if (ui.themeColor) ui.themeColor.value = draftSettings.themeColor || '#fdd500';
  if (ui.themeColorText) ui.themeColorText.value = draftSettings.themeColor || '#fdd500';
  syncTargetModeSetting(draftSettings.targetMode || '1920×1080 @ 120Hz');
  setLaunchModeUi(draftSettings.launchMode || 'smart');
};

const openSettingsModal = () => {
  draftSettings = cloneSettings(currentSettings);
  renderDisplays(draftSettings.displays, draftSettings.primaryDisplay);
  syncDraftToSettingsForm();
  toggleModal(ui.settingsModal, true);
};

const closeSettingsModal = () => {
  draftSettings = null;
  toggleModal(ui.settingsModal, false);
};

onClick('btnLaunch', () => post('launch-game'));
onClick('btnTestSwitch', () => {
  if (isTestSwitchActive) {
    post('restore-original');
    return;
  }

  post('test-switch');
});
onClick('btnSettings', () => openSettingsModal());
onClick('btnCloseSettings', () => closeSettingsModal());
onClick('btnApplyBg', () => {
  if (!draftSettings) return;
  draftSettings.backgroundImagePath = ui.bgImageInput?.value || '';
  setStatus('已暂存背景图片，点击“保存设置”后生效', '#ffb36a');
});
onClick('btnBrowseBg', () => post('pick-background-image-preview'));

onClick('btnPickBat', () => post('pick-start-bat'));
onClick('btnDetectDisplays', () => post('detect-displays'));
onClick('btnSave', () => {
  const startBatPath = ui.startBat?.value || '';
  const primaryDisplay = ui.displaySelect?.value || '';
  if (!startBatPath.trim()) {
    setStatus('请先选择 start.bat', '#ff5a6a');
    return;
  }

  if (!isValidPrimaryDisplay(primaryDisplay)) {
    setStatus('请先选择主显示器', '#ff5a6a');
    return;
  }

  post('save-settings', {
    startBatPath,
    primaryDisplay,
    backgroundImagePath: ui.bgImageInput?.value || '',
  });

  toggleModal(ui.firstRun, false);
  updateMeta();
});

onClick('btnPickBatSetting', () => post('pick-start-bat-preview'));
onClick('btnEditSegatoolsIni', () => post('open-segatools-ini'));
onClick('btnApplyRecommendedSegatools', () => post('apply-recommended-segatools-gfx'));
onClick('btnDetectDisplaysSetting', () => post('detect-displays-preview'));
onClick('btnReadCurrentSetting', () => post('read-current-mode-preview', {
  primaryDisplay: ui.displaySelectSetting?.value || '',
}));
onClick('btnCheckUpdate', () => post('check-update'));
onClick('btnOpenGithubHome', () => post('open-github-home'));
onClick('btnSaveSettings', () => {
  if (!draftSettings) return;

  draftSettings.startBatPath = ui.startBatSetting?.value || '';
  draftSettings.primaryDisplay = ui.displaySelectSetting?.value || '';
  draftSettings.originalMode = ui.originalModeInputSetting?.value || '';
  draftSettings.targetMode = getSelectedTargetMode();
  draftSettings.backgroundImagePath = ui.bgImageInput?.value || '';
  draftSettings.themeColor = ui.themeColorText?.value || ui.themeColor?.value || '#fdd500';

  post('save-settings', {
    startBatPath: draftSettings.startBatPath,
    primaryDisplay: draftSettings.primaryDisplay,
    originalMode: draftSettings.originalMode,
    targetMode: draftSettings.targetMode,
    backgroundImagePath: draftSettings.backgroundImagePath,
    launchMode: draftSettings.launchMode,
    smartDisplayEnabled: !!draftSettings.smartDisplayEnabled,
    themeColor: draftSettings.themeColor,
  });

  closeSettingsModal();
  updateMeta();
});

if (ui.displaySelectSetting) ui.displaySelectSetting.addEventListener('change', (e) => {
  const primaryDisplay = e.target.value || '';
  if (!isValidPrimaryDisplay(primaryDisplay)) return;

  if (draftSettings) {
    draftSettings.primaryDisplay = primaryDisplay;
    const selectedDisplay = draftSettings.displays.find((d) => d.id === primaryDisplay);
    draftSettings.primaryDisplayName = selectedDisplay?.name || primaryDisplay;
  }

  currentSettings.primaryDisplay = primaryDisplay;
  const selectedDisplay = currentSettings.displays.find((d) => d.id === primaryDisplay);
  currentSettings.primaryDisplayName = selectedDisplay?.name || primaryDisplay;
  if (ui.primaryDisplayHover) ui.primaryDisplayHover.textContent = currentSettings.primaryDisplayName;

  post('set-primary-display', { primaryDisplay });
});

if (ui.themeColor) ui.themeColor.addEventListener('input', (e) => {
  if (!draftSettings) return;
  draftSettings.themeColor = e.target.value;
  if (ui.themeColorText) ui.themeColorText.value = e.target.value;
});
if (ui.themeColorText) ui.themeColorText.addEventListener('change', (e) => {
  if (!draftSettings) return;
  draftSettings.themeColor = e.target.value;
  if (ui.themeColor) ui.themeColor.value = e.target.value;
});

const segs = document.querySelectorAll('#launchMode .seg');
segs.forEach((seg) => seg.addEventListener('click', () => {
  const mode = seg.dataset.mode;
  if (draftSettings) {
    draftSettings.launchMode = mode;
  } else {
    currentSettings.launchMode = mode;
    post('set-launch-mode', { mode });
  }
  setLaunchModeUi(mode);
}));

if (ui.smartDisplayToggle) {
  ui.smartDisplayToggle.addEventListener('change', () => {
    const enabled = !!ui.smartDisplayToggle.checked;
    if (draftSettings) {
      draftSettings.smartDisplayEnabled = enabled;
    }

    currentSettings.smartDisplayEnabled = enabled;
    post('set-smart-display', { enabled });
  });
}

if (ui.target60HzToggle) {
  ui.target60HzToggle.addEventListener('change', () => {
    syncTargetModeSetting(getSelectedTargetMode());
  });
}

const handleHostMessage = (event) => {
  const data = event.data || event;
  const { type, payload } = data || {};
  if (!type) return;

  switch (type) {
    case 'init': {
      currentSettings = {
        ...currentSettings,
        startBatPath: payload.startBatPath || '',
        originalMode: payload.originalMode || '',
        targetMode: payload.targetMode || '1920×1080 @ 120Hz',
        launchMode: payload.launchMode || 'smart',
        primaryDisplayName: payload.primaryDisplayName || '未选择',
        smartDisplayEnabled: !!payload.smartDisplayEnabled,
        themeColor: payload.themeColor || '#fdd500',
        backgroundImagePath: payload.backgroundImagePath || '',
        displays: payload.displays || [],
      };

      if (payload.startBatPath) {
        if (ui.startBat) ui.startBat.value = payload.startBatPath;
        if (ui.startBatSetting) ui.startBatSetting.value = payload.startBatPath;
      }

      if (payload.originalMode) {
        if (ui.originalModeCard) ui.originalModeCard.textContent = payload.originalMode;
        if (ui.originalModeInputSetting) ui.originalModeInputSetting.value = payload.originalMode;
        if (ui.originalModeHover) ui.originalModeHover.textContent = payload.originalMode;
      }

      if (payload.targetMode) {
        if (ui.targetMode) ui.targetMode.textContent = payload.targetMode;
        syncTargetModeSetting(payload.targetMode);
      }

      currentSettings.primaryDisplay = (payload.displays || []).find((d) => d.selected)?.id || '';
      setLaunchModeUi(currentSettings.launchMode);
      if (ui.smartDisplayToggle) ui.smartDisplayToggle.checked = !!payload.smartDisplayEnabled;

      if (payload.primaryDisplayName && ui.primaryDisplayHover) ui.primaryDisplayHover.textContent = payload.primaryDisplayName;
      if (payload.themeColor) applyThemeColor(payload.themeColor);
      if (payload.backgroundImagePath) applyBackground(payload.backgroundImagePath, false);
      if (payload.version && ui.appVersion) ui.appVersion.textContent = `v${payload.version}`;

      if (payload.displays) {
        renderDisplays(payload.displays, currentSettings.primaryDisplay);
      }

      updateMeta();
      const needsFirstRun = !payload.startBatPath || !payload.primaryDisplayName || payload.primaryDisplayName === '未选择';
      toggleModal(ui.firstRun, needsFirstRun);
      break;
    }
    case 'status': {
      setStatus(payload.text || '待机', payload.color || '#7dffa0');
      break;
    }
    case 'update-original': {
      if (draftSettings) {
        draftSettings.originalMode = payload.value || '';
        if (ui.originalModeInputSetting) ui.originalModeInputSetting.value = payload.value || '';
      } else {
        currentSettings.originalMode = payload.value || '';
        if (ui.originalModeCard) ui.originalModeCard.textContent = payload.value || '未读取';
        if (ui.originalModeInputSetting) ui.originalModeInputSetting.value = payload.value || '';
        if (ui.originalModeHover) ui.originalModeHover.textContent = payload.value || '未读取';
      }
      break;
    }
    case 'update-target': {
      if (ui.targetMode) ui.targetMode.textContent = payload.value || '1920×1080 @ 120Hz';
      syncTargetModeSetting(payload.value || '1920×1080 @ 120Hz');
      break;
    }
    case 'update-start-bat': {
      if (draftSettings) {
        draftSettings.startBatPath = payload.path || '';
      } else {
        currentSettings.startBatPath = payload.path || '';
        if (ui.startBat) ui.startBat.value = payload.path || '';
      }
      if (ui.startBatSetting) ui.startBatSetting.value = payload.path || '';
      updateMeta();
      break;
    }
    case 'update-background-image': {
      if (draftSettings) {
        draftSettings.backgroundImagePath = payload.path || '';
        if (ui.bgImageInput) ui.bgImageInput.value = payload.path || '';
      } else {
        currentSettings.backgroundImagePath = payload.path || '';
        applyBackground(payload.path || '', false);
      }
      break;
    }
    case 'update-displays': {
      const displays = payload.displays || [];
      const primaryDisplay = displays.find((d) => d.selected)?.id || '';
      if (draftSettings) {
        draftSettings.displays = displays;
        draftSettings.primaryDisplay = primaryDisplay;
        draftSettings.primaryDisplayName = payload.primaryDisplayName || '未选择';
        renderDisplays(displays, primaryDisplay);
      } else {
        currentSettings.displays = displays;
        currentSettings.primaryDisplay = primaryDisplay;
        currentSettings.primaryDisplayName = payload.primaryDisplayName || '未选择';
        renderDisplays(displays, primaryDisplay);
      }
      break;
    }
    case 'test-switch-state': {
      setTestSwitchButtonState(!!payload.active, payload.timeoutSeconds || 15);
      break;
    }
    default:
      console.log('Unknown message', type, payload);
  }
};

if (window.chrome && window.chrome.webview) {
  window.chrome.webview.addEventListener('message', handleHostMessage);
}
window.addEventListener('message', handleHostMessage);

setStatus('待机');
applyThemeColor(currentThemeColor);
applyBackground(currentBgImage, false);
setTestSwitchButtonState(false, 15);
