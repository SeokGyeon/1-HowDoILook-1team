const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// CORS 설정
app.use(cors());
app.use(express.json());

// 스타일 데이터
const stylesData = [
  { 
    id: 1, 
    name: '캐주얼', 
    title: '캐주얼',
    description: '편안하고 자유로운 스타일',
    content: '편안하고 자유로운 스타일입니다. 일상생활에 적합합니다.',
    imageUrl: 'https://picsum.photos/300/400?random=1',
    thumbnail: 'https://picsum.photos/300/400?random=1',
    tags: [1, 3],
    nickname: '스타일리스트1',
    viewCount: 120,
    curationCount: 15,
    categories: { 
      casual: { name: '캐주얼 상의', brand: '나이키', price: 89000 },
      comfortable: { name: '편안한 바지', brand: '아디다스', price: 75000 }
    },
    createdAt: new Date().toISOString()
  },
  { 
    id: 2, 
    name: '포멀', 
    title: '포멀',
    description: '격식있고 세련된 스타일',
    content: '격식있고 세련된 스타일입니다. 비즈니스 미팅이나 중요 행사에 적합합니다.',
    imageUrl: 'https://picsum.photos/300/400?random=2',
    thumbnail: 'https://picsum.photos/300/400?random=2',
    tags: [2, 5],
    nickname: '스타일리스트2',
    viewCount: 85,
    curationCount: 10,
    categories: { 
      formal: { name: '정장 재킷', brand: '지오다노', price: 159000 },
      business: { name: '정장 바지', brand: '유니클로', price: 89000 }
    },
    createdAt: new Date().toISOString()
  },
  { 
      id: 3, 
      name: '스포티', 
      title: '스포티',
      description: '활동적이고 역동적인 스타일',
      content: '활동적이고 역동적인 스타일입니다. 운동이나 야외 활동에 적합합니다.',
      imageUrl: 'https://picsum.photos/300/400?random=3',
      thumbnail: 'https://picsum.photos/300/400?random=3',
    tags: [1, 4],
    nickname: '스타일리스트3',
    viewCount: 95,
    curationCount: 12,
    categories: { 
      sporty: { name: '스포츠 상의', brand: '언더아머', price: 67000 },
      active: { name: '스포츠 레깅스', brand: '푸마', price: 55000 }
    },
    createdAt: new Date().toISOString()
  }
];

// 태그 데이터
const tagsData = [
  { id: 1, name: '인기' },
  { id: 2, name: '신상' },
  { id: 3, name: '추천' },
  { id: 4, name: '세일' },
  { id: 5, name: '한정판' }
];

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '백엔드 서버가 실행 중입니다!' });
});

// 스타일 목록 조회 (GET /styles)
app.get('/styles', (req, res) => {
  // 페이지네이션 정보를 포함한 응답 형식 준수
  res.json({
    currentPage: 1,
    totalPages: 1,
    totalItemCount: stylesData.length,
    data: stylesData
  });
});

// 특정 스타일 조회 (GET /styles/{styleId})
app.get('/styles/:id', (req, res) => {
  const styleId = parseInt(req.params.id);
  const style = stylesData.find(s => s.id === styleId);
  
  if (!style) {
    return res.status(404).json({ message: '스타일을 찾을 수 없습니다' });
  }
  
  res.json(style);
});

// 태그 목록 (GET /tags)
app.get('/tags', (req, res) => {
  // 프론트엔드가 기대하는 형식으로 응답 (tags 키를 포함)
  res.json({ tags: tagsData });
});

// 랭킹 정보 (GET /ranking)
app.get('/ranking', (req, res) => {
  res.json({
    currentPage: 1,
    totalPages: 1,
    totalItemCount: 3,
    data: stylesData.slice(0, 3)
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});