// Firebase 함수들을 window 객체에서 가져오기
const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query, serverTimestamp } = window;

// 데이터 저장소 (Firebase 사용)
let questions = [];
let currentQuestionId = null;

// DOM 요소들
const questionForm = document.getElementById('question-form');
const questionsList = document.getElementById('questions-list');
const questionModal = document.getElementById('question-modal');
const closeModal = document.getElementById('close-modal');
const answerForm = document.getElementById('answer-form');

// HTML 이스케이프 함수
function escapeHtml(text) {
    if (text === null || text === undefined) {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 질문 상세 보기 함수
function openQuestionDetail(questionId) {
    currentQuestionId = questionId;
    displayQuestionDetail(questionId);
    questionModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 이벤트 리스너 등록
questionForm.addEventListener('submit', handleQuestionSubmit);
closeModal.addEventListener('click', closeQuestionModal);
answerForm.addEventListener('submit', handleAnswerSubmit);

// 질문 목록 클릭 이벤트
questionsList.addEventListener('click', (e) => {
    const questionItem = e.target.closest('.question-item');
    if (questionItem) {
        const questionId = questionItem.dataset.questionId;
        openQuestionDetail(questionId);
    }
});

// 페이지 로드 시 질문 목록 표시
window.addEventListener('load', async () => {
    // Firebase가 로드될 때까지 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadQuestions();
    displayQuestions();
});

// Firebase에서 질문 목록 불러오기
async function loadQuestions() {
    try {
        const questionsRef = collection(window.db, 'questions');
        const q = query(questionsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        questions = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            questions.push({
                id: doc.id,
                title: data.title,
                content: data.content,
                date: data.timestamp ? data.timestamp.toDate().toLocaleString('ko-KR') : new Date().toLocaleString('ko-KR'),
                answers: data.answers || []
            });
        });
    } catch (error) {
        console.error('질문 목록 불러오기 실패:', error);
        showNotification('질문 목록을 불러오는데 실패했습니다.', 'error');
    }
}

// 질문 제출 처리
async function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(questionForm);
    const title = formData.get('title');
    const content = formData.get('content');
    
    // 데이터 검증
    if (!title || !content) {
        showNotification('제목과 내용을 입력해주세요.', 'error');
        return;
    }
    
    try {
        // Firebase에 질문 추가
        const questionsRef = collection(window.db, 'questions');
        const docRef = await addDoc(questionsRef, {
            title: title,
            content: content,
            timestamp: serverTimestamp(),
            answers: []
        });
        
        // 성공 메시지 표시
        showNotification('질문이 성공적으로 등록되었습니다!', 'success');
        
        // 폼 초기화
        questionForm.reset();
        
        // 질문 목록 새로고침
        await loadQuestions();
        displayQuestions();
        
    } catch (error) {
        console.error('질문 등록 실패:', error);
        showNotification('질문 등록에 실패했습니다.', 'error');
    }
}

// 답변 제출 처리
async function handleAnswerSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(answerForm);
    const content = formData.get('answer-content');
    
    if (!content) {
        showNotification('답변 내용을 입력해주세요.', 'error');
        return;
    }
    
    try {
        // 현재 질문 찾기
        const question = questions.find(q => q.id === currentQuestionId);
        if (!question) {
            showNotification('질문을 찾을 수 없습니다.', 'error');
            return;
        }
        
        // 답변 추가
        const newAnswer = {
            id: Date.now().toString(),
            content: content,
            date: new Date().toLocaleString('ko-KR')
        };
        
        question.answers.push(newAnswer);
        
        // Firebase 업데이트
        const questionRef = doc(window.db, 'questions', currentQuestionId);
        await updateDoc(questionRef, {
            answers: question.answers
        });
        
        // 성공 메시지 표시
        showNotification('답변이 성공적으로 등록되었습니다!', 'success');
        
        // 폼 초기화
        answerForm.reset();
        
        // 질문 상세 새로고침
        displayQuestionDetail(currentQuestionId);
        
    } catch (error) {
        console.error('답변 등록 실패:', error);
        showNotification('답변 등록에 실패했습니다.', 'error');
    }
}

// 질문 목록 표시
function displayQuestions() {
    if (questions.length === 0) {
        questionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>등록된 질문이 없습니다</h3>
                <p>첫 번째 질문을 작성해보세요!</p>
            </div>
        `;
        return;
    }
    
    questionsList.innerHTML = questions.map(question => {
        const content = question.content || '';
        const title = question.title || '';
        
        return `
            <div class="question-item" data-question-id="${question.id}">
                <div class="question-header">
                    <div>
                        <div class="question-title">${escapeHtml(title)}</div>
                    </div>
                </div>
                <div class="question-meta">
                    <span><i class="fas fa-clock"></i> ${question.date || ''}</span>
                </div>
                <div class="question-content">
                    ${escapeHtml(content.substring(0, 150))}${content.length > 150 ? '...' : ''}
                </div>
                <div class="question-footer">
                    <div class="answer-count">
                        <i class="fas fa-comments"></i>
                        ${(question.answers || []).length}개의 답변
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 질문 상세 내용 표시
function displayQuestionDetail(questionId) {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    // 모달 제목 설정
    document.getElementById('modal-title').textContent = question.title;
    
    // 질문 상세 내용
    document.getElementById('question-detail').innerHTML = `
        <div class="content">${escapeHtml(question.content)}</div>
        <div class="meta">
            <span><i class="fas fa-clock"></i> ${question.date}</span>
        </div>
    `;
    
    // 답변 목록 표시
    displayAnswers(question.answers);
}

// 답변 목록 표시
function displayAnswers(answers) {
    const answersList = document.getElementById('answers-list');
    
    if (!answers || answers.length === 0) {
        answersList.innerHTML = `
            <div class="empty-answers">
                <i class="fas fa-comment-slash"></i>
                <p>아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!</p>
            </div>
        `;
        return;
    }
    
    answersList.innerHTML = answers.map(answer => `
        <div class="answer-item">
            <div class="answer-header">
                <span class="answer-date">${answer.date}</span>
            </div>
            <div class="answer-content">${escapeHtml(answer.content)}</div>
        </div>
    `).join('');
}

// 모달 닫기
function closeQuestionModal() {
    questionModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentQuestionId = null;
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target === questionModal) {
        closeQuestionModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && questionModal.style.display === 'block') {
        closeQuestionModal();
    }
});

// 알림 표시 함수
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 스타일 적용
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    // 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 빈 상태 스타일 추가
const emptyStateStyle = document.createElement('style');
emptyStateStyle.textContent = `
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }
    
    .empty-state i {
        font-size: 4rem;
        color: #ddd;
        margin-bottom: 20px;
        display: block;
    }
    
    .empty-state h3 {
        margin-bottom: 10px;
        color: #333;
    }
    
    .empty-answers {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }
    
    .empty-answers i {
        font-size: 3rem;
        color: #ddd;
        margin-bottom: 15px;
        display: block;
    }
`;
document.head.appendChild(emptyStateStyle);
