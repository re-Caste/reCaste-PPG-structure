import { moduleId } from "./consts.js";

export async function structureRework(state) { // Display card alongside two buttons for selection between the two options that Valk's Structure uses
    try {
        if (!state.data) throw new TypeError(`Structure roll flow data missing!`);
        const actor = state.actor;
        if (!actor.is_mech() && !actor.is_npc()) {
            ui.notifications.warn("Only npcs and mechs can roll structure.");
            return false;
        };

        if ((state.data?.reroll_data?.structure ?? actor.system.structure.value) >= actor.system.structure.max) {
            ui.notifications.info("The mech is at full Structure, no structure check to roll.");
            return false;
        };

        state.data = {
            title: `${moduleId}.structure.title`,
            desc: `${moduleId}.structure.description`,
            remStruct: actor.system.structure.value,
            val: actor.system.structure.value,
            max: actor.system.structure.max,
        };
        console.log("State data applied")
        console.log(state)

        let hp = actor.system.hp;
        let structure = actor.system.structure;
        if (hp.value < 1 && structure.value > 0) {
            await actor.update({
                "system.structure": structure.value - 1,
                "system.hp": hp.value + hp.max,
            });
        };

        return true;
    } catch {
        return false;
    }
};

export async function structureInsertTraumaRework(
    state) {
    if (!state.data || !state.data) throw new TypeError(`Structure roll flow data missing!`);
    let actor = state.actor;
    if (!actor.is_mech() && !actor.is_npc()) {
        ui.notifications.warn("Only npcs and mechs can roll structure.");   
        return false;
    }
    // TODO: we'll want helper functions to generate embeddable flow buttons
    state.data.embedButtons = state.data.embedButtons || [];
    state.data.embedButtons.push(`<a
        class="flow-button lancer-button"
        data-flow-type="secondaryStructure"
        data-actor-id="${actor.uuid}"
    >
        <i class="fas fa-dice-d6 i--sm"></i> TEAR OFF
    </a>`);
  return true;
}