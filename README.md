# 🔥 Firebase 질문게시판

Firebase Firestore를 사용한 실시간 질문게시판 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📝 **질문 등록**: 제목과 내용으로 간단한 질문 작성
- 💬 **답변 시스템**: 질문에 대한 답변 등록
- 🔄 **실시간 동기화**: Firebase를 통한 실시간 데이터 저장
- 📱 **반응형 디자인**: 모바일과 데스크톱에서 모두 사용 가능
- 🎨 **모던 UI**: 깔끔하고 직관적인 사용자 인터페이스

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/question-board-app.git
cd question-board-app
```

### 2. Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firestore Database 생성 (테스트 모드로 시작)
3. 웹 앱 등록 후 설정 정보 복사
4. `firebase-config.example.js`를 `firebase-config.js`로 복사
5. `firebase-config.js`에 실제 Firebase 설정 정보 입력

```bash
cp firebase-config.example.js firebase-config.js
# firebase-config.js 파일을 편집하여 실제 설정값 입력
```

### 3. 로컬 서버 실행
```bash
python3 -m http.server 8080
```

### 4. 브라우저에서 접속
```
http://localhost:8080
```

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Firestore
- **스타일링**: Font Awesome, Google Fonts
- **배포**: GitHub Pages (선택사항)

## 📁 프로젝트 구조

```
question-board/
├── index.html              # 메인 HTML 파일
├── style.css               # 스타일시트
├── script.js               # 메인 JavaScript 로직
├── firebase-config.js      # Firebase 설정 (보안상 .gitignore에 포함)
├── firebase-config.example.js  # Firebase 설정 예시
├── .gitignore              # Git 제외 파일 목록
└── README.md               # 프로젝트 설명서
```

## 🔐 보안 설정

### Firebase 보안 규칙
Firestore Database → 규칙 탭에서 다음 규칙을 설정하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /questions/{questionId} {
      allow read, write: if true;  // 개발용 (프로덕션에서는 더 엄격한 규칙 필요)
    }
  }
}
```

## 🌐 배포

### GitHub Pages 배포
1. GitHub 저장소 설정 → Pages
2. Source를 "Deploy from a branch"로 설정
3. Branch를 "main"으로 설정
4. Save 클릭

### Firebase Hosting 배포 (선택사항)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**참고**: Firebase API 키는 보안상 공개 저장소에 업로드하지 마세요. `firebase-config.js` 파일은 `.gitignore`에 포함되어 있습니다. 