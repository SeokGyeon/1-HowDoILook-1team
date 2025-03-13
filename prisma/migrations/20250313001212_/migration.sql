-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "price" DOUBLE PRECISION,
    "styleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Style" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT[],
    "thumbnail" TEXT NOT NULL,
    "tags" TEXT[],
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "curationCount" INTEGER NOT NULL DEFAULT 0,
    "trendy" INTEGER NOT NULL DEFAULT 0,
    "personality" INTEGER NOT NULL DEFAULT 0,
    "practicality" INTEGER NOT NULL DEFAULT 0,
    "costEffectiveness" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Style_title_description_tags_idx" ON "Style"("title", "description", "tags");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
