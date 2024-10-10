export type ObjectType = "fish" | "bomb" | "snow";
export type ObjectStatus = "falling" | "stopped";

export type Level = "easy" | "medium" | "hard";

export interface ObjectProps {
    left: number;
    status: ObjectStatus;
    fallTime: number;
    callback?() : void;
}

export interface ObjectInfo extends ObjectProps {
    id: number;
    type: ObjectType;
}