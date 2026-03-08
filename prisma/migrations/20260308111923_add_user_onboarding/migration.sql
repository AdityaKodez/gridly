-- CreateTable
CREATE TABLE "user_onboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completedStepIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dismissedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_onboarding_userId_key" ON "user_onboarding"("userId");

-- AddForeignKey
ALTER TABLE "user_onboarding" ADD CONSTRAINT "user_onboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
