
// Registering a user

import { TEST_DISPATCH } from "./types";

export const registerUser = (userPayload) => {
    return {
        type: TEST_DISPATCH,
        payload: userPayload
    };
};