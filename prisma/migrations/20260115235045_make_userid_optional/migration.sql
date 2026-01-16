-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Request_userId_idx" ON "Request"("userId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
