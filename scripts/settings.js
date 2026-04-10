import { moduleId } from "./consts.js";

export const setting_id_struct = "rework_struct";
export const setting_id_stress = "rework_stress";
export const setting_id_auto_overheat = "auto_overheat";
export const setting_id_recharge_heat = "recharge_heat";
export const setting_id_split_damage = "split_damage";

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
        game.settings.register(moduleId, setting_id_auto_overheat, {
            name: `${moduleId}.settings.auto_overheat.name`,
            hint: `${moduleId}.settings.auto_overheat.hint`,
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
        game.settings.register(moduleId, setting_id_split_damage, {
            name: `${moduleId}.settings.split_damage.name`,
            hint: `${moduleId}.settings.split_damage.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            requiresReload: true,
            default: true
        });
        console.log("ppgSetup | settings imported")
    } catch {
        console.log("ppgSetup | Error when initializing PPG settings")
    }
}