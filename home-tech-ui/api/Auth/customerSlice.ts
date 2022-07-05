import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { EmailVerifyItems } from "../../pages/auth/signup";
import { ApiResponse, buildPath, GetApi, PostApi } from "./Base";

export enum ApiState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export interface InitialAuthState {
  customerList: Customer[] | undefined;
  status: ApiState;
}
export interface Customer {
  machine: string;
  name: string;
  fullAddress: string;
  brand: string;
  mobileNumber: string;
  altMobileNumber: string;
  assignedTo: string;
  status: string;
}
const initialState: InitialAuthState = {
  customerList: [] as Customer[],
  status: ApiState.IDLE,
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
    console.log(response);

    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<Customer[]>;
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // },
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
        console.log(state);
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        // state.data = { ...action.meta.arg };
        // console.log(current(state).data);
        console.log(action.payload);

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
        console.log(state);
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        state.customerList = action.payload?.response;
        // console.log(current(state).data);
        console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        console.log(state);

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
