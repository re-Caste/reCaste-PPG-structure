// One Stress for All dictates that we ignore usual stress table rolling in exchange for guaranteed status application and irreducable energy damage
export async function overheatRework(state) {
    try {
        if (!state.data) throw new TypeError(`Overheat roll flow data missing!`);
        const actor = state.actor;
        if (!actor.is_mech() && !actor.is_npc()) {
            ui.notifications.warn("Only npcs and mechs can roll overheat.");
            return false;
        }

        const token = canvas.scene.tokens.find(i=>i.actor._id === actor._id); // Grab token for targeting later
        const excess = actor.system.heat.value - actor.system.heat.max; // Get overflowed heat
        console.log("Excess heat: "+excess);

        await actor.toggleStatusEffect("exposed", {active:true});
        await actor.toggleStatusEffect("overheated", {active:true});
        console.log("Statuses applied");

        const dmgConfig = {
            hit_results: [{
                target: token,
                usedLockOn: false,
                total: "20",
                hit: true,
                crit: false,
            }],
            title: "Overheat",
            damage: [{type:"Energy", val:excess.toString()}],
            paracausal: true,
        };
        const dmgFlow = new(game.lancer.flows.get("DamageRollFlow"))(actor, dmgConfig); // Call damage
        await dmgFlow.begin();
        await actor.update({"system.heat.value":actor.system.heat.max}); // Set the token back to their heat cap

        return true;
    } catch {
        return false;
    }    
};