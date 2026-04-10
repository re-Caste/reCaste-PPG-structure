import { moduleId } from "./consts.js";
import { bindSettings, setting_id_struct, setting_id_stress, setting_id_auto_overheat, setting_id_recharge_heat, setting_id_split_damage  } from "./settings.js";
import { rechargeHeat, createHeatCard, reassignPhysical } from "./damage.js";
import { addStatuses } from "./statuses.js";
import { overheatRework, clearOverheat, applyOverheat } from "./stress.js";
import { structureRework, structureInsertTraumaRework } from "./structure.js";

Hooks.once("init", () => {
    bindSettings();
})

Hooks.on("lancer.statusesReady", addStatuses)

// Flows //
Hooks.once("lancer.registerFlows", (flowSteps, flows) => {
    // Settings are registered AFTER lancer initialises, so we have to look at the world's database for these values
    const enableStruct = game.settings.storage.get("world").getSetting(`${moduleId}.${setting_id_struct}`)?.value ?? true;
    const enableStress = game.settings.storage.get("world").getSetting(`${moduleId}.${setting_id_stress}`)?.value ?? true;
    const enableOverheat = game.settings.storage.get("world").getSetting(`${moduleId}.${setting_id_auto_overheat}`)?.value ?? true;
    const enableRchgHeat = game.settings.storage.get("world").getSetting(`${moduleId}.${setting_id_recharge_heat}`)?.value ?? true;
    const enableSpltDmg = game.settings.storage.get("world").getSetting(`${moduleId}.${setting_id_split_damage}`)?.value ?? true;

    // Set flow consts
    const strucFlow = flows.get("StructureFlow");
    const stressFlow = flows.get("OverheatFlow");
    const activFlow = flows.get("ActivationFlow");
    const sysFlow = flows.get("SystemFlow");
    const techFlow = flows.get("TechAttackFlow");
    const damageFlow = flows.get("DamageRollFlow");
    const stabFlow = flows.get("StabilizeFlow");

    //Structure - Is this messy as all hell? Yeah. Does it work? Yeah.
    if (enableStruct) {
        console.log("ppgSetup | inserting Structure steps");
        try {
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
            console.log("ppgSetup | Structure setup completed!");
        } catch {
            console.log("ppgSetup | Structure setup failed!");
        };
    };
    
//Stabilize
    if (enableOverheat) {
        console.log("ppgSetup | inserting Overheat Steps");
        try {
            flowSteps.set(`${moduleId}:clearOverheat`, clearOverheat)
            stabFlow?.insertStepBefore('printStabilizeResult', `${moduleId}:clearOverheat`)
            console.log("ppgSetup| Overheat setup completed!");
        } catch {
            console.log("ppgSetup| Overheat setup failed!");
        };
    };

    //Stress
    if (enableStress) {
        console.log("ppgSetup | inserting Stress steps");
        try {
            if (enableOverheat) {
                flowSteps.set(`${moduleId}:applyOverheat`, applyOverheat)
                stressFlow?.insertStepBefore("preOverheatRollChecks", `${moduleId}:applyOverheat`);
            }
            flowSteps.set(`${moduleId}:overheatRework`, overheatRework)
            stressFlow?.insertStepBefore("preOverheatRollChecks", `${moduleId}:overheatRework`);
            stressFlow?.insertStepBefore("preOverheatRollChecks", "stopFlow");
            console.log("ppgSetup | Stress setup completed!");
        } catch {
            console.log("ppgSetup | Stress setup failed!");
        };
    } else {
        try {
            if (enableOverheat) {
                flowSteps.set(`${moduleId}:applyOverheat`, applyOverheat)
                stressFlow?.insertStepBefore("printOverheatCard", `${moduleId}:applyOverheat`);
            }
        } catch {
            
        }
    };

    //Recharge Heat
    if (enableRchgHeat) {
        console.log("ppgSetup | inserting Recharge Heat steps");
        try {
            flowSteps.set(`${moduleId}:rechargeHeat`, rechargeHeat);
            activFlow?.insertStepBefore("updateItemAfterAction", `${moduleId}:rechargeHeat`);
            sysFlow?.insertStepBefore("updateItemAfterAction", `${moduleId}:rechargeHeat`);
            techFlow?.insertStepBefore("updateItemAfterAction", `${moduleId}:rechargeHeat`);
            console.log("ppgSetup | Recharge Heat setup completed!");
        } catch {
            console.log("ppgSetup | Recharge Heat setup failed!");
        };
    };

    //Damage
    if (enableSpltDmg) {
        console.log("ppgSetup | inserting Split Damage steps");
        try {
            flowSteps.set(`${moduleId}:createHeatCard`, createHeatCard);
            damageFlow?.insertStepBefore("printDamageCard", `${moduleId}:createHeatCard`);
            flowSteps.set(`${moduleId}:reassignPhys`, reassignPhysical);
            damageFlow?.insertStepAfter("printDamageCard", `${moduleId}:reassignPhys`);
            damageFlow?.insertStepAfter(`${moduleId}:reassignPhys`, "printDamageCard");
            console.log("ppgSetup | Split Damage setup completed!");
        } catch {
            console.log("ppgSetup | Split Damage setup failed!")
        };
    };
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