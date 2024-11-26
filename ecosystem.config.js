module.exports = {
  apps: [
    {
      name: "front",          // 애플리케이션 이름
      script: "bunx",                 // 실행할 명령어 (bunx)
      args: "serve -s handicine/build",         // bunx에 전달할 인자
      env: {
        PORT: 80,                     // 환경 변수 (80번 포트)
      },
      watch: false,                   // 코드 변경 감지 (정적 파일이므로 꺼두는 것이 좋음)
      instances: 1,                   // 단일 인스턴스 실행
      exec_mode: "fork",              // fork 모드 사용
      log_file: "./logs/combined.log", // 통합 로그 파일 경로
      error_file: "./logs/error.log",  // 에러 로그 파일 경로
      out_file: "./logs/output.log",   // 출력 로그 파일 경로
    },
  ],
};
