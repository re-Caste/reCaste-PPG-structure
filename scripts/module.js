import { moduleId } from "./consts.js";
import { bindSettings, setting_id_struct, setting_id_stress, setting_id_recharge_heat  } from "./settings.js";
import { handleHeat, rechargeHeat } from "./damage.js";
import { overheatRework } from "./stress.js";
import { structureRework, structureInsertTraumaRework } from "./structure.js";

Hooks.once("init", () => {
    bindSettings();
})

// Flows //
Hooks.once("lancer.registerFlows", (flowSteps, flows) => {
    // Settings are registered AFTER lancer initialises, so we have to look at the world's database for these values
    const enableStruct = game.settings.storage.get("world").getSetting(`${moduleId}.${setting_id_struct}`)?.value ?? true;
    const enableStress = game.settings.storage.get("world").getSetting(`${moduleId}.${setting_id_stress}`)?.value ?? true;
    const enableRchgHeat = game.settings.storage.get("world").getSetting(`${moduleId}.${setting_id_recharge_heat}`)?.value ?? true;

    //Structure - Is this messy as all hell? Yeah. Does it work? Yeah.
    if (enableStruct === true) {
        const strucFlow = flows.get("StructureFlow");
        flowSteps.set(`${moduleId}:structureRework`, structureRework);
        strucFlow?.insertStepBefore("rollStructureTable", `${moduleId}:structureRework`);
        strucFlow?.insertStepBefore("rollStructureTable", "noStructureRemaining");
        flowSteps.set(`${moduleId}:insertTraumaButton`, structureInsertTraumaRework)
        strucFlow?.insertStepBefore("rollStructureTable", `${moduleId}:insertTraumaButton`);
        strucFlow?.insertStepBefore("rollStructureTable", "structureInsertCascadeRollButton");
        strucFlow?.insertStepBefore("rollStructureTable", "printStructureCard");
        strucFlow?.insertStepBefore("rollStructureTable", "secondaryStructureRoll");
        strucFlow?.insertStepBefore("rollStructureTable", "printSecondaryStructureCard");
        flowSteps.set("stopFlow", stopFlow);
        strucFlow?.insertStepBefore("rollStructureTable", "stopFlow");
    };

    //Stress
    if (enableStress === true) {
        const stressFlow = flows.get("OverheatFlow");
        flowSteps.set(`${moduleId}:overheatRework`, overheatRework)
        stressFlow?.insertStepBefore("preOverheatRollChecks", `${moduleId}:overheatRework`);
        stressFlow?.insertStepBefore("preOverheatRollChecks", "stopFlow");
    };

    //Recharge Heat
    if (enableRchgHeat === true) {
        const activFlow = flows.get("ActivationFlow");
        const sysFlow = flows.get("SystemFlow");
        const techFlow = flows.get("TechAttackFlow");
        flowSteps.set(`${moduleId}:rechargeHeat`, rechargeHeat);
        activFlow?.insertStepBefore("updateItemAfterAction", `${moduleId}:rechargeHeat`);
        sysFlow?.insertStepBefore("updateItemAfterAction", `${moduleId}:rechargeHeat`);
        techFlow?.insertStepBefore("updateItemAfterAction", `${moduleId}:rechargeHeat`);
    }

    //Damage
    const damageFlow = flows.get("DamageRollFlow");
    flowSteps.set(`${moduleId}:handleHeat`, handleHeat);
    damageFlow?.insertStepBefore("printDamageCard", `${moduleId}:handleHeat`);
})

// Helpers //
// Convert lang to readable format
export async function translate(key) {
    return game.i18n.localize(`${moduleId}.${key}`)
};

export async function stopFlow() {
    console.log("Reworked flow complete!")
    return false;
}