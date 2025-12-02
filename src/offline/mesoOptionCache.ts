import { db } from "./db";
import type { MesoOption } from "./db";
import { MACRO_MESO_MAP } from "./meso-config";

export async function seedMesoCacheIfEmpty() {
    const count = await db.mesoOptions.count();
    if (count > 0) return;

    const now = new Date().toISOString();
    const rows: MesoOption[] = [];

    Object.entries(MACRO_MESO_MAP).forEach(([macro, options]) => {
        options.forEach((opt) => {
            rows.push({
                macro,
                code: opt.code,
                label: opt.label ?? opt.code,
                updatedAt: now,
            });
        });
    });

    if (rows.length > 0) {
        await db.mesoOptions.bulkAdd(rows);
    }
}

export async function getMesoOptionsForMacro(macro: string): Promise<MesoOption[]> {
    if (!macro) return [];
    return db.mesoOptions.where('macro').equals(macro).toArray();
}