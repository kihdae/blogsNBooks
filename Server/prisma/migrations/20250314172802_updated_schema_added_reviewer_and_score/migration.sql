/*
  Warnings:

  - You are about to drop the `ThoughtBubble` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ThoughtBubble" DROP CONSTRAINT "ThoughtBubble_blogPostId_fkey";

-- DropForeignKey
ALTER TABLE "ThoughtBubble" DROP CONSTRAINT "ThoughtBubble_bookId_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reviewer" TEXT,
ADD COLUMN     "score" INTEGER;

-- DropTable
DROP TABLE "ThoughtBubble";

-- CreateTable
CREATE TABLE "BookThoughtBubble" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookThoughtBubble_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPostThoughtBubble" (
    "id" SERIAL NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPostThoughtBubble_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookThoughtBubble_bookId_idx" ON "BookThoughtBubble"("bookId");

-- CreateIndex
CREATE INDEX "BlogPostThoughtBubble_blogPostId_idx" ON "BlogPostThoughtBubble"("blogPostId");

-- AddForeignKey
ALTER TABLE "BookThoughtBubble" ADD CONSTRAINT "BookThoughtBubble_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostThoughtBubble" ADD CONSTRAINT "BlogPostThoughtBubble_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
