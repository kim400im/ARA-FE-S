// sidebar.js
import { sideContainer, toggleButton, chatHeader, toggleSectionButtons } from './dom-elements.js';

export function initializeSidebar() {
  // 사이드바 초기 설정
  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    sideContainer.classList.add('collapsed');
    chatHeader.classList.add('collapsed');
  }

  // 사이드바 상태 저장하여 새로고침 후에도 유지
  toggleButton.addEventListener('click', function () {
    const isCollapsed = sideContainer.classList.toggle('collapsed');
    chatHeader.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  });

  // 사이드바 리스트 토글 처리
  toggleSectionButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      const menuHeader = event.target.closest('.menu-header');
      const collapsible = menuHeader.nextElementSibling;

      // 토글 상태 변경
      if (collapsible.classList.contains('expanded')) {
        collapsible.classList.remove('expanded');
        button.querySelector('.material-icons').textContent = 'expand_more';
      } else {
        collapsible.classList.add('expanded');
        button.querySelector('.material-icons').textContent = 'expand_less';
      }
    });
  });
}