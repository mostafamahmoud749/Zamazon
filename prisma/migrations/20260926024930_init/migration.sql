-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubUser" (
    "githubID" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,

    CONSTRAINT "GithubUser_pkey" PRIMARY KEY ("githubID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GithubUser_userName_key" ON "GithubUser"("userName");
