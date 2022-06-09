//INSPECT OBJECT PROTOTYPE CHAIN ©️ Gondwana

// INSPECT PROTOTYPE CHAIN ©️ Gondwana
export async function dumpProperties(name, obj, types) {  // This isn't needed; it's just to show how everything links together
    // Lists all accessible properties defined in obj and all of its prototypes.
    // async because function awaits between prototype levels, and therefore shouldn't be called multiple times in quick succession.
    // Call using await (may need to do so from within an async function).
    // name: string to display in output heading.
    // obj: object for which properties are to be displayed.
    // types: boolean: try to determine type of each property (can cause hard crashes with some objects).

    function sleep(n) { return new Promise(resolve => setTimeout(resolve, n)); }

    let proto = obj
    let level = 0
    let type = '?'
    console.log(`Members of ${name}:`)
    do {
        console.log(`  Level ${level++}:`)
        for (const memberName in proto) {
            //if (memberName === 'textContent') continue;
            if (proto.hasOwnProperty(memberName)) {
                // memberName 'text' crashes sim
                if (types)
                    try {
                        const member = obj[ memberName ]  // get member from top-level obj rather than proto, as the latter crashes if not a function
                        type = typeof member
                    } catch (e) {
                        //console.log('in catch')
                        type = 'INACCESSIBLE'
                    }
                console.log(`    ${memberName} (${type})`)
            }
        }
        proto = Object.getPrototypeOf(proto)
        console.log('    ---------------')
        await sleep(1000)   // ...because debug bridge silently drops lines if it gets flooded
    } while (proto)
    console.log('  Done!')
}

export function findX(obj) {
    let proto = obj
    let level = 0
    do {
        for (const memberName in proto) {
            if (proto.hasOwnProperty('x')) return proto;
        }
        proto = Object.getPrototypeOf(proto)
    } while (proto)
}

//call like: dumpProperties('obj', obj, boolean)

//INSPECT key:value
export const inspectObject = (objName, obj) => {

    let keys = Object.keys(obj);//only for now
    console.log(' ')
    console.warn(`START inspect ${objName}`)
    // console.log(`Keys: ${keys}`);////test.light keys: style,x,y 
    console.log('----------------------')
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {

            console.log(`${prop}: ${JSON.stringify(obj[ prop ])}`)
        };

    };
    console.warn(`END inspect ${objName}`)
    console.log(' ')
};
//call like: inspectObject('objName',obj)
//TODO How to get to the properties of properties by inspecting the main object/element???
