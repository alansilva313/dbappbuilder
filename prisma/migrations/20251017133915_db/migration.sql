-- CreateTable
CREATE TABLE `fibras` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modelo_imagens` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Acompanhamentos` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `data_inicio` DATE NOT NULL,
    `hora_inicio` TIME NOT NULL,
    `coordenada_inicial` JSON NOT NULL,
    `protocolo` VARCHAR(191) NULL,
    `tipo_fibra_id` VARCHAR(191) NOT NULL,
    `metragem_inicial` VARCHAR(191) NOT NULL,
    `coordenada_final` JSON NULL,
    `data_fim` DATE NULL,
    `hora_fim` TIME NULL,
    `metragem_final` VARCHAR(191) NULL,
    `equipe` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acompanhamento_etapas` (
    `id` VARCHAR(191) NOT NULL,
    `id_acompanhamento` VARCHAR(191) NOT NULL,
    `kit_bap` BOOLEAN NOT NULL,
    `alca` BOOLEAN NOT NULL,
    `placa_way` BOOLEAN NOT NULL,
    `aspiral` BOOLEAN NOT NULL,
    `espinagem` BOOLEAN NOT NULL,
    `elegivel_sobra` BOOLEAN NOT NULL,
    `sobra_padrao` BOOLEAN NOT NULL,
    `coordenada` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AcompanhamentoFotos` (
    `id` VARCHAR(191) NOT NULL,
    `id_acompanhamento` VARCHAR(191) NOT NULL,
    `modelo_foto_id` VARCHAR(191) NOT NULL,
    `imagem` JSON NOT NULL,
    `tipo_foto` ENUM('inicial', 'andamento', 'final') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Acompanhamentos` ADD CONSTRAINT `Acompanhamentos_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acompanhamentos` ADD CONSTRAINT `Acompanhamentos_tipo_fibra_id_fkey` FOREIGN KEY (`tipo_fibra_id`) REFERENCES `fibras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acompanhamento_etapas` ADD CONSTRAINT `acompanhamento_etapas_id_acompanhamento_fkey` FOREIGN KEY (`id_acompanhamento`) REFERENCES `Acompanhamentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AcompanhamentoFotos` ADD CONSTRAINT `AcompanhamentoFotos_modelo_foto_id_fkey` FOREIGN KEY (`modelo_foto_id`) REFERENCES `modelo_imagens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AcompanhamentoFotos` ADD CONSTRAINT `AcompanhamentoFotos_id_acompanhamento_fkey` FOREIGN KEY (`id_acompanhamento`) REFERENCES `Acompanhamentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
