// utils/codeStore.ts
export interface CodeData {
  code: string;
  expiresAt: number;
}

// Usamos el objeto global para persistir el Map en el proceso Node.
const globalAny = global as { codeStore?: Map<string, CodeData> };
if (!globalAny.codeStore) {
  globalAny.codeStore = new Map<string, CodeData>();
}
export const codes = globalAny.codeStore as Map<string, CodeData>;
