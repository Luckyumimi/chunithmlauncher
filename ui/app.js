const byId = id => document.getElementById(id);
const aboutNote = document.createElement('small');
aboutNote.textContent = '本项目与MuNET无附属关系';
byId('btnCheckUpdate')?.parentElement?.after(aboutNote);
const post = (type, payload = {}) => window.chrome?.webview
  ? window.chrome.webview.postMessage({ type, payload })
  : console.info('[preview]', type, payload);

const state = {
  startBatPath: '', primaryDisplay: '', primaryDisplayName: '未选择', originalMode: '',
  targetMode: '1920×1080 @ 120Hz', launchMode: 'smart', smartDisplayEnabled: false,
  themeColor: '#fdd500', backgroundImagePath: '', displays: [],
};
let testTimer;
let theme = localStorage.getItem('chunithm-theme') || 'light';
const defaultPortalUrl = 'https://portal.mumur.net/';
const readStoredValue = (key, legacyKey) => localStorage.getItem(key) || localStorage.getItem(legacyKey) || '';
let portalUrl = readStoredValue('chunithm-portal-url', 'chunithm-munet-url');
let portalButtonText = readStoredValue('chunithm-portal-text', 'chunithm-munet-text') || '打开MuNET';
const moonPath = 'M512 964c-249.24 0-452-202.76-452-452 0-114.48 42.88-223.72 120.76-307.56 77.44-83.36 182.4-134.2 295.44-143.04a36.04 36.04 0 0 1 34.32 18.48 36 36 0 0 1-2.6 38.88C471.32 167.96 452 226.48 452 288c0 156.6 127.4 284 284 284 61.48 0 120-19.32 169.24-55.92a36 36 0 0 1 38.88-2.6 36.04 36.04 0 0 1 18.48 34.32c-8.88 113.08-59.68 218-143.04 295.44C735.72 921.12 626.52 964 512 964zM409.36 146.12C249.12 191.36 132 340 132 512c0 209.52 170.48 380 380 380 172 0 320.64-117.08 365.88-277.36-44.36 19.32-92.36 29.36-141.88 29.36-196.28 0-356-159.72-356-356 0-49.52 10-97.52 29.36-141.88z';
const sunPath = 'M752.41931153 240.7063601c8.36993432 0 15.62255883 3.08990502 21.72821045 9.16589356 6.1353147 6.08093262 9.18566918 13.3928833 9.18566918 21.73315382 0 8.55285621-3.05035376 15.85986352-9.18566918 21.94079614l-43.67394996 43.66900658c-5.93261719 5.97216773-13.17041016 8.95825195-21.72326709 8.95825195-8.87420678 0-16.20098901-2.98608422-22.08911085-8.75061035-5.88317847-5.87329102-8.80004906-13.2890625-8.80004906-22.14843774 0-8.54791283 2.95642114-15.75604272 8.91375732-21.72821044l43.66900659-43.67394996c6.14025879-6.07598853 13.44726539-9.16589356 21.98034668-9.16589356zM790.0815432 481.10095191h61.79809547c8.52813721 0 15.82031227 2.98608422 21.83697534 9.06207276C879.78271508 496.24395728 882.78857422 503.45208717 882.78857422 512c0 8.55285621-3.00585914 15.85986352-9.07196021 21.83697533-6.01666236 6.07598853-13.30883813 9.06207276-21.83697534 9.06207276h-61.79809547c-8.52813721 0-15.80053734-2.98608422-21.86663841-9.06207276-6.01666236-5.97711182-9.05712867-13.2890625-9.05712867-21.83697533 0-8.55285621 3.04046631-15.76098609 9.05712867-21.83697533 6.06610156-6.07598853 13.33850122-9.06207276 21.86663841-9.06207276zM512 141.21142578c8.52813721 0 15.79064917 3.08990502 21.85180688 9.06207276 6.02160645 6.08093262 9.05712867 13.3928833 9.05712867 21.83697533v61.79809546c0 8.55285621-3.03552222 15.85986352-9.0521853 21.83697534-6.06610107 6.07598853-13.32861305 9.16589355-21.85675025 9.16589355-8.53802467 0-15.80053734-3.08990502-21.86663842-9.16589355-6.01666236-5.97711182-9.0521853-13.2890625-9.05218458-21.83697534V172.11047387c0-8.44409203 3.03552222-15.76098609 9.05218458-21.83697533C496.20440674 144.3013308 503.46691871 141.21142578 512.00494408 141.21142578zM271.81304907 240.7063601c8.36499023 0 15.61267066 3.08990502 21.743042 9.16589356l43.66900659 43.67394996c6.14025879 6.07598853 9.17083764 13.38793922 9.17083764 21.72821044 0 8.55285621-3.01080323 15.86480689-9.05712938 21.83697534-6.03149391 6.08093262-13.30389404 9.06207276-21.85180617 9.06207275-8.69622827 0-16.02795386-2.98608422-21.95068359-8.85443115l-43.68383814-43.67395068c-5.97216773-5.97216773-8.92858886-13.28411842-8.92858886-22.03967284 0-8.55285621 3.00585914-15.76098609 9.07196021-21.83697462 6.01666236-5.97216773 13.30883813-9.06207276 21.85675096-9.06207276h-.03955126zM708.75030493 677.61889625c8.36499023 0 15.60772729 2.98608422 21.72326709 9.16589355l43.67394995 43.67395067c6.1353147 6.17980933 9.18566918 13.38793922 9.18566919 21.93585205 0 8.34521461-3.05035376 15.65716529-9.18566919 21.73315382-6.1105957 6.17980933-13.35827613 9.16589356-21.72326636 9.16589356-8.52813721 0-15.84008789-2.98608422-21.98034668-9.16589356l-43.66900659-43.66900587c-5.95733618-5.87329102-8.91375732-13.1852417-8.91375732-21.73315453 0-8.55285621 3.01080323-15.86480689 9.05712866-21.94079614 6.03149391-6.07598853 13.32861305-9.16589355 21.85180689-9.16589355h-.01977564zM512.00494408 388.40380836c-34.12243628 0-63.22192359 12.05310035-87.39239525 36.2532351-24.1358645 24.10125732-36.21368384 53.25018335-36.21368384 87.34295654 0 34.0927732 12.07782007 63.24169922 36.21368384 87.44677734C448.78796387 623.53814721 477.88250781 635.59619164 512 635.59619164c34.12243628 0 63.23181176-12.05310035 87.4072268-36.15435838C623.51837158 575.2466433 635.59619164 546.09771729 635.59619164c-34.0927732-34.12243628-12.07782007-63.24169922-36.18896484-87.34295654C575.23181176 400.45690942 546.12243628 388.40380836 512 388.40380836zM172.12036133 481.10095191h61.79809547c8.53802467 0 15.80053734 2.98608422 21.86663841 9.06207276 6.01666236 6.08093262 9.05712867 13.2890625 9.05712867 21.83697533 0 8.55285621-3.04046631 15.85986352-9.05712867 21.83697533-6.06610156 6.07598853-13.32861305 9.06207276-21.86663841 9.06207276h-61.79809547c-8.52813721 0-15.81042481-2.98608422-21.83697534-9.06207276C144.21728492 527.85986352 141.21142578 520.54791283 141.21142578 512c0-8.55285621 3.00585914-15.76098609 9.07196021-21.83697533 6.03149391-6.07598853 13.30883813-9.06207276 21.83697534-9.06207276zM512.00494408 759.19238258c8.52813721 0 15.79064917 2.98608422 21.85180617 9.06207274 6.02160645 6.08093262 9.05712867 13.2890625 9.05712938 21.83697535v61.79809546c0 8.52813721-3.03552222 15.85986352-9.0521853 21.83697533C527.79559326 879.80249 520.53308129 882.78857422 512 882.78857422c-8.53802467 0-15.80053734-2.98608422-21.86663842-9.06207276-6.01666236-5.97711182-9.0521853-13.2890625-9.05218458-21.83697533v-61.79809546c0-8.55285621 3.03552222-15.76098609 9.05218458-21.83697534 6.06610156-6.07598853 13.32861305-9.16589355 21.86663842-9.16589355zM315.52655029 677.61889625c8.5034182 0 15.80053734 2.98608422 21.84686279 9.16589355 6.03149391 6.08093262 9.07196021 13.3928833 9.07196021 21.94079614 0 8.44409203-3.08001685 15.65222192-9.19555664 21.72821044l-43.67394995 43.67394996c-6.10565162 6.17980933-13.34838867 9.16589356-21.72326637 9.16589356-8.54791283 0-15.84008789-2.98608422-21.85180687-8.96319533-6.07104516-6.07598853-9.0769043-13.38793922-9.0769043-21.93585205 0-8.65173364 2.95642114-15.96862769 8.92858887-21.94079614l43.68383813-43.66900658c6.10565162-6.17980933 13.44232202-9.16589355 21.95068359-9.16589355h.03955054zM512 326.60571289c33.628052 0 64.6506958 8.34521461 93.0481565 24.81811547 28.427123 16.69042992 50.921631 39.1404419 67.4637456 67.56756568 16.57177758 28.32824708 24.86755347 59.32617188 24.86755347 93.00860596 0 33.68243408-8.27600098 64.68035888-24.86755347 93.10748267-16.58166504 28.32824708-39.08605981 50.77825904-67.4637456 67.4637456-28.36285424 16.58166504-59.37561059 24.82305884-93.0481565 24.82305884-33.66760254 0-64.67047143-8.24139381-93.05804468-24.81811547-28.37768578-16.69042992-50.86230492-39.14538598-67.46374487-67.46868897-16.58166504-28.42712378-24.86755347-59.42504859-24.86755348-93.10748267 0-33.68243408 8.31555152-64.68035888 24.86755348-93.00860596 16.55200195-28.42712378 39.03662109-50.87713647 67.46374487-67.56262231C447.35424828 334.94598413 478.371948 326.60571289 512 326.60571289z';

const fixedSunMarkup = '<circle cx="512" cy="512" r="152" fill="currentColor"></circle><path d="M512 64v170M512 790v170M64 512h170M790 512h170M195 195l120 120M709 709l120 120M829 195L709 315M315 709L195 829" fill="none" stroke="currentColor" stroke-width="64" stroke-linecap="round"></path>';

function applyTheme(value) {
  theme = value === 'dark' ? 'dark' : 'light';
  document.querySelector('.page').classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('dark-mode', theme === 'dark');
  document.documentElement.classList.remove('theme-dark-preload');
  byId('themeLabel').textContent = theme === 'dark' ? '浅色' : '深色';
  byId('themeIcon').innerHTML = theme === 'dark' ? fixedSunMarkup : `<path d="${moonPath}"></path>`;
  byId('themeSelect').value = theme;
  syncThemeDropdown(theme);
  localStorage.setItem('chunithm-theme', theme);
}

function status(text, color = '#5caa74') {
  byId('statusText').textContent = text;
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
  byId('targetMode').textContent = state.targetMode;
  byId('originalMode').textContent = state.originalMode || '未读取';
  byId('primaryDisplay').textContent = state.primaryDisplayName || '未选择';
  byId('startBatPath').textContent = state.startBatPath ? `⌘　${state.startBatPath}` : '⌘　尚未选择 start.bat';
  byId('version').textContent = `v${state.version || '1.4.0'}`;
  byId('portalTab').textContent = portalButtonText;
  byId('smartDisplayToggle').checked = !!state.smartDisplayEnabled;
  document.documentElement.style.setProperty('--accent', state.themeColor || '#fdd500');
  document.documentElement.style.setProperty('--user-bg', state.backgroundImagePath ? `url("${state.backgroundImagePath.replaceAll('\\', '/')}")` : 'none');
  document.querySelectorAll('#launchMode button').forEach(button => button.classList.toggle('active', button.dataset.mode === state.launchMode));
  byId('launchMode').dataset.mode = state.launchMode;
}

function fillDisplays(select, selected) {
  if (!select) return;
  select.innerHTML = '<option value="">请选择主显示器</option>';
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
  valueNode.textContent = selectedDisplay?.name || '请选择主显示器';
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
  valueNode.textContent = selectedDisplay?.name || '请选择主显示器';
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
  } else {
    panel.style.removeProperty('--dropdown-top');
    panel.style.removeProperty('--dropdown-left');
    panel.style.removeProperty('--dropdown-width');
    panel.style.removeProperty('--dropdown-max-height');
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
  else ['top', 'left', 'width', 'max-height'].forEach(name => panel.style.removeProperty(`--dropdown-${name}`));
}

function syncThemeDropdown(value = theme) {
  const valueNode = byId('themeSelectValueFirstRun'); const optionsNode = byId('themeSelectOptionsFirstRun');
  if (!valueNode || !optionsNode) return;
  const labels = { light: '浅色模式', dark: '深色模式' };
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
  else ['top', 'left', 'width', 'max-height'].forEach(name => panel.style.removeProperty(`--dropdown-${name}`));
}

function fillSettings() {
  byId('startBatSetting').value = state.startBatPath;
  byId('originalModeInputSetting').value = state.originalMode;
  byId('targetModeSetting').value = state.targetMode;
  byId('target60HzToggle').checked = /@ 60hz/i.test(state.targetMode);
  byId('themeColor').value = state.themeColor;
  byId('themeColorText').value = state.themeColor;
  byId('bgImageInput').value = state.backgroundImagePath;
  byId('portalButtonText').value = portalButtonText;
  byId('portalUrl').value = portalUrl || defaultPortalUrl;
  fillDisplays(byId('displaySelectSetting'), state.primaryDisplay);
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
  portalButtonText = byId('portalButtonText').value.trim() || '打开MuNET';
  portalUrl = byId('portalUrl').value.trim() || defaultPortalUrl;
  localStorage.setItem('chunithm-portal-text', portalButtonText);
  localStorage.setItem('chunithm-portal-url', portalUrl);
  post('save-settings', { startBatPath, primaryDisplay, originalMode: state.originalMode, targetMode: state.targetMode, launchMode: state.launchMode, smartDisplayEnabled: state.smartDisplayEnabled, themeColor: state.themeColor, backgroundImagePath: state.backgroundImagePath });
  show('settingsModal', false); show('firstRun', false); render(); status('设置已保存');
}

function showLauncher() {
  byId('portalView').classList.remove('show');
  byId('portalTab').classList.remove('active');
}

function openPortal() {
  let url = portalUrl.trim();
  if (!url) {
    const enteredUrl = window.prompt('首次打开 MuNET，请确认网页链接：', defaultPortalUrl);
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
  state.primaryDisplay = state.primaryDisplay || state.displays.find(item => item.selected)?.id || '';
  state.primaryDisplayName = state.primaryDisplayName || state.displays.find(item => item.id === state.primaryDisplay)?.name || '未选择';
  byId('startBat').value = state.startBatPath; fillDisplays(byId('displaySelect'), state.primaryDisplay); render();
  show('firstRun', !state.startBatPath || !state.primaryDisplay);
}

document.querySelector('#settingsModal small')?.replaceChildren('选择后即刻生效');

function handleMessage(event) {
  const data = event.data || event; if (!data?.type) return; const p = data.payload || {};
  if (data.type === 'init') init(p);
  if (data.type === 'status') status(p.text || '待机', p.color || '#5caa74');
  if (data.type === 'update-target') { state.targetMode = p.value || ''; byId('targetModeSetting').value = state.targetMode; render(); }
  if (data.type === 'update-original') { state.originalMode = p.value || ''; byId('originalModeInputSetting').value = state.originalMode; render(); }
  if (data.type === 'update-start-bat') { state.startBatPath = p.path || ''; byId('startBat').value = state.startBatPath; render(); }
  if (data.type === 'update-background-image') {
    state.backgroundImagePath = p.path || '';
    byId('bgImageInput').value = state.backgroundImagePath;
    render();
  }
  if (data.type === 'update-displays') { state.displays = p.displays || []; state.primaryDisplay = state.displays.find(item => item.selected)?.id || ''; state.primaryDisplayName = p.primaryDisplayName || '未选择'; fillDisplays(byId('displaySelect'), state.primaryDisplay); fillDisplays(byId('displaySelectSetting'), state.primaryDisplay); render(); }
  if (data.type === 'test-switch-state') {
    if (p.active) {
      byId('btnTestSwitch').textContent = `恢复原始分辨率 (${p.timeoutSeconds || 15}s)`;
    } else {
      byId('btnTestSwitch').textContent = '测试切换';
    }
  }
}

byId('btnLaunch').onclick = () => { post('launch-game'); status('启动中', '#d6944e'); };
byId('btnSettings').onclick = () => { fillSettings(); show('settingsModal', true); };
byId('portalTab').onclick = openPortal;
byId('backToLauncher').onclick = showLauncher;
byId('themeToggle').onclick = () => applyTheme(theme === 'dark' ? 'light' : 'dark');
byId('themeSelect').onchange = event => applyTheme(event.target.value);
byId('themeSelectTriggerFirstRun').onclick = () => setThemeDropdownOpen(!byId('themeDropdownFirstRun').classList.contains('open'));
byId('themeSelectTriggerFirstRun').onkeydown = event => {
  if (event.key === 'Escape') setThemeDropdownOpen(false);
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setThemeDropdownOpen(true); }
};
byId('btnCloseSettings').onclick = () => show('settingsModal', false);
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
byId('btnEditSegatoolsIni').onclick = () => post('open-segatools-ini'); byId('btnApplyRecommendedSegatools').onclick = () => post('apply-recommended-segatools-gfx');
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
});
window.addEventListener('resize', positionDisplayDropdown);
window.addEventListener('resize', positionFirstRunDropdown);
window.addEventListener('scroll', positionDisplayDropdown, true);
window.addEventListener('scroll', positionFirstRunDropdown, true);
window.addEventListener('resize', positionThemeDropdown);
window.addEventListener('scroll', positionThemeDropdown, true);
document.querySelectorAll('#launchMode button').forEach(button => button.onclick = () => { state.launchMode = button.dataset.mode; post('set-launch-mode', { mode: state.launchMode }); render(); });
byId('btnTestSwitch').onclick = () => { if (testTimer) { post('restore-original'); clearInterval(testTimer); testTimer = null; byId('btnTestSwitch').textContent = '测试切换'; return; } post('test-switch'); let seconds = 15; byId('btnTestSwitch').textContent = `恢复原始分辨率 (${seconds}s)`; testTimer = setInterval(() => { seconds -= 1; byId('btnTestSwitch').textContent = `恢复原始分辨率 (${seconds}s)`; if (seconds <= 0) { clearInterval(testTimer); testTimer = null; byId('btnTestSwitch').textContent = '测试切换'; } }, 1000); };

window.addEventListener('message', handleMessage);
window.chrome?.webview?.addEventListener('message', handleMessage);
render();
applyTheme(theme);
if (!window.chrome?.webview) setTimeout(() => init({ version: '1.4.0', startBatPath: 'D:\\SDHD\\bin\\start.bat', primaryDisplayName: '\\\\.\\DISPLAY1 · 2560×1440 @ 144Hz', primaryDisplay: '\\\\.\\DISPLAY1', originalMode: '2560×1440 @ 144Hz', displays: [{ id: '\\\\.\\DISPLAY1', name: '\\\\.\\DISPLAY1 · 2560×1440 @ 144Hz', selected: true }, { id: '\\\\.\\DISPLAY2', name: '\\\\.\\DISPLAY2 · 1920×1080 @ 60Hz' }] }), 180);
