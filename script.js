// Firebase가 로드될 때까지 대기하는 함수
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.db && window.firebase) {
            resolve();
            return;
        }
        
        window.addEventListener('firebaseReady', () => {
            resolve();
        }, { once: true });
        
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}

// 데이터 저장소
let questions = [];

// DOM 요소들
const questionForm = document.getElementById('question-form');
const questionsList = document.getElementById('questions-list');

// HTML 이스케이프 함수
function escapeHtml(text) {
    if (text === null || text === undefined) {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 이벤트 리스너 등록
questionForm.addEventListener('submit', handleQuestionSubmit);

// 페이지 로드 시 질문 목록 표시
window.addEventListener('load', async () => {
    await waitForFirebase();
    await loadQuestions();
    displayQuestions();
});

// Firebase에서 질문 목록 불러오기
async function loadQuestions() {
    try {
        const db = window.db;
        const questionsRef = db.collection('questions');
        const querySnapshot = await questionsRef.orderBy('timestamp', 'desc').get();
        
        questions = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            questions.push({
                id: doc.id,
                question: data.question || data.title || data.content,
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
    const question = formData.get('question');
    
    if (!question) {
        showNotification('질문을 입력해주세요.', 'error');
        return;
    }
    
    try {
        const db = window.db;
        const questionsRef = db.collection('questions');
        await questionsRef.add({
            question: question,
            timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
            answers: []
        });
        
        showNotification('질문이 성공적으로 등록되었습니다!', 'success');
        questionForm.reset();
        await loadQuestions();
        displayQuestions();
        
    } catch (error) {
        console.error('질문 등록 실패:', error);
        showNotification('질문 등록에 실패했습니다.', 'error');
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
        const questionText = question.question || '';
        const answers = question.answers || [];
        
        return `
            <div class="question-item" data-question-id="${question.id}">
                <div class="question-content">${escapeHtml(questionText)}</div>
                <div class="question-footer">
                    <span class="question-date">${question.date}</span>
                    <button class="reply-btn" onclick="toggleAnswerForm('${question.id}')">
                        <i class="fas fa-reply"></i> 답변하기
                    </button>
                </div>
                
                <div class="answers-section" id="answers-${question.id}" style="display: none;">
                    <div class="answers-title">
                        <i class="fas fa-comments"></i> 답변 (${answers.length}개)
                    </div>
                    <div class="answers-list">
                        ${answers.length > 0 ? answers.map(answer => `
                            <div class="answer-item">
                                <div class="answer-content">${escapeHtml(answer.content)}</div>
                                <div class="answer-date">${answer.date}</div>
                            </div>
                        `).join('') : '<p style="color: #666; text-align: center;">아직 답변이 없습니다.</p>'}
                    </div>
                    
                    <div class="answer-form">
                        <form onsubmit="handleAnswerSubmit(event, '${question.id}')">
                            <div class="answer-input-group">
                                <textarea id="answer-input-${question.id}" placeholder="답변을 작성해주세요" required></textarea>
                                <button type="submit" class="answer-submit-btn">
                                    <i class="fas fa-paper-plane"></i> 답변
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 답변 폼 토글
function toggleAnswerForm(questionId) {
    const answersSection = document.getElementById(`answers-${questionId}`);
    if (answersSection.style.display === 'none') {
        answersSection.style.display = 'block';
    } else {
        answersSection.style.display = 'none';
    }
}

// 답변 제출 처리
async function handleAnswerSubmit(e, questionId) {
    e.preventDefault();
    
    const answerInput = document.getElementById(`answer-input-${questionId}`);
    const content = answerInput.value;
    
    if (!content) {
        showNotification('답변 내용을 입력해주세요.', 'error');
        return;
    }
    
    try {
        const question = questions.find(q => q.id === questionId);
        if (!question) {
            showNotification('질문을 찾을 수 없습니다.', 'error');
            return;
        }
        
        const newAnswer = {
            id: Date.now().toString(),
            content: content,
            date: new Date().toLocaleString('ko-KR')
        };
        
        question.answers.push(newAnswer);
        
        const db = window.db;
        const questionRef = db.collection('questions').doc(questionId);
        await questionRef.update({
            answers: question.answers
        });
        
        showNotification('답변이 성공적으로 등록되었습니다!', 'success');
        answerInput.value = '';
        await loadQuestions();
        displayQuestions();
        
    } catch (error) {
        console.error('답변 등록 실패:', error);
        showNotification('답변 등록에 실패했습니다.', 'error');
    }
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}
