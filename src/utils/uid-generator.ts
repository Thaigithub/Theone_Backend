import * as base58 from 'bs58';

export class UID {
    private localID: number;
    private objectType: number;
    private shardID: number;

    constructor(localID: number, objectType: number, shardID: number) {
        this.localID = localID;
        this.objectType = objectType;
        this.shardID = shardID;
    }

    toString(): string {
        const val =
            (BigInt(this.localID) << BigInt(28)) | (BigInt(this.objectType) << BigInt(18)) | (BigInt(this.shardID) << BigInt(0));

        const buffer = Buffer.alloc(8);
        buffer.writeBigUInt64LE(val);

        return base58.encode(buffer);
    }

    getLocalID(): number {
        return this.localID;
    }

    getObjectType(): number {
        return this.objectType;
    }

    getShardID(): number {
        return this.shardID;
    }

    static decomposeUID(s: string): UID | null {
        try {
            const decodedBuffer = base58.decode(s);
            // Parse the BigInt from the decodedBuffer
            const uidValue = new DataView(decodedBuffer.buffer).getBigUint64(0, true);

            if (uidValue < 1n << 18n) {
                return null; // Wrong UID
            }

            const localID = Number(uidValue >> 28n);
            const objectType = Number((uidValue >> 18n) & 0x3ffn);
            const shardID = Number(uidValue & 0x3ffffn);

            return new UID(localID, objectType, shardID);
        } catch (error) {
            return null;
        }
    }

    static fromBase58(s: string): UID | null {
        return UID.decomposeUID(s);
    }
}

export const GenUID = (localID: number, objectType: number, shardID: number): UID => {
    return new UID(localID, objectType, shardID);
};
