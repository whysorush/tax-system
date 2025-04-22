-- CreateTable
CREATE TABLE "spvs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity_tax_id" TEXT NOT NULL,
    "tax_year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "spv_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_forms" (
    "id" TEXT NOT NULL,
    "form_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "download_url" TEXT,
    "spv_id" TEXT,
    "investor_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_forms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_spv_id_fkey" FOREIGN KEY ("spv_id") REFERENCES "spvs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_forms" ADD CONSTRAINT "tax_forms_spv_id_fkey" FOREIGN KEY ("spv_id") REFERENCES "spvs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_forms" ADD CONSTRAINT "tax_forms_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
