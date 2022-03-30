// ContractErrors is an object following the pattern "<sighash>": ContractError
//
// E.g.:
// '0x843ce46b': {
//   name: 'InvalidClaimAmount',
//   message: "You can't claim more than you're allowed to!",
// },

export interface ContractErrors {
  [key: string]: ContractError;
}

export type ContractError = {
  name: string;
  message: string;
};

export const getErrorMessage = (err: any, contractError: ContractErrors) => {
  if (
    err.error &&
    err.error.data &&
    err.error.data.originalError &&
    err.error.data.originalError.data
  ) {
    if (typeof err.error.data.originalError.data === "string") {
      const aDogsError = contractError[err.error.data.originalError.data];
      if (aDogsError) {
        return aDogsError.message;
      }
    }
  }

  if (err.data && err.data.message) return err.data.message as string;

  if (err.message) return err.message as string;

  return JSON.stringify(err);
};
