// One Stress for All dictates that we ignore usual stress table rolling in exchange for guaranteed status application and irreducable energy damage
export async function overheatRework(state) {
    try {
        if (!state.data) throw new TypeError(`Overheat roll flow data missing!`);
        const actor = state.actor;
        if (!actor.is_mech() && !actor.is_npc()) {
            ui.notifications.warn("Only npcs and mechs can roll overheat.");
            return false;
        }

        const token = canvas.tokens.placeables.filter(i=>i.actor.system.heat.value > i.actor.system.heat.max).find(i=>i.actor._id === actor._id); // Grab token for targeting later
        const excess = actor.system.heat.value - actor.system.heat.max; // Get overflowed heat
        console.log("ppgDebug | Excess heat: "+excess);

        if (actor.system.heat.max !== 0) {
            await actor.toggleStatusEffect("exposed", {active:true});
            console.log("ppgDebug | Exposed applied");
        } else {
            console.log("ppgDebug | No heat cap, skipping exposed/overheated")
        };

        await token.setTarget(true, { releaseOthers: true });
        const dmgConfig = {
            hit_results: [{
                target: token,
                usedLockOn: false,
                total: "20",
                hit: true,
                crit: false,
            }],
            title: "Overheat DAMAGE",
            damage: [{type:"Energy", val:excess.toString()}],
            paracausal: true,
        };
        const dmgFlow = new(game.lancer.flows.get("DamageRollFlow"))(actor, dmgConfig); // Call damage
        await dmgFlow.begin();
        await token.setTarget(false, { releaseOthers: true });
        await actor.update({"system.heat.value":actor.system.heat.max}); // Set the token back to their heat cap

        return true;
    } catch {
        return false;
    }    
};

export async function applyOverheat(state) {
    // Sloppy solution to Danger Zone FX from LancerQoL not activating sometimes, should be essentially unnoticable
    const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await wait(10);
    try {
        if (["", "lancer.tables.overheat.title.destabilized"].includes(state.data.title)) {
            await state.actor.toggleStatusEffect("overheated", {active:true})
        }

        return true
    } catch {
        return false
    }
}

export async function clearOverheat(state) {
    try {
        console.log(state)
        if (state.data.option1==="Cool") {
            await state.actor.toggleStatusEffect("overheated", {active:false})
        }

        return true
    } catch {
        return false
    }
}