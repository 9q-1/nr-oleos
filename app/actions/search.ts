"use server";

import { pesquisaGlobal } from "@/lib/data/search";

export async function buscarGlobalAction(termo: string) {
  return pesquisaGlobal(termo);
}
