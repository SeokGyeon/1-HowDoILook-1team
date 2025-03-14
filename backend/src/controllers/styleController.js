import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 유틸리티 함수들
const validateRequiredFields = (fields, values) => {
  return fields.every(field => {
    if (Array.isArray(values[field])) {
      return values[field] && values[field].length > 0;
    }
    return values[field];
  });
};

const validateCategories = (categories) => {
  return Object.entries(categories)
    .filter(([_, value]) => value !== null && value !== undefined)
    .every(([_, data]) => 
      data.name && 
      data.brand && 
      typeof data.price === 'number'
    );
};

const formatStyleResponse = (style) => {
  return {
    id: style.id,
    nickname: style.nickname,
    title: style.title,
    content: style.content,
    viewCount: style.viewCount || 0,
    curationCount: style.curationCount || 0,
    createdAt: style.createdAt,
    categories: style.categories?.reduce((acc, category) => {
      acc[category.type] = {
        name: category.name,
        brand: category.brand,
        price: category.price
      };
      return acc;
    }, {}) || {},
    tags: style.tags?.map(tag => tag.name) || [],
    imageUrls: style.images?.map(img => img.url) || [style.imageUrl].filter(Boolean),
    ...(style.ranking && { ranking: style.ranking }),
    ...(style.rating && { rating: Number(style.rating.toFixed(1)) })
  };
};

// 스타일 목록용 응답 형식 (썸네일 포함)
const formatStyleListResponse = (style) => {
  const styleResponse = formatStyleResponse(style);
  return {
    ...styleResponse,
    thumbnail: style.thumbnail || styleResponse.imageUrls[0] || ''
  };
};

const createCategoryData = (categories) => {
  return Object.entries(categories)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([type, data]) => ({
      type,
      name: data.name,
      brand: data.brand,
      price: data.price
    }));
};

const handleError = (error, res) => {
  console.error('에러 발생:', error);
  res.status(500).json({ message: error.message });
};

// 스타일 등록
export const createStyle = async (req, res) => {
  try {
    const { imageUrls, tags, title, nickname, content, password, categories } = req.body;
    
    // 필수 필드 검증
    const requiredFields = ['imageUrls', 'tags', 'title', 'nickname', 'content', 'password', 'categories'];
    if (!validateRequiredFields(requiredFields, req.body)) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    if (!validateCategories(categories)) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }
    
    const styleData = {
      title,
      name: title,
      nickname,
      content,
      password,
      imageUrl: imageUrls[0],
      thumbnail: imageUrls[0],
      categories: {
        create: createCategoryData(categories)
      },
      tags: {
        connectOrCreate: tags.map(tag => ({
          where: { name: tag },
          create: { name: tag }
        }))
      },
      images: {
        create: imageUrls.map((url, index) => ({
          url,
          order: index
        }))
      }
    };

    const style = await prisma.style.create({
      data: styleData,
      include: {
        categories: true,
        tags: true,
        images: true
      }
    });
    
    res.status(201).json(formatStyleResponse(style));
  } catch (error) {
    handleError(error, res);
  }
};

// 스타일 목록 조회
export const getStyles = async (req, res) => {
  try {
    const { 
      sortBy = 'latest', 
      searchBy = 'nickname', 
      keyword = '', 
      tag = '', 
      page = 1, 
      pageSize = 12 
    } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    
    // 검색 조건 설정
    const where = {};
    if (keyword) {
      if (searchBy === 'tag') {
        where.tags = { some: { name: { contains: keyword } } };
      } else {
        where[searchBy] = { contains: keyword };
      }
    }
    
    if (tag) {
      where.tags = { some: { name: tag } };
    }

    // 정렬 조건 설정
    const orderBy = {
      latest: { createdAt: 'desc' },
      mostViewed: { viewCount: 'desc' },
      mostCurated: { curationCount: 'desc' }
    }[sortBy] || { createdAt: 'desc' };

    const [styles, totalCount] = await Promise.all([
      prisma.style.findMany({
        where,
        orderBy,
        skip,
        take: Number(pageSize),
        include: {
          categories: true,
          tags: { select: { name: true } },
          images: true
        }
      }),
      prisma.style.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / Number(pageSize));
    const formattedStyles = styles.map(formatStyleListResponse);

    res.json({
      currentPage: Number(page),
      totalPages,
      totalItemCount: totalCount,
      data: formattedStyles
    });
  } catch (error) {
    handleError(error, res);
  }
};

// 스타일 상세 조회
export const getStyleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    const style = await prisma.style.findUnique({
      where: { id: Number(id) },
      include: {
        categories: true,
        tags: { select: { name: true } },
        images: true
      }
    });

    if (!style) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    res.json(formatStyleResponse(style));
  } catch (error) {
    handleError(error, res);
  }
};

// 스타일 수정
export const updateStyle = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrls, tags, title, nickname, content, password, categories } = req.body;

    // 필수 필드 검증
    const requiredFields = ['imageUrls', 'tags', 'title', 'nickname', 'content', 'password', 'categories'];
    if (!validateRequiredFields(requiredFields, req.body)) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    if (!validateCategories(categories)) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    const existingStyle = await prisma.style.findUnique({
      where: { id: Number(id) }
    });

    if (!existingStyle) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    // 비밀번호 확인 로직 - password 필드 값이 null이 아닌 경우만 확인
    if (existingStyle.password && existingStyle.password !== password) {
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }

    const updatedStyle = await prisma.style.update({
      where: { id: Number(id) },
      data: {
        title,
        name: title, 
        nickname,
        content,
        imageUrl: imageUrls[0],
        thumbnail: imageUrls[0],
        categories: {
          deleteMany: {},
          create: createCategoryData(categories)
        },
        tags: {
          set: [],
          connectOrCreate: tags.map(tag => ({
            where: { name: tag },
            create: { name: tag }
          }))
        },
        // 이미지 업데이트
        images: {
          deleteMany: {},
          create: imageUrls.map((url, index) => ({
            url,
            order: index
          }))
        }
      },
      include: {
        categories: true,
        tags: { select: { name: true } },
        images: true
      }
    });

    res.json(formatStyleResponse(updatedStyle));
  } catch (error) {
    handleError(error, res);
  }
};

// 스타일 삭제
export const deleteStyle = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    const existingStyle = await prisma.style.findUnique({
      where: { id: Number(id) },
      include: {
        categories: true,
        images: true,
        Curation: {
          include: {
            comments: true
          }
        }
      }
    });

    if (!existingStyle) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    // 비밀번호 확인
    if (existingStyle.password && existingStyle.password !== password) {
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }

    // 트랜잭션으로 스타일과 관련된 모든 데이터 삭제
    await prisma.$transaction(async (tx) => {
      // 1. 댓글 삭제 (큐레이션의 댓글)
      if (existingStyle.Curation && existingStyle.Curation.length > 0) {
        for (const curation of existingStyle.Curation) {
          if (curation.comments && curation.comments.length > 0) {
            await tx.comment.deleteMany({
              where: { curationId: curation.id }
            });
          }
        }
      }

      // 2. 큐레이션 삭제
      await tx.curation.deleteMany({
        where: { styleId: Number(id) }
      });

      // 3. 카테고리 삭제
      await tx.category.deleteMany({
        where: { styleId: Number(id) }
      });

      // 4. 이미지 삭제
      await tx.styleImage.deleteMany({
        where: { styleId: Number(id) }
      });

      // 5. 태그 연결 해제 (다대다 관계)
      await tx.style.update({
        where: { id: Number(id) },
        data: { tags: { set: [] } }
      });

      // 6. 스타일 삭제
      await tx.style.delete({
        where: { id: Number(id) }
      });
    });

    res.json({ message: "스타일 삭제 성공" });
  } catch (error) {
    console.error("스타일 삭제 오류:", error);
    handleError(error, res);
  }
};

// 스타일 랭킹 조회
export const getStyleRankings = async (req, res) => {
  try {
    const { rankBy = 'total', page = 1, pageSize = 12 } = req.query;
    
    const skip = (Number(page) - 1) * Number(pageSize);
    
    // rankBy 파라미터에 따른 평가 필드 설정
    const ratingField = rankBy === 'total' ? 
      'COALESCE(AVG((c.trendy + c.personality + c.practicality + c.costEffectiveness) / 4.0), 0)' :
      rankBy === 'trendy' ? 'COALESCE(AVG(c.trendy), 0)' :
      rankBy === 'personality' ? 'COALESCE(AVG(c.personality), 0)' :
      rankBy === 'practicality, costEffectiveness' ? 'COALESCE(AVG((c.practicality + c.costEffectiveness) / 2.0), 0)' :
      'COALESCE(AVG((c.trendy + c.personality + c.practicality + c.costEffectiveness) / 4.0), 0)';

    const [styles, totalCount] = await Promise.all([
      prisma.$queryRaw`
        WITH RankedStyles AS (
          SELECT 
            s.*,
            ${prisma.raw(ratingField)} as rating,
            ROW_NUMBER() OVER (ORDER BY ${prisma.raw(ratingField)} DESC) as ranking
          FROM Style s
          LEFT JOIN Curation c ON s.id = c.styleId
          GROUP BY s.id
        )
        SELECT 
          rs.*,
          t.name as tagName,
          cat.*
        FROM RankedStyles rs
        LEFT JOIN _StyleToTag stt ON rs.id = stt.A
        LEFT JOIN Tag t ON stt.B = t.id
        LEFT JOIN Category cat ON rs.id = cat.styleId
        ORDER BY rs.ranking
        LIMIT ${Number(pageSize)}
        OFFSET ${skip}
      `,
      prisma.style.count()
    ]);

    const totalPages = Math.ceil(totalCount / Number(pageSize));
    const formattedStyles = Array.from(
      styles.reduce((acc, curr) => {
        if (!acc.has(curr.id)) {
          acc.set(curr.id, {
            id: curr.id,
            thumbnail: curr.thumbnail,
            nickname: curr.nickname,
            title: curr.title,
            tags: [],
            categories: {},
            viewCount: curr.viewCount,
            curationCount: curr.curationCount,
            createdAt: curr.createdAt,
            ranking: curr.ranking,
            rating: Number(curr.rating.toFixed(1))
          });
        }
        
        const style = acc.get(curr.id);
        if (curr.tagName && !style.tags.includes(curr.tagName)) {
          style.tags.push(curr.tagName);
        }
        if (curr.type && curr.name && curr.brand && curr.price) {
          style.categories[curr.type] = {
            name: curr.name,
            brand: curr.brand,
            price: curr.price
          };
        }
        return acc;
      }, new Map())
    ).map(([_, style]) => style);

    res.json({
      currentPage: Number(page),
      totalPages,
      totalItemCount: totalCount,
      data: formattedStyles
    });
  } catch (error) {
    handleError(error, res);
  }
};