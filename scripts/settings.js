import { moduleId } from "./consts.js";

export const setting_id_struct = "rework_struct";
export const setting_id_stress = "rework_stress";
export const setting_id_recharge_heat = "recharge_heat"

export function bindSettings() {
    try {
        game.settings.register(moduleId, setting_id_struct, {
            name: `${moduleId}.settings.structure.name`,
            hint: `${moduleId}.settings.structure.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            requiresReload: true,
            default: true
        });
        game.settings.register(moduleId, setting_id_stress, {
            name: `${moduleId}.settings.stress.name`,
            hint: `${moduleId}.settings.stress.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            requiresReload: true,
            default: true
        });
        game.settings.register(moduleId, setting_id_recharge_heat, {
            name: `${moduleId}.settings.recharge_heat.name`,
            hint: `${moduleId}.settings.recharge_heat.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            requiresReload: true,
            default: true
        });
        console.log("PPG settings imported")
    } catch {
        console.log("Error when initializing PPG settings")
    }
}