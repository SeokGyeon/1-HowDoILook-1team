import { PrismaClient } from "@prisma/client";
import { STYLE } from "./mockData.js"; // mockData 파일에서 스타일 데이터 임포트

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.style.deleteMany();

  // 목 데이터
  await prisma.style.createMany({
    data: STYLE,
    skipDuplicates: true, // 중복되는 데이터는 건너뛰기
  });

  console.log("스타일 데이터 시딩 완료!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
