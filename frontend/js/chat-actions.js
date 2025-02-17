// chat-actions.js
import { messageInput, chatDescription, chatAction, chatContent, chatInput, chatsListUl } from './dom-elements.js';
import { addNewChat } from './chat-management.js';

// 버튼 활성화 상태 업데이트
export function updateSendButtonState() {
  const userMessage = messageInput.value.trim();
  if (userMessage.length === 0) {
    // 비어있으면 버튼 비활성화
    sendButton.disabled = true;
  } else {
    // 내용 있으면 버튼 활성화
    sendButton.disabled = false;
  }
}

// 높이를 초기화해 텍스트 길이에 맞게 조정
export function autoResize() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
}

// 메세지 전송
export async function sendMessage() {
  const userMessage = messageInput.value.trim();

  // 입력 값이 비어 있으면 종료
  if (!userMessage) return;

  // UI 업데이트: 채팅 설명과 액션 숨김 처리
  chatDescription.classList.add('hide');
  chatAction.classList.add('hide');

  let chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) {
    chatMessages = document.createElement('div');
    chatMessages.id = 'chatMessages';
    chatMessages.classList.add('chat-messages');
    chatContent.appendChild(chatMessages);
  }

  // 사용자 메시지 요소 생성
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'user-message');
  messageDiv.textContent = userMessage;
  chatMessages.appendChild(messageDiv);

  // 입력창 초기화
  messageInput.value = '';
  updateSendButtonState();
  messageInput.style.height = 'auto';

  // // 스크롤을 최신 메시지로
  // chatMessages.scrollTop = chatMessages.scrollHeight;

  // chat-input 아래로 이동
  chatInput.classList.add('down');

  // URL에서 chatroom_id 추출 (없으면 null)
  let chatroomId = null;
  const currentPath = window.location.pathname;
  if (currentPath.includes("chatroom=")) {
    chatroomId = currentPath.split("=")[1];
  }
	console.log("chatroom is ", chatroomId);
	console.log("Sending request to /chat/new");

  // 서버 요청 처리
  try {
    const token = localStorage.getItem('token');

    // 서버 요청: 메시지 전송 및 (필요시) 새 채팅방 생성
    const response = await fetch('http://localhost:8008/chat/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // JWT 토큰 추가
      },
      body: JSON.stringify({ message: userMessage, chatroom_id: chatroomId }),
    });

    const result = await response.json();
    console.log("Chat Response:", result);

    if (response.ok && result.chatroomId) {
      // 채팅방 ID가 있으면 해당 페이지로 이동
      // window.location.href = `http://localhost:5500/chatroom=${result.chatroomId}`;
      // URL 변경 (새로고침 없이)

			// URL에 chatroom_id가 없다면 새 채팅방 생성 및 URL 업데이트
			if (!chatroomId) {
      	addNewChat(result.chatroomId)
      	history.pushState(null, "", `/chatroom=${result.chatroomId}`);
			}

      // 필요한 경우 새 데이터를 가져와서 화면에 반영
      console.log(`Navigated to chatroom: ${chatroomId}`);

      // 챗봇 응답 메시지 추가
      const botMessageDiv = document.createElement('div');
      botMessageDiv.classList.add('message', 'bot-message');
      botMessageDiv.textContent = result.botMessage; // 서버에서 받은 botMessage
      chatMessages.appendChild(botMessageDiv);

      // 스크롤을 최신 메시지로
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      console.error("Failed to get chatroom ID.");
    }
  } catch (error) {
    console.error('Error sending chat message:', error);
  }
}

// 채팅방 데이터 로드
export async function loadChatroomData() {
  const token = localStorage.getItem("token");

  // 로그인 상태 확인: token이 없으면 실행 중단
  if (!token) {
    console.warn("로그인 상태가 아닙니다. 채팅방 데이터를 불러오지 않습니다.");
    return;
  }

	// URL에서 chatroom_id 추출
  const currentPath = window.location.pathname;
  const chatroomId = currentPath.split("=")[1];

  // 채팅방 ID가 없는 경우 실행 중단
  if (!chatroomId) {
    console.warn("채팅방 ID가 없으므로 채팅 데이터를 불러오지 않습니다.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8008/chatroom/${chatroomId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chatroom data");
    }

    const { chatroom, messages } = await response.json();

    // UI 초기화
    chatDescription.classList.add("hide");
    chatAction.classList.add("hide");
    chatInput.classList.add("down");

    let chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) {
      chatMessages = document.createElement("div");
      chatMessages.id = "chatMessages";
      chatMessages.classList.add("chat-messages");
      chatContent.appendChild(chatMessages);
    } else {
      chatMessages.innerHTML = ""; // 기존 메시지 초기화
    }

    // 메시지를 UI에 추가
    messages.forEach((message) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add(
        "message",
        message.sender_type === "user" ? "user-message" : "bot-message"
      );
      messageDiv.textContent = message.content;
      chatMessages.appendChild(messageDiv);
    });

    // 스크롤을 최신 메시지로 이동
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    console.error("Error loading chatroom data:", error);
    alert("채팅방 데이터를 불러오는 중 오류가 발생했습니다.");
  }
}