//We use this to pseudo-apply heat from an attack first, allowing weapons that do both physical damage *and* heat to benefit from exposed
export async function handleHeat(state) {
    try {
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

export async function rechargeHeat(state) {
    try {
        var heat = 0;
        switch(Number(state.data.tags?.find(i=>i.name==="Recharge {VAL}+").val)) {
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
        await state.actor.update({"system.heat.value":state.actor.system.heat.value+heat})

        return true
    } catch  {
        return false
    }
}