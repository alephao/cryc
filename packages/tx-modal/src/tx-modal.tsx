import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/outline";
import {
  TxInStateDiscriminator,
  TxOutStateDiscriminator,
  TxState,
} from "@cryc/use-contract-tx";

interface TxHashContainerProps {
  hash: string;
  blockScannerHost: string;
}

const TxHashContainer: React.FC<TxHashContainerProps> = ({
  hash,
  blockScannerHost,
}) => {
  return (
    <div className="relative mt-2 pt-6 px-2 pb-2 border border-solid border-gray-200 break-all bg-gray-100 rounded-lg font-mono underline">
      <span className="absolute top-2 l-2 text-xs font-bold text-gray-500">
        TX HASH
      </span>
      <a href={`${blockScannerHost}/${hash}`} target="_blank" rel="noreferrer">
        <span className="text-sm text-gray-700">{hash}</span>
      </a>
    </div>
  );
};

interface TxModalProps {
  txState: TxState;
  blockScannerHost: string;
  done: () => void;
}

export const TxModal: React.FC<TxModalProps> = ({
  txState,
  blockScannerHost,
  done,
}) => {
  return (
    <Transition.Root
      show={txState.discriminator !== TxOutStateDiscriminator.Idle}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {}}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 py-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <div>
                {[
                  TxOutStateDiscriminator.PendingSig as string,
                  TxInStateDiscriminator.Pending as string,
                ].includes(txState.discriminator as string) && (
                  <div className="pb-2">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
                {[
                  TxOutStateDiscriminator.Error as string,
                  TxInStateDiscriminator.Reverted as string,
                ].includes(txState.discriminator as string) && (
                  <div className="pb-2">
                    <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
                  </div>
                )}
                {txState.discriminator === TxInStateDiscriminator.Success && (
                  <div className="pb-2">
                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  </div>
                )}
                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {txState.discriminator ===
                    TxOutStateDiscriminator.PendingSig ? (
                      <span>Waiting for signature</span>
                    ) : txState.discriminator ===
                      TxOutStateDiscriminator.Error ? (
                      <span className="text-red-500">
                        Failed to send transaction
                      </span>
                    ) : txState.discriminator ===
                      TxInStateDiscriminator.Pending ? (
                      <span>Transaction pending</span>
                    ) : txState.discriminator ===
                      TxInStateDiscriminator.Reverted ? (
                      <span className="text-red-600">Transaction reverted</span>
                    ) : (
                      txState.discriminator ===
                        TxInStateDiscriminator.Success && (
                        <span className="text-green-500">
                          Transaction successful
                        </span>
                      )
                    )}
                  </Dialog.Title>
                  <div className="pt-2">
                    <div className="text-sm text-gray-500">
                      {txState.discriminator ===
                      TxOutStateDiscriminator.PendingSig ? (
                        "To execute the transaction, confirm it in your wallet."
                      ) : txState.discriminator ===
                        TxOutStateDiscriminator.Error ? (
                        <p className="text-red-500">{txState.message}</p>
                      ) : txState.discriminator ===
                        TxInStateDiscriminator.Pending ? (
                        <div>
                          <p>Waiting for transaction to be mined.</p>
                          <TxHashContainer
                            hash={txState.hash}
                            blockScannerHost={blockScannerHost}
                          />
                        </div>
                      ) : txState.discriminator ===
                        TxInStateDiscriminator.Reverted ? (
                        <div>
                          <p className="text-red-500">{txState.message}</p>
                          <TxHashContainer
                            hash={txState.hash}
                            blockScannerHost={blockScannerHost}
                          />
                        </div>
                      ) : (
                        txState.discriminator ===
                          TxInStateDiscriminator.Success && (
                          <TxHashContainer
                            hash={txState.hash}
                            blockScannerHost={blockScannerHost}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {[
                TxOutStateDiscriminator.Error as string,
                TxInStateDiscriminator.Reverted as string,
              ].includes(txState.discriminator as string) && (
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-full py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => done()}
                  >
                    Close
                  </button>
                </div>
              )}
              {txState.discriminator === TxInStateDiscriminator.Success && (
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-full py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => done()}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
