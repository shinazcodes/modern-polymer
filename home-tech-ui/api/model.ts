export interface ExampleModel {
  email?: string;
  id: string;
}

export interface Otp {
  mobile: string;
  status: string;
  otp: string;
  expiry: string;
}

export interface Sms {
  id: string;
  mobile: string;
  status: string;
  unit: number;
  length: number;
  charge: number;
}

export interface OtpSentResponse {
  status: string;
  message: string;
  otp: Otp;
  sms: Sms;
}

export interface OtpVerifyResponse {
  status: string;
  message: string;
}

export interface SendOtprequest {
  key: string;
  sender?: string;
  to: string;
  message?: string;
  template_id?: string;
  otp?: string;
  expiry?: string;
  digits?: string;
  type?: number;
}

export enum SMS  {
  COMPLAINT_REGISTERED="COMPLAINT_REGISTERED";
  WORK_ASSIGNED_CUSTOMER= "WORK_ASSIGNED_CUSTOMER",
  WORK_COMPLETED= "WORK_COMPLETED",
  CANCELLATION= "CANCELLATION",
  WORK_ASSIGNED_TECHNICIAN= "WORK_ASSIGNED_TECHNICIAN",
};

export function getSMS(type: SMS, machineType: string, technicianName: string, technicianMob: string,
  billAmount: string, downloadLink: string, custName: string,
brand: string, custEmail: string) {
  switch(type) {
    case SMS.CANCELLATION:
      return `Dear customer, your ${machineType} complaint request has been cancelled.
      For any assistance, call 9744850738.
       
      Thank you
      HOME TECH WORLD`
      break;
    case SMS.WORK_ASSIGNED_CUSTOMER:
        return `Dear customer, your ${machineType} complaint is assigned to service engineer ${technicianName} with mobile ${technicianMob}.
        Technician will contact you.
         
        Thank you
        HOME TECH WORLD
        Customer Support: 9744850738`
        break;
    case SMS.WORK_COMPLETED:
      return `Dear customer, your service request has been completed by service engineer ${technicianName} with mobile ${technicianMob}.
      The bill amount: INR ${billAmount}
      Download bill in pdf: ${downloadLink}
       
       
      Thank you
      HOME TECH WORLD
      Customer Support: 9744850738`
      return
      break;
      case SMS.WORK_ASSIGNED_TECHNICIAN:
        return `Dear service engineer, a call has been assigned for you.
        Customer name: ${custName}
        Product: ${machineType}
        Brand: ${brand}
        eMail: ${custEmail}
         
        Please contact the customer accordingly.
         
        Thank you
        HOME TEACH WORLD`
        break;
        case SMS.COMPLAINT_REGISTERED:
          return `Dear customer, your ${machineType} complaint has registered in Home Tech World. Our service engineer will contact you within 24 hours.
 
          Thank you
          HOME TECH WORLD
          Customer Support: 9744850738`
      break;
          
  }

}