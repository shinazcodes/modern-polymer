import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  section: {
    minWidth: "45%",
    width: "45%",
    padding: 10,
  },
  rows: {
    borderWidth: 1,
    borderColor: "black",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    borderBottomWidth: 0,
  },
  columns: {
    borderWidth: 1,
    borderColor: "black",
    margin: "0.25%",
    minWidth: "19%",
    height: 40,
    lineHeight: "100%",
    marginVertical: "auto",
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  bigColumns: {
    borderWidth: 1,
    borderColor: "black",
    margin: "0.25%",
    minWidth: "59.5%",
    textAlign: "center",
    minHeight: 40,

    backgroundColor: "lightgrey",
  },
});

// Create Document Component
const PdfDocument = () => (
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
          }}
        >
          Service Reciept
        </Text>
      </View>
      <View style={styles.section}>
        <View>
          <Text
            style={{
              marginBottom: 25,
            }}
          >
            Home Tech World
          </Text>
        </View>
        <View>
          <Text>
            hometechworld.complaints@gmail.com Sulite 23 M,1 St Floor, A Square
            Building, Edathala PO, Kuzhivelippady, Ernakulam, Kerala 683561
            GSTIN: 32FOMPB7395GIZP Account number: 921020016570009 Ifsc code:
            UTIB0002748 Branch: vennala Bank: axis Bank
          </Text>
        </View>
      </View>
      <View style={styles.section}>
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
        }}
      ></View>

      <Text style={styles.section}>
        Customer Name: Test Address : Bdhdhdydbd,hehhs phone:974648488 Email :
        jsodbdbdh@ysgdvvd
      </Text>
      <Text style={styles.section}>Inv-No: #PAY04852 Date :2022-07-12</Text>
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
              }}
            >
              Sl No
            </Text>
          </View>

          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              Item
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              Rate
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              Quantity
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              Total
            </Text>
          </View>
        </View>

        <View style={styles.rows}>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              1
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              something
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              1000
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              3
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              3000
            </Text>
          </View>
        </View>
        <View style={styles.rows}>
          <View style={styles.bigColumns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              Rate
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              Quantity
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              Total
            </Text>
          </View>
        </View>
        <View style={styles.rows}>
          <View style={styles.bigColumns}></View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              GST @0.0%
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              0.0
            </Text>
          </View>
        </View>
        <View style={styles.rows}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "black",
              margin: "0.25%",
              minWidth: "59.5%",
              textAlign: "center",
              minHeight: 20,
              maxWidth: "59.5%",
              backgroundColor: "lightgrey",
            }}
          >
            <Text
              style={{
                margin: "auto",
                fontSize: 14,
              }}
            >
              INR(ONE THOUSAND NINE HUNDRED SIXTY ONLY)
            </Text>
          </View>

          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              Grand Total
            </Text>
          </View>
          <View style={styles.columns}>
            <Text
              style={{
                margin: "auto",
              }}
            >
              3000
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          margin: 24,
        }}
      >
        Serviced by : Test
      </Text>
      <Text
        style={{
          margin: 24,
          marginTop: 100,
        }}
      >
        Home Tech World Authorised Signatory
      </Text>
      <View
        style={{
          backgroundColor: "grey",
          width: "100%",
          height: 1,
          marginVertical: 24,
        }}
      ></View>
      <Text>
        o The Service Partners Are Fully Responsible For Complained Attended By
        HOME TECH WORLD The Service Partners Are Fully Responsible For
        Complained Attended By Them.
      </Text>
      <Text>
        o The Service Partners Are Fully Responsible For Complained Attended By
        Them.
      </Text>
      <Text>
        o Out Responsibility Is Limited to Service Of The Equipment Only. We Are
        Not Responsible For AnyConsequential Damage Arising From Delay In Non
        Repair Of Equipment.
      </Text>

      <Text>
        o Our Service And Its Associates(Service Partner) Are Not Responsible
        For The Direct Or Indirect Damage& Breakage At The Time Of
        Repairing/Installation/Servicing.
      </Text>
      <Text>
        o Guarantee Of The Parts Which Replaced Will Be Under Terms & Condition.
      </Text>
      <Text>
        o Ones Sold Part Will Not Be Taken Back & Cash Will Not
        Refundable.Service Will Provided By Service Partner Within Warranty
        Period(30 Days)
      </Text>
      <Text>o Payment Mode Will Be On Cash only</Text>
    </Page>
  </Document>
);

export default PdfDocument;
