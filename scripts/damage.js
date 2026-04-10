//We use this to pseudo-apply heat from an attack first, allowing weapons that do both physical damage *and* heat to benefit from exposed
export async function handleHeat(state) {
    //--------------------------------------------------------------- ↓ DEFUNCT ↓ ---------------------------------------------------------------
    try {
        console.log(state)
        const targetResults = state.data.targets.map(t => ({
            ...t,
            target: t.target.document.uuid,
        }));
        console.log(targetResults)
        targetResults.forEach(async i => {
            let token = await fromUuid(i.target);
            let tokenHeat = token.actor.system.heat;
            let heatDamage = i.damage.filter(d => d.type==="Heat");
            let heatVal = heatDamage.length!==0 ? heatDamage.map(d => d.amount).reduce((a,b) => a+b) : 0;
            if (tokenHeat.max !== 0 && tokenHeat.value+heatVal > tokenHeat.max) {
                console.log("Pre-exposing actor...")
                await token.actor.toggleStatusEffect("exposed", {active:true});
            };
        });

        return true
    } catch {
        return false
    }
};
    // --------------------------------------------------------------- ↑ DEFUNCT ↑ ---------------------------------------------------------------

export async function rechargeHeat(state) {
    if (state.data.tags?.find(i=>i.name==="Heat {VAL} (Self)")) {
        console.log("ppgDebug | Item already has Self Heat -> Skipping Recharge Heat")
        return true // Skip if already paying heat tax
    }
    try {
        var heat;
        switch(Number(state.data.tags?.find(i=>i.name==="Recharge {VAL}+")?.val ?? 0)) {
            case 4:
                heat = 1;
                break;
            case 5:
                heat = 1;
                break;
            case 6:
                heat = 2;
                break;
            default:
                heat = 0
        };
        await state.actor.update({"system.heat.value":state.actor.system.heat.value+heat});

        return true;
    } catch  {
        return false;
    }
}

export async function createHeatCard(state) {
    try {
        //console.log(state.data.damage_results)
        if (state.data.damage_results?.map(i=>i.d_type).includes("Heat")) {
            console.log("ppgDebug | Heat found in damage aggregate -> separating...");

            state.data.title=state.data.title.slice(0,-6)+"HEAT";

            state.data.physical = state.data.damage_results.filter(i=>i.d_type!=="Heat");
            state.data.damage_results = state.data.damage_results.filter(i=>i.d_type==="Heat");

            state.data.targets.forEach(async i => {
                i.physical = i.damage.filter(j=>j.type!=="Heat")
                i.damage = i.damage.filter(j=>j.type==="Heat")
            });
        };

        //console.log(state.data);
        return true;
    } catch {
        return false;
    };
}

export async function reassignPhysical(state) {
    try {
        if (state.data.physical.length>0) {
            console.log("ppgDebug | Populating Physical card...");

            state.data.title=state.data.title.slice(0,-4)+"DAMAGE";

            state.data.damage_results = state.data.physical
            state.data.targets.forEach(async i => {
                if (i.physical) {
                    i.damage = i.physical
                }
            });
            return true;
        };

        return false;
    } catch {
        return false;
    };
}