import mongoose, { Schema, InferSchemaType, model, models } from "mongoose";

const testCustomerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customerId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    appKey: {
      type: String,
      required: true,
      trim: true,
    },

    appToken: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: prevent duplicate customerId for the same user
testCustomerSchema.index({ userId: 1, customerId: 1 }, { unique: true });

// Optional: prevent duplicate username for the same user
testCustomerSchema.index({ userId: 1, username: 1 }, { unique: true });

export type TestCustomerDocument = InferSchemaType<typeof testCustomerSchema>;

export const TestCustomer =
  models.TestCustomer || model("TestCustomer", testCustomerSchema);