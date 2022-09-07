import React, { ReactNode } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Customer } from "../../api/Auth/customerSlice";
var converter = require("number-to-words");
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    fontFamily: "Courier",
  },
  section: {
    minWidth: "45%",
    width: "47%",
    padding: 10,
    fontSize: 12,
  },
  bigSection: {
    minWidth: "55%",
    width: "55%",
    padding: 10,
  },
  smallSection: {
    minWidth: "35%",
    width: "35%",
    padding: 10,
  },
  rows: {
    borderWidth: 1,
    borderColor: "black",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    fontSize: 12,
    borderBottomWidth: 0,
  },
  columns: {
    borderWidth: 1,
    borderColor: "black",
    margin: "0.25%",
    minWidth: "16.1%",
    height: 40,
    fontSize: 12,
    lineHeight: "100%",
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    minHeight: 20,
    maxWidth: "16.1%",
  },
  bigColumns: {
    borderWidth: 1,
    borderColor: "black",
    margin: "0.25%",
    minWidth: "65.5%",
    textAlign: "center",
    minHeight: 40,
    fontSize: 12,

    backgroundColor: "lightgrey",
  },
  small: {
    fontSize: 12,
    lineHeight: 1.25,
  },
  smaller: {
    fontSize: 10,
    lineHeight: 1.25,
  },
});

// Create Document Component
const PdfDocument = ({
  data,
  total,
}: {
  data: Customer | undefined;
  total: number;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          minWidth: "100%",
          marginVertical: 75,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            width: "100%",
            fontFamily: "Courier-Bold",
          }}
        >
          Service Reciept
        </Text>
      </View>
      <View style={styles.bigSection}>
        <View>
          <Text
            style={{
              marginBottom: 25,
              fontSize: 10,
              fontFamily: "Courier-Bold",
            }}
          >
            Home Tech World
          </Text>
        </View>
        <View>
          <Text style={styles.small}>
            hometechworld.complaints@gmail.com Sulite 23 M,1 St Floor, A Square
            Building, Edathala PO, Kuzhivelippady, Ernakulam, Kerala 683561
          </Text>
          <Text style={styles.small}>GSTIN: 32FOMPB7395GIZP</Text>
          <Text style={styles.small}>Account number: 921020016570009 </Text>
          <Text style={styles.small}>Ifsc code: UTIB0002748 </Text>
          <Text style={styles.small}>Branch: vennala Bank: axis Bank</Text>
        </View>
      </View>
      <View style={styles.smallSection}>
        <Text>home</Text>
        <Image
          src={"/newlogo.png"}
          style={{
            width: 112,
            height: 57,
          }}
        />
      </View>
      <View
        style={{
          backgroundColor: "grey",
          width: "100%",
          height: 1,
          marginVertical: 16,
        }}
      ></View>

      <View style={styles.section}>
        <Text style={{ ...styles.small, paddingBottom: 12 }}>
          Customer Name: {data?.invoiceDetails?.name}
        </Text>
        <Text style={{ ...styles.small, paddingBottom: 12 }}>
          Address : {data?.invoiceDetails?.fullAddress}
        </Text>
        <Text style={{ ...styles.small, paddingBottom: 12 }}>
          phone:{data?.invoiceDetails?.mobileNumber}
        </Text>
        <Text style={{ ...styles.small, paddingBottom: 12 }}>
          Email : {data?.invoiceDetails?.email}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={{ ...styles.small, fontFamily: "Courier-Bold" }}>
          Inv-No: {data?.invoiceDetails?.invoiceId}
        </Text>
        <Text style={{ ...styles.small, fontFamily: "Courier-Bold" }}>
          Date:{data?.invoiceDetails?.invoiceDate}
        </Text>
      </View>
    </Page>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "black",
          width: "100%",
          flexDirection: "column",
          flexWrap: "wrap",
          display: "flex",
          marginTop: 32,
        }}
      >
        <View style={styles.rows}>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Sl No
            </Text>
          </View>

          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Item
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Rate
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Quantity
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              GST%
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Total
            </Text>
          </View>
        </View>
        {data?.invoiceDetails?.services.map((service, index) => (
          <View key={index} style={styles.rows}>
            <View style={styles.columns}>
              <Text
                style={{
                  margin: "auto",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {index + 1}
              </Text>
            </View>
            <View style={styles.columns}>
              <Text
                style={{
                  margin: "auto",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {service.name}
              </Text>
            </View>
            <View style={styles.columns}>
              <Text
                style={{
                  margin: "auto",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {service.price}
              </Text>
            </View>
            <View style={styles.columns}>
              <Text
                style={{
                  margin: "auto",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {service.quantity}
              </Text>
            </View>
            <View style={styles.columns}>
              <Text
                style={{
                  margin: "auto",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {service.gst ?? 0}%
              </Text>
            </View>
            <View style={styles.columns}>
              <Text
                style={{
                  margin: "auto",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {Number(service.price) * Number(service.quantity) +
                  (Number(service.price) *
                    Number(service.quantity) *
                    (service.gst ?? 0)) /
                    100}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.rows}>
          <View style={styles.bigColumns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Rate
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Quantity
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Total
            </Text>
          </View>
        </View>
        {/* <View style={styles.rows}>
          <View style={styles.bigColumns}></View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              GST @{data?.invoiceDetails?.gst}%
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              {gstAmount}
            </Text>
          </View>
        </View> */}
        <View style={styles.rows}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "black",
              margin: "0.25%",
              minWidth: "65.5%",
              textAlign: "center",
              minHeight: 20,
              maxWidth: "65.5%",
              backgroundColor: "lightgrey",
            }}
          >
            <Text
              style={{
                margin: "auto",
                fontSize: 12,
                textAlign: "center",
                width: "100%",
              }}
            >
              INR({converter.toWords(total)})
            </Text>
          </View>

          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              Grand Total
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              {total}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          minWidth: "38%",
          width: "38%",
          padding: 10,
          fontSize: 12,
          marginVertical: 24,
        }}
      >
        <Text
          style={{
            marginHorizontal: 24,
          }}
        >
          Serviced by : {data?.invoiceDetails?.assignedTo}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "62%",
          alignContent: "flex-end",
          alignItems: "flex-end",
          justifyContent: "space-around",
          marginVertical: 24,
        }}
      >
        <Image
          src={"/stamp_approved.png"}
          style={{
            width: "30%",
            height: 75,
          }}
        />
        <Text style={{ fontSize: 12, width: "60%" }}>
          Home Tech World Authorised Signatory
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "grey",
          width: "100%",
          height: 1,
          marginVertical: 24,
        }}
      ></View>
      <View
        style={{
          padding: 16,
        }}
      >
        <Text style={styles.smaller}>
          o The Service Partners Are Fully Responsible For Complained Attended
          By HOME TECH WORLD The Service Partners Are Fully Responsible For
          Complained Attended By Them.
        </Text>
        <Text style={styles.smaller}>
          o The Service Partners Are Fully Responsible For Complained Attended
          By Them.
        </Text>
        <Text style={styles.smaller}>
          o Out Responsibility Is Limited to Service Of The Equipment Only. We
          Are Not Responsible For AnyConsequential Damage Arising From Delay In
          Non Repair Of Equipment.
        </Text>

        <Text style={styles.smaller}>
          o Our Service And Its Associates(Service Partner) Are Not Responsible
          For The Direct Or Indirect Damage& Breakage At The Time Of
          Repairing/Installation/Servicing.
        </Text>
        <Text style={styles.smaller}>
          o Guarantee Of The Parts Which Replaced Will Be Under Terms &
          Condition.
        </Text>
        <Text style={styles.smaller}>
          o Ones Sold Part Will Not Be Taken Back & Cash Will Not
          Refundable.Service Will Provided By Service Partner Within Warranty
          Period(30 Days)
        </Text>
        <Text style={styles.smaller}>o Payment Mode Will Be On Cash only</Text>
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
