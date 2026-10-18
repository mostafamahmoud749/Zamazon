-- Nullable for orders created before checkout idempotency was introduced.
ALTER TABLE "Order" ADD COLUMN "idempotencyKey" VARCHAR(128);

CREATE UNIQUE INDEX "Order_userId_idempotencyKey_key"
ON "Order"("userId", "idempotencyKey");
