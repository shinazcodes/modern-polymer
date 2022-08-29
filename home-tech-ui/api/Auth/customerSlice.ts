import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { Services } from "../../pages/admin/invoice";
import { EmailVerifyItems } from "../../pages/auth/signup";
import { OtpSentResponse, SendOtprequest } from "../model";
import { ApiResponse, buildPath, GetApi, PostApi, PostSmsApi } from "./Base";

export enum ApiState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export interface InitialAuthState {
  customerList: Customer[] | undefined;
  status: ApiState;
  selectedForInvoice?: Customer;
  selectedForInvoiceGeneration?: Customer;
}
export interface Customer {
  machine: string;
  name: string;
  fullAddress: string;
  brand: string;
  email: string;
  mobileNumber: string;
  altMobileNumber: string;
  assignedTo: string;
  status: string;
  _customerId?: string;
  invoiceDetails?: InvoiceDetails;
}

export interface Service {
  name: string;
  quantity: string;
  price: string;
}

export interface InvoiceDetails {
  name: string;
  fullAddress: string;
  custId?: string;
  mobileNumber: number;
  email: string;
  assignedTo: string;
  invoiceId?: string;
  invoiceDate?: string;
  gst?: number;
  approved?: boolean;
  services: Service[];
}

export interface AssignJobRequest {
  technicianEmail: string | null;
  customer: Customer;
  remove: boolean;
}

export interface GenerateInvoiceRequest {
  machine?: string;
  name: string;
  fullAddress: string;
  brand?: string;
  email: string;
  mobileNumber: string;
  altMobileNumber?: string;
  assignedTo: string;
  status?: string;
  _customerId?: string;
  services: Services[];
  invoiceId?: string;
  invoiceDate?: string;
  gst?: number;
}

const initialState: InitialAuthState = {
  customerList: [] as Customer[],
  status: ApiState.IDLE,
  selectedForInvoice: undefined,
  selectedForInvoiceGeneration: undefined,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (data: Customer) => {
    console.log(data);

    const response = await PostApi(buildPath("createCustomer"), data);
    console.log(response);

    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<any>;
  }
);

export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async () => {
    const response = await GetApi(buildPath("get-customers"));
    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<Customer[]>;
  }
);
export const assignJob = createAsyncThunk(
  "customer/assignJob",
  async (data: AssignJobRequest) => {
    const response = await PostApi(buildPath("assign-job"), data);

    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<any>;
  }
);

export const generateInvoice = createAsyncThunk(
  "customer/generateInvoice",
  async (invoiceDetails: GenerateInvoiceRequest) => {
    const response = await PostApi(buildPath("generateInvoice"), {
      invoiceDetails,
    });

    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<any>;
  }
);

export const getInvoice = createAsyncThunk(
  "customer/getInvoice",
  async ({ _customerId }: { _customerId: string }) => {
    const response = await PostApi(buildPath("getInvoice"), {
      _customerId: _customerId,
    });

    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<any>;
  }
);
export const approveInvoice = createAsyncThunk(
  "customer/approveInvoice",
  async ({ _customerId }: { _customerId: string }) => {
    const response = await PostApi(buildPath("approveInvoice"), {
      _customerId: _customerId,
    });

    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<any>;
  }
);
export const completeTask = createAsyncThunk(
  "customer/completeTask",
  async ({
    _customerId,
    technicianEmail,
  }: {
    _customerId: string;
    technicianEmail: string;
  }) => {
    const response = await PostApi(buildPath("completeTask"), {
      _customerId: _customerId,
      technicianEmail,
    });

    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<any>;
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    custInvoice: (state, action) => {
      console.log(action.payload);
      state.selectedForInvoice = action.payload.customer;
    },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.status = ApiState.LOADING;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        // state.data = { ...action.meta.arg };
        // console.log(current(state).data);
        // console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        console.log(state);

        // state.value += action.payload;
      });
    builder
      .addCase(getCustomers.pending, (state) => {
        state.status = ApiState.LOADING;
        // console.log(state);
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        state.customerList = action.payload?.response;
        // console.log(current(state).data);
        // console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        // console.log(state);

        // state.value += action.payload;
      });
    builder
      .addCase(assignJob.pending, (state) => {
        state.status = ApiState.LOADING;
        // console.log(state);
      })
      .addCase(assignJob.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        // console.log(current(state).data);
        // console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(assignJob.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        // console.log(state);

        // state.value += action.payload;
      });
    builder
      .addCase(generateInvoice.pending, (state) => {
        state.status = ApiState.LOADING;
        // console.log(state);
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        // console.log(current(state).data);
        // console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        // console.log(state);

        // state.value += action.payload;
      });
    builder
      .addCase(getInvoice.pending, (state) => {
        state.status = ApiState.LOADING;
        // console.log(state);
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        state.selectedForInvoiceGeneration = action.payload.response.customer;
        // console.log(current(state).data);
        // console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(getInvoice.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        // console.log(state);

        // state.value += action.payload;
      });

    builder
      .addCase(approveInvoice.pending, (state) => {
        state.status = ApiState.LOADING;
        // console.log(state);
      })
      .addCase(approveInvoice.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        // state.selectedForInvoiceGeneration = action.payload.response.customer;
        // console.log(current(state).data);
        // console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(approveInvoice.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        // console.log(state);

        // state.value += action.payload;
      });

    builder
      .addCase(completeTask.pending, (state) => {
        state.status = ApiState.LOADING;
        // console.log(state);
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        // state.selectedForInvoiceGeneration = action.payload.response.customer;
        // console.log(current(state).data);
        // console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        // console.log(state);

        // state.value += action.payload;
      });
  },
});

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: any) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
  (amount: any) => (dispatch: any, getState: any) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      //   dispatch(incrementByAmount(amount));
    }
  };

export default customerSlice.reducer;
