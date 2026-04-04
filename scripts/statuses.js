export async function addStatuses() {
    let statuses = [...CONFIG.statusEffects]
    ppgStatusEffects.forEach(ppgEffect => {
        console.log("ppgSetup | Looking for "+ppgEffect.name);
        if (!statuses.find(i=>i.id===ppgEffect.id)) {
            console.log("ppgSetup | "+ppgEffect.name+" not found, creating...");
            statuses.push(ppgEffect);
        }
        else {
            console.log("ppgSetup | "+ppgEffect.name+" found!")
        };
    });
    CONFIG.statusEffects = statuses
};

const ppgStatusEffects = [
    {
        id: "overheated",
        name: "Overheated",
        img: "systems/lancer/assets/icons/white/eclipse.svg"
    },
    {
        id: "dazed",
        name: "Dazed",
        img: "icons/svg/daze.svg"
    }
];