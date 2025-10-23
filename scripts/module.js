import { moduleId } from "./consts.js";
import { overheatRework } from "./stress.js";
import { structureRework, structureInsertTraumaRework } from "./structure.js";

// Flows //
Hooks.once("lancer.registerFlows", (flowSteps, flows) => {
    //Structure - Is this messy as all hell? Yeah. Does it work? Yeah.
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

    //Stress
    const stressFlow = flows.get("OverheatFlow");
    flowSteps.set(`${moduleId}:overheatRework`, overheatRework)
    stressFlow?.insertStepBefore("preOverheatRollChecks", `${moduleId}:overheatRework`);
    stressFlow?.insertStepBefore("preOverheatRollChecks", "stopFlow");
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