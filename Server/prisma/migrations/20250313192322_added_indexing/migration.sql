-- CreateIndex
CREATE INDEX "Author_name_idx" ON "Author"("name");

-- CreateIndex
CREATE INDEX "BlogPost_title_idx" ON "BlogPost"("title");

-- CreateIndex
CREATE INDEX "BlogPost_bookId_idx" ON "BlogPost"("bookId");

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- CreateIndex
CREATE INDEX "Book_authorId_idx" ON "Book"("authorId");

-- CreateIndex
CREATE INDEX "Book_coverImageUrl_idx" ON "Book"("coverImageUrl");

-- CreateIndex
CREATE INDEX "Quote_bookId_idx" ON "Quote"("bookId");

-- CreateIndex
CREATE INDEX "Review_bookId_idx" ON "Review"("bookId");

-- CreateIndex
CREATE INDEX "ThoughtBubble_bookId_idx" ON "ThoughtBubble"("bookId");

-- CreateIndex
CREATE INDEX "ThoughtBubble_blogPostId_idx" ON "ThoughtBubble"("blogPostId");
