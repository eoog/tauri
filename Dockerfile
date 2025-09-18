# Tauri 빌드용 Dockerfile
FROM ubuntu:22.04

# 시간대 설정 (interactive 방지)
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Seoul

# 시스템 업데이트 및 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    build-essential \
    pkg-config \
    libssl-dev \
    libgtk-3-dev \
    libglib2.0-dev \
    libwebkit2gtk-4.0-dev \
    libappindicator3-dev \
    librsvg2-dev \
    patchelf \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y xdg-utils

# Node.js 설치 (최신 LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# Rust 설치
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"

# Tauri CLI 설치
RUN cargo install tauri-cli

# 작업 디렉토리 설정
WORKDIR /workspace

# 기본 명령어
CMD ["/bin/bash"]
