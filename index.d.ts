type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;

export class CommandCooldown {
    commandName: string;
    timeout: number;
    activeTimeouts: {
        [commandName: string]: {
            [userID: string]: {
                userID: string;
                timeEnd: string;
            };
        };
    };

    constructor(commandName: string, timeout: number);

    addUser(userID: string): Promise<void>;

    getUser(userID: string): Promise<{
        userID: string;
        timeEnd: Date;
        msLeft: number;
    } | null>;

    removeUser(userID: string): Promise<boolean>;
}

export function msToMinutes<T extends boolean = true>(
    ms: number,
    includeZeros?: T
): {
    hours: If<T, string, number>;
    minutes: If<T, string, number>;
    seconds: If<T, string, number>;
};
