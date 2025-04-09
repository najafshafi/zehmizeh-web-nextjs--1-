// These are the cases where freelancer or client won't be able to create dispute
export const Vaidations = {
  // userType
  client: {
    // jobType
    fixed: {
      // Error with the selected milestone status [key = milestone status, value: error]
      pending:
        "The milestone is not paid yet, you won't be able to create dispute on this.",
      released:
        "The milestone payment is already released, you won't be able to create dispute on this.",
      under_dispute:
        "This milestone is already under dispute, you won't be able to create dispute on this.",
    },
    hourly: {
      // pending:
      //   "The milestone is not paid yet, you won't be able to create dispute on this.",
      paid: "The milestone is already paid, you won't be able to create dispute on this.",
      under_dispute:
        "This milestone is already under dispute, you won't be able to create dispute on this.",
      decline:
        "This milestone payment is already declined by you, you won't be able to create dispute on this.",
      declined:
        "This milestone payment is already declined by you, you won't be able to create dispute on this.",
    },
  },
  freelancer: {
    fixed: {
      pending:
        "Client has not declined the payment, so you won't be able to create dispute on this.",
      released:
        "The milestone payment is already released, you won't be able to create dispute on this.",
      under_dispute:
        "This milestone is already under dispute, you won't be able to create dispute on this.",
    },
    hourly: {
      paid: "The milestone is already paid, you won't be able to create dispute on this.",
      under_dispute:
        "This milestone is already under dispute, you won't be able to create dispute on this.",
      decline: "In hourly project, you can't create dispute.",
      declined: "In hourly project, you can't create dispute.",
    },
  },
};
