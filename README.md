## 🛰️ Proxy Server (KISA_Dashboard Proxy)

클라이언트와 별도로 운영되는 Express 기반 프록시 서버입니다.  
**쿠키 관리** 및 **SFTP 파일 업로드** 등의 기능을 담당합니다.

---

### 🛠 기술 스택

- **Node.js**: v22.13.1
- **패키지 매니저**: npm (v11.1.0)
- **서버 프레임워크**: Express
- **컨테이너 환경**: Docker

---

### ⚙️ 실행 방법

```bash
# 1. 프로젝트 클론
git clone git@github.com:GP-SoftwareDivision/kisa_esms_proxy.git

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run server

# 4. 서버 실행 확인
# 터미널에 아래 메시지가 출력됩니다
서버 실행 중 8080
```
