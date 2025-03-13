-- CreateTable
CREATE TABLE "StyleImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "styleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StyleImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StyleImage_styleId_idx" ON "StyleImage"("styleId");

-- AddForeignKey
ALTER TABLE "StyleImage" ADD CONSTRAINT "StyleImage_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
