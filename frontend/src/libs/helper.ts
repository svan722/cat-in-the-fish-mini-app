export const getCountByBoostId = (boosts:any[], boostid:string) => {
    const boost = boosts.find(b => b.item.boostid === boostid);
    return boost ? boost.usesRemaining : 0; // Return null if not found
};
