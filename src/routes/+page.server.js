import { weaponData } from "$lib/data/weapons";

export function load() {
    return {
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
        }))
    }
}