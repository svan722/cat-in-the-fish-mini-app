export type ObjectType = "fish" | "bomb" | "snow";
export type ObjectStatus = "falling" | "stopped";

export interface ObjectProps {
    left: number;
    status: ObjectStatus;
    callback?() : void;
}

export interface ObjectInfo extends ObjectProps {
    id: number;
    type: ObjectType;
}