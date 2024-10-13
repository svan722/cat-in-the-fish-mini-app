export const getCountByBoostId = (boosts:any[], boostid:string) => {
    const boost = boosts.find(b => b.item.boostid === boostid);
    return boost ? boost.usesRemaining : null; // Return null if not found
};
