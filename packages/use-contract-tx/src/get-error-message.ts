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

export const getErrorMessage = (err: any, contractError: any) => {
  // For custom errors, the error sighash is on err.error.data.originalError.data
  if (
    err.error &&
    err.error.data &&
    err.error.data.originalError &&
    err.error.data.originalError.data
  ) {
    if (typeof err.error.data.originalError.data === 'string') {
      const customError = contractError[err.error.data.originalError.data]
      if (customError) {
        return customError.message
      }
    }
  }

  if (err.error && err.error.data && err.error.data.message) return err.error.data.message as string

  // When estimateGas fail, error is in err.error.message
  if (err.error && err.error.message) return err.error.message as string

  // When transaction is rejected error is in err.message
  if (err.message) return err.message as string

  return JSON.stringify(err)
}