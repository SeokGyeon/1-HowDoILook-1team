import { format } from 'util';

const loggerMiddleware = (req, res, next) => {
  // 원래 json 메소드 저장
  const originalJson = res.json;
  
  // json 메소드를 오버라이드
  res.json = function (data) {
    // 응답 시간 계산
    const responseTime = new Date() - req._startTime;
    
    // 요청 정보 로깅
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    
    // 응답 데이터 로깅 - JSON으로 변환하여 더 자세히 출력
    console.log('응답 데이터:', JSON.stringify(data, null, 2));
    console.log(`응답 시간: ${responseTime}ms`);
    console.log('-----------------------------');
    
    // 원래 json 메소드 호출
    return originalJson.call(this, data);
  };
  
  // 요청 시작 시간 기록
  req._startTime = new Date();
  
  next();
};

export default loggerMiddleware; 