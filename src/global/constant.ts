export const _5_MINS_MILLISECONDS_ = 5 * 60 * 1000;
export const _30_MINS_MILLISECONDS_ = 5 * 60 * 1000;

export const _APP_FEE_ = 50_000;

export const MESSAGE_TYPE = {
  COMPLETED_SESSION: 'COMPLETED_SESSION',
  DEPOSIT_SUCCESS: 'DEPOSIT_SUCCESS',
  NEW_SESSION: 'NEW_SESSION',
  ROUTING_TIME_OUT: 'ROUTING_TIME_OUT',
};

export const NOTIFICATION = {
  COMPLETED_SESSION: {
    TITLE: () => 'Session Completed!',
    BODY: () =>
      'Congratulations! Your 1-1 English speaking session has been successfully completed. We hope you enjoyed practicing with your tutor and look forward to seeing you again soon!',
    PAYLOAD: (sessionId: string) => ({
      type: MESSAGE_TYPE.COMPLETED_SESSION,
      sessionId,
    }),
  },
  DEPOSIT_SUCCESS: {
    TITLE: () => 'Deposit Successful!',
    BODY: (amount: number) =>
      `Your deposit of ${amount} has been successfully processed and credited to your wallet. Your account balance now reflects the updated amount. Thank you for using our app for your transaction. If you have any questions, please contact our customer support team for assistance.`,
    PAYLOAD: (amount: number) => ({
      type: MESSAGE_TYPE.DEPOSIT_SUCCESS,
      amount: `${amount}`,
    }),
  },
  NEW_SESSION: {
    TITLE: () => 'New session request!',
    BODY: () => `A student has requested a new session`,
    PAYLOAD: (sessionId: string) => ({
      type: MESSAGE_TYPE.NEW_SESSION,
      sessionId,
    }),
  },
  ROUTING_TIME_OUT: {
    TITLE: () => 'Routing Timed Out!',
    BODY: () =>
      'Oops! It looks like your 1-1 English speaking session has timed out. Please schedule a new session and try again. We apologize for any inconvenience this may have caused.',
    PAYLOAD: (sessionId: string) => ({
      type: MESSAGE_TYPE.ROUTING_TIME_OUT,
      sessionId,
    }),
  },
};
