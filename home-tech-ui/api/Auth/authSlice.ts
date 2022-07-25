import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { EmailVerifyItems } from "../../pages/auth/signup";
import {
  ApiResponse,
  buildPath,
  GetSmsApi,
  HomeTechApi,
  PostApi,
  PostSmsApi,
} from "./Base";
import jwt_decode from "jwt-decode";
import { OtpSentResponse, OtpVerifyResponse, SendOtprequest } from "../model";

export enum ApiState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export interface InitialAuthState {
  data: EmailVerifyItems;
  status: ApiState;
  emailToken?: string;
  accessToken?: string;
}
const initialState: InitialAuthState = {
  data: {} as EmailVerifyItems,
  status: ApiState.IDLE,
  emailToken: "",
  accessToken: "",
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data: EmailVerifyItems) => {
    console.log(data);
    try {
      const response = await PostApi(buildPath("verifyEmail"), data);
      console.log(response);

      // The value we return becomes the `fulfilled` action payload
      return response.data as ApiResponse<any>;
    } catch (err) {
      console.log(err);
    }
  }
);

export const otpVerification = createAsyncThunk(
  "auth/otpVerification",
  async (data: { otpVerified: boolean; phoneNumber: string }) => {
    console.log(data);
    const response = await PostApi(buildPath("otpVerification"), data);
    console.log(response);

    // The value we return becomes the `fulfilled` action payload
    return response.data as ApiResponse<{ emailToken: string }>;
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: { otp: string; phoneNumber: string }) => {
    const otpData: SendOtprequest = {
      key: "IngQUAiVkwDHG2lR4T6E5KhMoDnhKfSp",
      to: data.phoneNumber,
      otp: data.otp,
    };
    const response = await PostSmsApi("/otp/verify", otpData);
    console.log(response);

    // The value we return becomes the `fulfilled` action payload
    return response.data as OtpVerifyResponse;
  }
);

// digits default 6,
// expiry default 2hours
// otp  created and sent from the sms buddy if not created here

export const sendOtp = createAsyncThunk(
  "customer/sendOtp",
  async (mobileNumber: string) => {
    const otpData: SendOtprequest = {
      key: "IngQUAiVkwDHG2lR4T6E5KhMoDnhKfSp",
      sender: "HOMTEC",
      to: mobileNumber,
      message:
        "{#otp#} is your OTP for registering as a technician at HomeTech World. OTP is valid for 2 hours.",
    };
    // console.log(data);

    const response = await GetSmsApi("/sms/send", {
      params: {
        key: "IngQUAiVkwDHG2lR4T6E5KhMoDnhKfSp",
        template_id: "1307165821178488810",
        type: 1,
        to: mobileNumber,
        sender: "HOMTEC",
        message:
          "Dear customer, your Test complaint has registered in Home Tech World. Our service engineer will contact you within 24 hours. Thank you HOME TECH WORLD Customer Support: 9744850738",
      },
    });

    console.log(response);

    // The value we return becomes the `fulfilled` action payload
    return response.data as OtpSentResponse;
  }
);

export const sendSms = createAsyncThunk(
  "customer/sendSms",
  async (mobileNumber: string) => {
    // console.log(data);

    const response = await GetSmsApi("/sms/send", {
      params: {
        key: "IngQUAiVkwDHG2lR4T6E5KhMoDnhKfSp",
        template_id: "1307165821178488810",
        type: 1,
        to: mobileNumber,
        sender: "HOMTEC",
        message:
          "Dear customer, your Test complaint has registered in Home Tech World. Our service engineer will contact you within 24 hours. Thank you HOME TECH WORLD Customer Support: 9744850738",
      },
    });

    console.log(response);

    // The value we return becomes the `fulfilled` action payload
    return response.data as OtpSentResponse;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: { password: string; emailToken: string }) => {
    console.log(data);
    try {
      const response = await PostApi(buildPath("register"), data);
      console.log(response);

      // The value we return becomes the `fulfilled` action payload
      return response.data as ApiResponse<string>;
    } catch (err) {
      console.log(err);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    console.log(data);
    try {
      const response = await PostApi(buildPath("login"), data);
      console.log(response);

      // The value we return becomes the `fulfilled` action payload
      return response.data as ApiResponse<{ token: string }>;
    } catch (err) {
      console.log(err);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
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
      .addCase(verifyEmail.pending, (state) => {
        state.status = ApiState.LOADING;
        console.log(state);
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        state.data = { ...action.meta.arg };
        console.log(current(state).data);
        console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        console.log(state);

        // state.value += action.payload;
      });
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.status = ApiState.LOADING;
        console.log(state);
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        // state.data = { ...action.meta.arg };
        console.log(current(state).data);
        console.log(action.payload);
        if (action.payload.status === "200") {
          state.status = ApiState.SUCCESS;
        } else {
          state.status = ApiState.ERROR;
        }
        // state.value += action.payload;
      })
      .addCase(verifyOtp.rejected, (state) => {
        state.status = ApiState.ERROR;
        console.log(state);

        // state.value += action.payload;
      });
    builder
      .addCase(register.pending, (state) => {
        state.status = ApiState.LOADING;
        console.log(state);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        // state.data = { ...action.meta.arg };
        console.log(current(state).data);
        console.log(action.payload);

        // state.value += action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        console.log(state);

        // state.value += action.payload;
      });
    builder
      .addCase(login.pending, (state) => {
        state.status = ApiState.LOADING;
        console.log(state);
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = ApiState.SUCCESS;
        // state.data = { ...action.meta.arg };
        console.log(current(state).data);
        console.log(action.payload);
        state.accessToken = action.payload?.response?.token;
        localStorage.setItem(
          "accessToken",
          action.payload?.response?.token?.toString() ?? ""
        );

        const decoded: {
          userType: string;
        } = jwt_decode(action.payload?.response?.token?.toString() ?? "");
        localStorage.setItem("userType", decoded.userType);
        state.data = {} as EmailVerifyItems;
        // state.value += action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = ApiState.ERROR;
        console.log(state);

        // state.value += action.payload;
      });

    builder
      .addCase(sendOtp.pending, (state) => {
        state.status = ApiState.LOADING;
        console.log(state);
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        // console.log(current(state).data);
        console.log(action.payload);
        if (action.payload.status === "200") {
          state.status = ApiState.SUCCESS;
        } else {
          state.status = ApiState.ERROR;
        }

        // state.value += action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
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

export default authSlice.reducer;
