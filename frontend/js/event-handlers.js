// event-handlers.js
import { messageInput, sendButton, loginPopup, signInButton, closeButtons, userButton, userInfoPopup, logoutButton, loginButton, signInPopup, addChatButton } from './dom-elements.js';
import { updateSendButtonState, sendMessage, autoResize, loadChatroomData, addNewChat } from './chat-actions.js';
import { initializeFileHandlers } from './file-handler.js';
import { handleLogin, handleLogout, fetchUserInfo } from './auth.js';
import { initializeRegistrationHandlers } from './registration.js';
import { initializeSidebar } from './sidebar.js';
import { initializeChatManagement } from './chat-management.js';

export function initializeEventHandlers() {
  // 입력창 상태 업데이트
  messageInput.addEventListener('input', updateSendButtonState);
  updateSendButtonState();

  // 메시지 전송 이벤트
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // 입력창 자동 크기 조절
  messageInput.addEventListener('input', autoResize);

  // 로그인 팝업 열기
  userButton.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    } else {
      loginPopup.classList.remove('hidden');
    }
  });

  // 팝업 닫기 버튼
  userInfoPopup.querySelector('.close-button').addEventListener('click', function () {
    userInfoPopup.classList.add('hidden');
  });

  // 회원가입 버튼
  signInButton.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 폼 제출 방지
    loginPopup.classList.add('hidden'); // 로그인 팝업 숨기기
    signInPopup.classList.remove('hidden'); // 회원가입 팝업 표시
  });

  // 회원가입 팝업에서 닫기 버튼 클릭시 팝업 닫기
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      signInPopup.classList.add("hidden");
    })
  })

  // 로그아웃 이벤트
  logoutButton.addEventListener('click', handleLogout);

  // 회원가입 핸들러 초기화
  initializeRegistrationHandlers();

  // 사이드바 기능 초기화
  initializeSidebar();

  // 채팅방 데이터 로드
  loadChatroomData();

  // 채팅방 관리 기능 초기화
  initializeChatManagement();

  // 로그인 이벤트
  loginButton.addEventListener('click', async (event) => {
    event.preventDefault(); // 기본 폼 제출 방지

    const userid = document.querySelector('input#userid').value.trim();
    const password = document.querySelector('input#password').value.trim();

    handleLogin(userid, password);
  });

  // 파일 처리 초기화
  initializeFileHandlers();

  // 채팅방 추가
  let chatCount = 1; // 기본 값 설정
  addChatButton.addEventListener('click', function () {
    addNewChat(chatCount);
  })

}