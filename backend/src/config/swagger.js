import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "How Do I Look API",
      version: "1.0.0",
      description: "패션 스타일 공유 플랫폼 API 문서",
    },
    // 서버 환경 설정
    servers: [
      {
        url: "http://localhost:4000",
        description: "개발 서버",
      },
      {
        url: "https://one-howdoilook-1team.onrender.com/",
        description: "Real Server",
      },
    ],
  },
  // API 문서화 대상 파일 경로 설정
  apis: [
    "./src/routes/*.js", // 라우트 정의 파일
    "./src/models/*.js", // 모델 정의 파일
    "./src/swagger/*.yaml", // 추가 스웨거 명세 파일
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
