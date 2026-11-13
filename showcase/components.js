const picker = document.querySelector('[data-picker]');
const pickerTrigger = picker.querySelector('.picker-trigger');
const pickerValueNode = picker.querySelector('.picker-value');
const pickerValue = document.querySelector('#pickerValue');

function positionPicker() {
  if (!picker.classList.contains('is-open')) return;
  const rect = pickerTrigger.getBoundingClientRect();
  const gap = 7;
  const contentHeight = Math.min(280, picker.querySelector('.picker-options').scrollHeight || 280);
  const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - gap);
  const spaceAbove = Math.max(0, rect.top - gap);
  const opensAbove = spaceBelow < contentHeight && spaceAbove > spaceBelow;
  const maxHeight = Math.max(0, Math.min(contentHeight, opensAbove ? spaceAbove : spaceBelow));
  picker.style.setProperty('--dropdown-top', `${Math.max(8, opensAbove ? rect.top - gap - maxHeight : rect.bottom + gap)}px`);
  picker.style.setProperty('--dropdown-left', `${rect.left}px`);
  picker.style.setProperty('--dropdown-width', `${rect.width}px`);
  picker.style.setProperty('--dropdown-max-height', `${maxHeight}px`);
}

pickerTrigger.addEventListener('click', () => {
  const open = picker.classList.toggle('is-open');
  pickerTrigger.setAttribute('aria-expanded', String(open));
  if (open) requestAnimationFrame(positionPicker);
});

picker.querySelectorAll('[role="option"]').forEach((option) => {
  option.addEventListener('click', () => {
    picker.querySelectorAll('[role="option"]').forEach((item) => item.setAttribute('aria-selected', String(item === option)));
    pickerValueNode.textContent = option.textContent;
    pickerValue.textContent = `已选择 ${option.textContent.split('·')[0].trim()}`;
    picker.classList.remove('is-open');
    pickerTrigger.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('resize', positionPicker);
window.addEventListener('scroll', positionPicker, true);

document.addEventListener('click', (event) => {
  if (!picker.contains(event.target)) {
    picker.classList.remove('is-open');
    pickerTrigger.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('#launchMode button').forEach((option) => {
  option.addEventListener('click', () => {
    document.querySelectorAll('#launchMode button').forEach((item) => {
      const active = item === option;
      item.classList.toggle('active', active);
      item.setAttribute('aria-checked', String(active));
    });
    document.querySelector('#launchMode').dataset.mode = option.dataset.mode;
    document.querySelector('.mode-result').textContent = option.dataset.mode === 'smart'
      ? '当前：智能切换显示器后启动游戏'
      : '当前：保留当前显示器设置，仅启动游戏';
  });
});
