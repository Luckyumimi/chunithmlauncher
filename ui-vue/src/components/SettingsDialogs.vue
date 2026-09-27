<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { postToHost } from '../bridge';
import Button from '@munet/ui/components/Button';
import CheckBox from '@munet/ui/components/CheckBox';
import Select, { type SelectOption } from '@munet/ui/components/Select';
import TextInput from '@munet/ui/components/TextInput';

export type DisplayOption = {
  id: string;
  name: string;
  selected?: boolean;
};

export type LauncherSettings = {
  startBatPath: string;
  primaryDisplay: string;
  primaryDisplayName?: string;
  originalMode: string;
  targetMode: string;
  launchMode: string;
  smartDisplayEnabled: boolean;
  runBatAsAdministrator: boolean;
  terminateCmdBeforeLaunch: boolean;
  themeColor: string;
  backgroundImagePath: string;
  portalButtonText?: string;
  portalUrl?: string;
};

export type SaveSettingsPayload = {
  startBatPath: string;
  primaryDisplay: string;
  originalMode: string;
  targetMode: string;
  launchMode: string;
  smartDisplayEnabled: boolean;
  runBatAsAdministrator: boolean;
  terminateCmdBeforeLaunch: boolean;
  themeColor: string;
  backgroundImagePath: string;
};

const props = withDefaults(defineProps<{
  settings: LauncherSettings;
  displays?: DisplayOption[];
  theme?: 'dark' | 'light';
  showSettings?: boolean;
  showFirstRun?: boolean;
}>(), {
  displays: () => [],
  theme: 'dark',
  showSettings: false,
  showFirstRun: false,
});

const emit = defineEmits<{
  (event: 'close-settings'): void;
  (event: 'complete-first-run', payload: SaveSettingsPayload): void;
  (event: 'save-settings', payload: SaveSettingsPayload): void;
  (event: 'update:showSettings', value: boolean): void;
  (event: 'update:showFirstRun', value: boolean): void;
  (event: 'mu-net-change', payload: { text: string; url: string }): void;
  (event: 'theme-change', theme: 'dark' | 'light'): void;
  (event: 'open-donation'): void;
}>();

const draft = ref<LauncherSettings>(cloneSettings(props.settings));
const settingsBody = ref<HTMLElement | null>(null);
const firstRunError = ref('');
const firstRunTheme = ref<'dark' | 'light'>(props.theme);

const isLight = computed(() => props.theme === 'light');
const selectedDisplayName = computed(() => {
  const selected = props.displays.find((display) => display.id === draft.value.primaryDisplay);
  return selected?.name || draft.value.primaryDisplayName || '请选择主显示器';
});
const displayOptions = computed<SelectOption[]>(() => props.displays.map((display) => ({ label: display.name, value: display.id })));
const target60Hz = computed({
  get: () => /@ 60Hz/i.test(draft.value.targetMode),
  set: (enabled: boolean) => { draft.value.targetMode = enabled ? '1920×1080 @ 60Hz' : '1920×1080 @ 120Hz'; },
});
const canSaveFirstRun = computed(() => Boolean(draft.value.startBatPath.trim() && draft.value.primaryDisplay));

watch(() => props.settings, (value) => {
  draft.value = cloneSettings(value);
}, { deep: true });

watch(() => props.showSettings, (visible) => {
  if (visible) draft.value = cloneSettings(props.settings);
});
watch(() => props.theme, (value) => { firstRunTheme.value = value; });

function cloneSettings(value: LauncherSettings): LauncherSettings {
  return {
    startBatPath: value.startBatPath || '',
    primaryDisplay: value.primaryDisplay || '',
    primaryDisplayName: value.primaryDisplayName || '',
    originalMode: value.originalMode || '',
    targetMode: value.targetMode || '1920×1080 @ 120Hz',
    launchMode: value.launchMode || 'smart',
    smartDisplayEnabled: value.smartDisplayEnabled !== false,
    runBatAsAdministrator: value.runBatAsAdministrator !== false,
    terminateCmdBeforeLaunch: value.terminateCmdBeforeLaunch !== false,
    themeColor: value.themeColor || '#fdd500',
    backgroundImagePath: value.backgroundImagePath || '',
    portalButtonText: value.portalButtonText || '打开MuNET',
    portalUrl: value.portalUrl || 'https://portal.mumur.net/',
  };
}

function savePayload(): SaveSettingsPayload {
  return {
    startBatPath: draft.value.startBatPath.trim(),
    primaryDisplay: draft.value.primaryDisplay,
    originalMode: draft.value.originalMode.trim(),
    targetMode: draft.value.targetMode,
    launchMode: draft.value.launchMode,
    smartDisplayEnabled: draft.value.smartDisplayEnabled,
    runBatAsAdministrator: draft.value.runBatAsAdministrator,
    terminateCmdBeforeLaunch: draft.value.terminateCmdBeforeLaunch,
    themeColor: draft.value.themeColor,
    backgroundImagePath: draft.value.backgroundImagePath.trim(),
  };
}

function post(type: string, payload: Record<string, unknown> = {}): void {
  postToHost(type, payload);
}

function closeSettings(): void {
  emit('close-settings');
  emit('update:showSettings', false);
}

function chooseStartBat(): void {
  post(props.showFirstRun ? 'pick-start-bat' : 'pick-start-bat-preview');
}

function detectDisplays(): void {
  post(props.showFirstRun ? 'detect-displays' : 'detect-displays-preview');
}

function readCurrentMode(): void {
  post(props.showFirstRun ? 'read-current-mode' : 'read-current-mode-preview', { primaryDisplay: draft.value.primaryDisplay });
}

function chooseBackground(): void {
  post('pick-background-image-preview');
}

function saveSettings(firstRun = false): void {
  if (firstRun && !canSaveFirstRun.value) {
    firstRunError.value = '请选择 start.bat 和主显示器后继续。';
    return;
  }

  firstRunError.value = '';
  const payload = savePayload();
  post('save-settings', payload);
  emit('save-settings', payload);
  if (draft.value.portalButtonText || draft.value.portalUrl) {
    emit('mu-net-change', {
      text: draft.value.portalButtonText?.trim() || '打开MuNET',
      url: draft.value.portalUrl?.trim() || 'https://portal.mumur.net/',
    });
  }
  if (firstRun) {
    emit('complete-first-run', payload);
    emit('update:showFirstRun', false);
  } else {
    closeSettings();
  }
}

function setDisplayValue(value: string | number): void {
  const id = String(value);
  const display = props.displays.find((item) => item.id === id);
  if (!display) return;
  draft.value.primaryDisplay = display.id;
  draft.value.primaryDisplayName = display.name;
  post('set-primary-display', { primaryDisplay: display.id });
}

function updateDropdownPosition(): void {
  if (!dropdownButton.value) return;
  const rect = dropdownButton.value.getBoundingClientRect();
  dropdownPosition.value = { top: rect.bottom + 8, left: rect.left, width: rect.width };
}

</script>

<template>
  <div class="settings-dialogs" :class="{ 'is-light': isLight }">
    <Teleport to="body">
      <div v-if="showFirstRun" class="dialog-backdrop" :class="{ 'is-light': isLight }" role="presentation">
        <section class="settings-dialog first-run-dialog" role="dialog" aria-modal="true" aria-labelledby="first-run-title">
          <h2 id="first-run-title">首次配置</h2>
          <p class="dialog-description">先完成游戏路径、主显示器和界面主题配置。</p>
          <div class="settings-section">
            <h3>启动与显示器</h3>
            <label for="first-start-bat">start.bat 路径</label>
            <div class="control-row">
              <TextInput id="first-start-bat" v-model:value="draft.startBatPath" :disabled="true" placeholder="请选择 start.bat" />
              <Button class="secondary-button" variant="secondary" size="small" type="button" @click="chooseStartBat">选择</Button>
            </div>
            <label for="first-display-trigger">主显示器</label>
            <div class="control-row">
              <Select id="first-display-trigger" v-model:value="draft.primaryDisplay" :options="displayOptions" placeholder="请选择主显示器" dropdown-fit @update:value="setDisplayValue" />
              <Button class="secondary-button" variant="secondary" size="small" type="button" @click="detectDisplays">刷新</Button>
            </div>
            <label for="first-theme">界面主题</label>
            <Select id="first-theme" v-model:value="firstRunTheme" :options="[{ label: '浅色模式', value: 'light' }, { label: '深色模式', value: 'dark' }]" dropdown-fit @update:value="emit('theme-change', String($event) as 'light' | 'dark')" />
          </div>
          <p v-if="firstRunError" class="dialog-error" role="alert">{{ firstRunError }}</p>
          <Button class="primary-button wide-button" variant="primary" type="button" :disabled="!canSaveFirstRun" @click="saveSettings(true)">完成配置</Button>
        </section>
      </div>

      <div v-else-if="showSettings" class="dialog-backdrop" :class="{ 'is-light': isLight }" role="presentation">
        <section class="settings-dialog settings-dialog-large" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <header class="dialog-heading">
            <div><h2 id="settings-title">设置</h2><small>选择后即刻生效</small></div>
            <Button class="secondary-button" variant="secondary" size="small" type="button" @click="closeSettings">关闭</Button>
          </header>
          <div ref="settingsBody" class="dialog-scroll-body">
            <section class="settings-section">
              <h3>启动与分辨率</h3>
              <label for="settings-start-bat">start.bat 路径</label>
              <div class="control-row"><TextInput id="settings-start-bat" v-model:value="draft.startBatPath" :disabled="true" placeholder="请选择 start.bat" /><Button class="secondary-button" variant="secondary" size="small" type="button" @click="chooseStartBat">选择</Button></div>
              <div class="button-row"><Button class="secondary-button" variant="secondary" size="small" type="button" @click="post('open-chuchart-manager-actions')">从 segatool 迁移至 AppleChu</Button><Button class="secondary-button" variant="secondary" size="small" type="button" @click="post('open-chuchart-manager-actions')">编辑 AppleChu.toml</Button></div>
              <CheckBox v-model:value="draft.runBatAsAdministrator" class="check-row">使用管理员权限运行 bat</CheckBox>
              <CheckBox v-model:value="draft.terminateCmdBeforeLaunch" class="check-row">启动前关闭残留 CMD</CheckBox>
              <label for="settings-display-trigger">主显示器 <small>选择后立即保存</small></label>
              <div class="control-row">
                <Select id="settings-display-trigger" v-model:value="draft.primaryDisplay" :options="displayOptions" placeholder="请选择主显示器" dropdown-fit @update:value="setDisplayValue" />
                <Button class="secondary-button" variant="secondary" size="small" type="button" @click="detectDisplays">刷新</Button>
              </div>
              <label for="settings-original-mode">原始分辨率</label>
              <div class="control-row"><TextInput id="settings-original-mode" v-model:value="draft.originalMode" placeholder="例如 2560×1440 @ 144Hz" /><Button class="secondary-button" variant="secondary" size="small" type="button" @click="readCurrentMode">读取</Button></div>
              <label for="settings-target-mode">目标分辨率</label>
              <div class="control-row"><TextInput id="settings-target-mode" v-model:value="draft.targetMode" :disabled="true" /><CheckBox v-model:value="target60Hz" class="check-row compact-check">60Hz</CheckBox></div>
              <div class="launch-mode-group" role="group" aria-label="启动模式"><span>启动模式</span><Button class="secondary-button" :class="{ active: draft.launchMode === 'smart' }" variant="secondary" size="small" type="button" @click="draft.launchMode = 'smart'">智能切换</Button><Button class="secondary-button" :class="{ active: draft.launchMode === 'manual' }" variant="secondary" size="small" type="button" @click="draft.launchMode = 'manual'">仅启动</Button></div>
              <CheckBox v-model:value="draft.smartDisplayEnabled" class="check-row">启用智能显示器切换</CheckBox>
            </section>
            <section class="settings-section">
              <h3>外观</h3>
              <label for="settings-theme-color">主题色</label>
              <div class="control-row"><input id="settings-theme-color" v-model="draft.themeColor" type="color" aria-label="选择主题色" /><TextInput v-model:value="draft.themeColor" aria-label="主题色十六进制值" /></div>
              <label for="settings-background">背景图片</label>
              <div class="control-row"><TextInput id="settings-background" v-model:value="draft.backgroundImagePath" placeholder="本地路径或 URL" /><Button class="secondary-button" variant="secondary" size="small" type="button" @click="chooseBackground">选择</Button></div>
            </section>
            <section class="settings-section">
              <h3>ALL.Net 提供商</h3>
              <label for="munet-text">按钮文字</label><TextInput id="munet-text" v-model:value="draft.portalButtonText" placeholder="打开 MuNET" />
              <label for="munet-url">网页链接</label><TextInput id="munet-url" v-model:value="draft.portalUrl" placeholder="https://portal.mumur.net/" />
            </section>
            <section class="settings-section about-section"><h3>关于</h3><div class="button-row"><Button class="secondary-button" variant="secondary" size="small" type="button" @click="post('open-github-home')">GitHub 主页</Button><Button class="secondary-button" variant="secondary" size="small" type="button" @click="post('check-update')">检查更新</Button><Button class="secondary-button" variant="secondary" size="small" type="button" @click="post('check-announcement')">查看公告</Button><Button class="secondary-button" variant="secondary" size="small" type="button" @click="emit('open-donation')">捐赠</Button></div></section>
          </div>
          <Button class="primary-button wide-button" variant="primary" type="button" @click="saveSettings()">保存设置</Button>
        </section>
      </div>

    </Teleport>
  </div>
</template>

<style scoped>
.settings-dialogs,.dialog-backdrop,.fixed-select-panel { --dialog-page:#000; --dialog-card:#222; --dialog-field:#303030; --dialog-text:#f1f0f3; --dialog-muted:#aaa6b2; --dialog-accent:#fdd500; color:var(--dialog-text); }
.settings-dialogs.is-light,.dialog-backdrop.is-light,.fixed-select-panel.is-light { --dialog-page:#f2f0f7; --dialog-card:#e1dfe5; --dialog-field:#d6d3dc; --dialog-text:#292837; --dialog-muted:#625f6c; }
.dialog-backdrop { position:fixed; inset:0; z-index:100; display:grid; place-items:center; padding:24px; background:rgba(0,0,0,.56); }
.settings-dialog { width:min(560px,100%); max-height:min(720px,calc(100vh - 48px)); overflow:hidden; padding:28px; border-radius:24px; background:var(--dialog-card); box-shadow:0 26px 70px rgba(0,0,0,.3); color:var(--dialog-text); }
.settings-dialog-large { display:flex; flex-direction:column; width:min(680px,100%); }
.dialog-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; }
h2,h3,p { margin:0; } h2 { font-size:24px; } h3 { margin-bottom:16px; font-size:16px; } .dialog-description, .dialog-heading small { color:var(--dialog-muted); }
.dialog-description { margin:8px 0 24px; line-height:1.6; }.dialog-scroll-body { overflow:auto; min-height:0; padding:4px 4px 20px 0; }
.settings-section { display:grid; gap:9px; margin-top:24px; }.settings-section:first-child { margin-top:0; } .settings-section label { color:var(--dialog-muted); font-size:13px; }
input,.native-select,.select-trigger { width:100%; min-height:42px; border:0; border-radius:12px; padding:0 14px; color:var(--dialog-text); background:var(--dialog-field); font:inherit; outline:0; transition:color .35s ease,background-color .35s ease,box-shadow .2s ease; }
input:focus,.native-select:focus,.select-trigger:focus-visible { box-shadow:0 0 0 3px color-mix(in srgb,var(--dialog-accent) 42%,transparent); }
input[type=color] { width:52px; padding:5px; cursor:pointer; }.control-row,.button-row { display:flex; align-items:center; gap:10px; }.control-row > input:not([type=color]), .control-row > .select-trigger { flex:1; }.button-row { flex-wrap:wrap; }
button { border:0; font:inherit; cursor:pointer; }.secondary-button,.primary-button { min-height:38px; border-radius:12px; padding:0 15px; color:var(--dialog-text); background:color-mix(in srgb,var(--dialog-field) 88%,var(--dialog-text)); }.secondary-button:hover { background:color-mix(in srgb,var(--dialog-field) 72%,var(--dialog-text)); }.primary-button { color:#201d0d; background:var(--dialog-accent); font-weight:750; }.wide-button { width:100%; margin-top:16px; }.primary-button:disabled { cursor:not-allowed; opacity:.45; }
.select-trigger { display:flex; align-items:center; justify-content:space-between; text-align:left; }.check-row { display:flex; align-items:center; gap:9px; color:var(--dialog-text)!important; cursor:pointer; }.check-row input { width:17px; min-height:17px; accent-color:var(--dialog-accent); }.compact-check { white-space:nowrap; }.launch-mode-group { display:grid; grid-template-columns:auto 1fr 1fr; align-items:center; gap:8px; margin-top:7px; color:var(--dialog-muted); font-size:13px; }.launch-mode-group button { min-height:38px; border-radius:11px; color:var(--dialog-muted); background:var(--dialog-field); }.launch-mode-group button.active { color:#201d0d; background:var(--dialog-accent); font-weight:700; }.dialog-error { margin-top:14px; color:#d96a73; }
.fixed-select-panel { position:fixed; z-index:120; max-height:240px; overflow:auto; padding:6px; border-radius:14px; color:var(--dialog-text); background:var(--dialog-card); box-shadow:0 18px 45px rgba(0,0,0,.3); }.fixed-select-option { display:block; width:100%; border-radius:9px; padding:11px 12px; color:inherit; background:transparent; text-align:left; }.fixed-select-option:hover,.fixed-select-option.highlighted,.fixed-select-option.selected { background:color-mix(in srgb,var(--dialog-accent) 20%,var(--dialog-card)); }.empty-option { display:block; padding:12px; color:var(--dialog-muted); }
@media (prefers-reduced-motion:reduce) { *,*::before,*::after { transition-duration:.01ms!important; animation-duration:.01ms!important; } }
</style>
