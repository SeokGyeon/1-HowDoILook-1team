import Curation from "../models/curation.js";

//큐레이션 조회
const getCurations = async (req, res) => {
  const { styleId, page = 1, pageSize = 10, searchBy, keyword } = req.query;

  // 기본 쿼리 설정
  const query = {};

  // 스타일 ID에 맞는 큐레이팅 설정
  if (styleId) {
    query.styleId = styleId;
  }

  // 검색 기준과 검색어로 필터링
  if (searchBy && keyword) {
    if (searchBy === "nickname") {
      query.nickname = { $regex: keyword, $options: "i" };
    } else if (searchBy === "content") {
      query.content = { $regex: keyword, $options: "i" };
    }
  }

  try {
    // 페이지네이션을 위한 skip과 limit 설정
    const skip = (page - 1) * pageSize;
    const curations = await Curation.find(query)
      .skip(skip) // skip의 숫자 만큼 데이터 건너뜀(ex: skip이 5일 경우 다음 데이터는 6번부터 보여줌)
      .limit(Number(pageSize)); // limit은 페이지당 보여줄 데이터 수

    // 조건에 맞는 데이터 총 개수
    const totalCurations = await Curation.countDocuments(query);

    res.status(200).json({
      success: true,
      data: curations,
      pagination: {
        currentPage: page,
        pageSize: Number(pageSize),
        totalItems: totalCurations,
        totalPages: Math.ceil(totalCurations / pageSize), // 총 페이지 수 계산
      },
    });
  } catch (error) {
    console.error("큐레이션 조회 에러:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 큐레이션 등록
const createCuration = async (req, res) => {
  // 요청 본문에서 필요한 데이터 추출
  const {
    content,
    nickname,
    passwd,
    trendy,
    personality,
    practicality,
    costEffectiveness,
  } = req.body;

  try {
    // MongoDB에 새로운 큐레이션 생성
    const curation = await Curation.create({
      content,
      nickname,
      passwd,
      trendy,
      personality,
      practicality,
      costEffectiveness,
    });

    // 생성된 큐레이션 데이터를 응답으로 반환
    res.status(201).json({
      success: true,
      data: {
        id: curation._id,
        content: curation.content,
        nickname: curation.nickname,
        trendy: curation.trendy,
        personality: curation.personality,
        practicality: curation.practicality,
        costEffectiveness: curation.costEffectiveness,
        createdAt: curation.createdAt,
      },
    });
  } catch (error) {
    console.error("큐레이션 생성 에러:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 큐레이션 수정
const updateCuration = async (req, res) => {
  const { id } = req.params;
  //새로 작성하는 데이터
  const {
    content,
    nickname,
    passwd,
    trendy,
    personality,
    practicality,
    costEffectiveness,
  } = req.body;

  try {
    // ID로 해당 큐레이션을 찾음
    const curation = await Curation.findById(id);

    // 큐레이션이 존재하지 않는 경우
    if (!curation) {
      return res.status(404).json({
        success: false,
        message: "큐레이션을 찾을 수 없습니다.", // 404 Not Found 응답
      });
    }

    // 입력한 비밀번호와 수정할때 입력 받는 비밀번호를 비교
    if (curation.passwd !== passwd) {
      return res.status(401).json({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    // 큐레이션 정보 수정 (입력값이 없으면 기존 값을 유지)
    curation.content = content || curation.content;
    curation.nickname = nickname || curation.nickname;
    curation.trendy = trendy || curation.trendy;
    curation.personality = personality || curation.personality;
    curation.practicality = practicality || curation.practicality;
    curation.costEffectiveness =
      costEffectiveness || curation.costEffectiveness;

    await curation.save(); // 변경된 데이터 저장

    // 수정된 큐레이션 정보를 클라이언트에게 응답
    res.status(200).json({
      success: true,
      data: {
        id: curation._id,
        content: curation.content,
        nickname: curation.nickname,
        trendy: curation.trendy,
        personality: curation.personality,
        practicality: curation.practicality,
        costEffectiveness: curation.costEffectiveness,
        createdAt: curation.createdAt,
      },
    });
  } catch (error) {
    console.error("큐레이션 수정 에러:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 큐레이션 삭제
const deleteCuration = async (req, res) => {
  const { id } = req.params; // URL로 받은 id를 사용

  try {
    const curation = await Curation.findById(id);

    if (!curation) {
      return res.status(404).json({
        success: false,
        message: "큐레이션을 찾을 수 없습니다.",
      });
    }

    await curation.deleteOne(); // 큐레이션 삭제

    res.status(200).json({
      success: true,
      message: "큐레이션이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("큐레이션 삭제 에러:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { getCurations, createCuration, updateCuration, deleteCuration };
