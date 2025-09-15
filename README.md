# Tauri Chat App

Rust와 TypeScript로 개발된 크로스 플랫폼 채팅 애플리케이션입니다. Tauri를 사용하여 데스크톱과 모바일에서 모두 실행 가능합니다.

## 🚀 주요 기능

- 💬 실시간 메시지 송수신
- 🖥️ 데스크톱 지원 (Windows, macOS, Linux)
- 📱 Android 지원
- 🔔 시스템 트레이 아이콘 (데스크톱)
- 🎨 현대적인 UI/UX
- ⚡ 빠른 성능 (Rust 백엔드)

## 📋 시스템 요구사항

### 기본 요구사항
- **Node.js** 18.0 이상
- **npm** 8.0 이상
- **Rust** 1.70 이상

### 데스크톱 개발
- Windows 10/11 (개발자 모드 활성화 권장)
- macOS 10.15 이상
- Linux (Ubuntu 20.04 이상)

### Android 개발
- **Android Studio** 최신 버전
- **Android SDK** API Level 24 이상
- **Java JDK** 17 이상
- **Android NDK** 최신 버전

## 🔧 설치 및 설정

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd tauri-app
```

### 2. Node.js 의존성 설치
```bash
npm install
```

### 3. Rust 및 Tauri CLI 설치
```bash
# Rust 설치 (https://rustup.rs/)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Tauri CLI 설치 (이미 package.json에 포함됨)
npm install
```

### 4. Android 개발 환경 설정 (Android 빌드 시)

#### Android Studio 설치
1. [Android Studio](https://developer.android.com/studio) 다운로드 및 설치
2. SDK Manager에서 다음 설치:
    - Android SDK Platform 24 이상
    - Android SDK Build-Tools
    - Android NDK

#### 환경 변수 설정
**Windows:**
```powershell
$env:ANDROID_HOME = "C:\Users\{username}\AppData\Local\Android\Sdk"
$env:NDK_HOME = "$env:ANDROID_HOME\ndk\{version}"
```

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export NDK_HOME=$ANDROID_HOME/ndk/{version}
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Android 타겟 추가
```bash
npm run tauri add android
```

## 🚀 실행 방법

### 데스크톱 개발 모드
```bash
npm run tauri dev
```
- 웹 개발 서버와 Tauri 앱이 동시에 실행됩니다
- 코드 변경 시 자동으로 리로드됩니다

### 데스크톱 빌드
```bash
npm run tauri build
```
- `src-tauri/target/release/bundle/` 폴더에 실행 파일이 생성됩니다

### Android 개발 모드
```bash
npm run tauri android dev
```
- 에뮬레이터 또는 연결된 기기 선택
- APK가 자동으로 설치되고 실행됩니다

### Android 빌드
```bash
npm run tauri android build
```
- `src-tauri/gen/android/app/build/outputs/apk/` 폴더에 APK 파일이 생성됩니다

## 📁 프로젝트 구조

```
tauri-app/
├── src/                    # 프론트엔드 (Vite + TypeScript)
│   ├── App.tsx
│   ├── main.tsx
│   └── styles/
├── src-tauri/             # 백엔드 (Rust)
│   ├── src/
│   │   ├── lib.rs         # 메인 로직
│   │   └── main.rs
│   ├── Cargo.toml         # Rust 의존성
│   ├── tauri.conf.json    # Tauri 설정
│   └── gen/android/       # 생성된 Android 프로젝트
├── package.json           # Node.js 의존성
└── vite.config.ts         # Vite 설정
```

## 🛠️ 개발 가이드

### 새로운 Tauri 명령 추가
```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn my_command(param: String) -> String {
    format!("Hello, {}!", param)
}

// 명령 등록
.invoke_handler(tauri::generate_handler![
    greet,
    send_message,
    get_messages,
    my_command  // 새 명령 추가
])
```

### 프론트엔드에서 명령 호출
```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke("my_command", { param: "World" });
console.log(result); // "Hello, World!"
```

## 🐛 문제 해결

### Windows에서 심볼릭 링크 오류
```bash
# 개발자 모드 활성화 또는 관리자 권한으로 실행
```

### Android 빌드 시 Kotlin 컴파일 오류
```bash
# 프로젝트를 C: 드라이브로 이동
# 또는 생성된 파일 정리 후 재빌드
rmdir /s /q src-tauri\gen\android
npm run tauri android init
```

### 모듈을 찾을 수 없음 오류
```bash
# 캐시 정리 및 재설치
npm run tauri android init
cargo clean
npm install
```

## 📦 빌드 결과물

### 데스크톱
- **Windows**: `.exe`, `.msi`
- **macOS**: `.app`, `.dmg`
- **Linux**: `.deb`, `.AppImage`

### Android
- **Debug**: `app-debug.apk`
- **Release**: `app-release.apk`

## 🔒 보안 설정

`src-tauri/tauri.conf.json`에서 보안 설정을 확인하세요:
```json
{
  "security": {
    "csp": "default-src 'self'; script-src 'self'"
  }
}
```

## 📚 참고 자료

- [Tauri 공식 문서](https://tauri.app/)
- [Tauri API 문서](https://docs.rs/tauri/)
- [Vite 문서](https://vitejs.dev/)
- [Android 개발 가이드](https://developer.android.com/)

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

## 📞 지원

문제가 있거나 질문이 있으시면 Issues를 통해 문의해 주세요.
