// chat-management.js
import { chatsList, popup, deleteButton, closePopupButton, renameInput, saveRenameButton } from './dom-elements.js';

let selectedChat = null;

export function initializeChatManagement() {
  // 채팅방 옵션 버튼 클릭 시 팝업 열기
  chatsList.addEventListener('click', (e) => {
    if (e.target.closest('.chat-more-button')) {
      selectedChat = e.target.closest('li');
      openPopup();
    }
  });

  // 팝업 닫기 버튼
  closePopupButton.addEventListener('click', closePopup);

  // 채팅방 이름 변경
  saveRenameButton.addEventListener('click', renameChat);

  // 채팅방 삭제
  deleteButton.addEventListener('click', deleteChat);
};

// 팝업 열기
function openPopup() {
  popup.classList.remove('hidden');
};

// 팝업 닫기
function closePopup() {
  popup.classList.add('hidden');
  selectedChat = null;
};

// 채팅방 이름 변경
function renameChat() {
  const newName = renameInput.value.trim();
  if (newName && selectedChat) {
    selectedChat.firstChild.textContent = newName + ' ';
    renameInput.value = '';
    closePopup();
  }
};

// 채팅방 삭제
function deleteChat() {
  if (selectedChat && confirm(`채팅방을 삭제하시겠습니까?`)) {
    selectedChat.remove();
    closePopup();
  }
};