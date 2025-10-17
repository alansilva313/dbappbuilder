// src/utils/dataLocal.ts

/**
 * Retorna a data/hora atual ajustada para o fuso horário de São Paulo (UTC-3)
 */
export function getDataLocal(): Date {
  const agora = new Date();
  const offset = 3 * 60 * 60 * 1000; // 3 horas em milissegundos
  return new Date(agora.getTime() - offset);
}
