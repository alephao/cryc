export enum TxOutStateDiscriminator {
  // No Tx
  Idle = "TxOutStateDiscriminatorIdle",
  // Waiting for user to sign the tx
  PendingSig = "TxOutStateDiscriminatorPendingSig",
  // User refused to sign tx
  Error = "TxOutStateDiscriminatorError",
}

export type TxOutIdle = {
  discriminator: TxOutStateDiscriminator.Idle;
};

export const txOutIdle = () => {
  return {
    discriminator: TxOutStateDiscriminator.Idle,
  } as TxOutIdle;
};

export type TxOutPendingSig = {
  discriminator: TxOutStateDiscriminator.PendingSig;
};

export const txOutPendingSig = () => {
  return {
    discriminator: TxOutStateDiscriminator.PendingSig,
  } as TxOutPendingSig;
};

export type TxOutError = {
  discriminator: TxOutStateDiscriminator.Error;
  message: string;
};

export const txOutError = (message: string) => {
  return {
    discriminator: TxOutStateDiscriminator.Error,
    message,
  } as TxOutError;
};

export type TxOutState = TxOutIdle | TxOutPendingSig | TxOutError;

export enum TxInStateDiscriminator {
  // Tx waiting to be mined
  Pending = "TxInStateDiscriminatorPending",
  // Tx mined and successful
  Success = "TxInStateDiscriminatorSuccess",
  // Tx mined and reverted
  Reverted = "TxInStateDiscriminatorReverted",
}

export type TxInStateReverted = {
  discriminator: TxInStateDiscriminator.Reverted;
  hash: string;
  message: string;
};

export const txInStateReverted = (hash: string, message: string) => {
  return {
    discriminator: TxInStateDiscriminator.Reverted,
    hash,
    message,
  } as TxInStateReverted;
};

export type TxInStateSuccess = {
  discriminator: TxInStateDiscriminator.Success;
  hash: string;
};

export const txInStateSuccess = (hash: string) => {
  return {
    discriminator: TxInStateDiscriminator.Success,
    hash,
  } as TxInStateSuccess;
};

export type TxInStatePending = {
  discriminator: TxInStateDiscriminator.Pending;
  hash: string;
};

export const txInStatePending = (hash: string) => {
  return {
    discriminator: TxInStateDiscriminator.Pending,
    hash,
  } as TxInStatePending;
};

export type TxInState = TxInStatePending | TxInStateReverted | TxInStateSuccess;

export type TxState = TxInState | TxOutState;
