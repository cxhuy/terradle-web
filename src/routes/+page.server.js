import { gameVersion, weaponData } from "$lib/data/weapons"; 
import { APIPATH } from "$env/static/private"

export async function load() {
    const res = await fetch(APIPATH + "getInitialData.php?token=new");
    const initialData = await res.json();

    return {
        gameVersion: gameVersion,
        weapons: weaponData.map((weapon) => ({
            id: weapon.data.id,
            name: weapon.data.name,
            autoswing: weapon.data.autoswing,
            damage: weapon.data.damage,
            damageType: weapon.data.damageType,
            knockback: weapon.data.knockback,
            speed: weapon.data.speed,
            tooltip: weapon.data.tooltip,
            rarity: weapon.data.rarity,
            sell: weapon.data.sell,
            obtained: weapon.data.obtained,
            material: weapon.data.material
        })), 
        initialData
    }
}