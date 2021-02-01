import { memo, useEffect, useState } from "react";
import Table from "antd/lib/table";
import Typography from "antd/lib/typography";
import { firebaseApp } from "../config/config";
import LoadingIcon from "../components/LoadingIcon";
import styled from "styled-components";
import XLSX from "xlsx";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";
import { Input } from "antd";
const columns = [
   {
      title: "ชื่อ-สกุล",
      dataIndex: "fullName",
      key: "fullName",
   },
   {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
   },
   {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
   },
   {
      title: "รายละเอียดอื่นๆ",
      dataIndex: "other",
      key: "other",
   },
   {
      title: "เวลาที่ลงทะเบียน",
      dataIndex: "time",
      key: "time",
      render: (time) => <span>{new Date(time).toLocaleString()}</span>,
   },
];

const BaseTable = styled(Table)`
   .ant-spin.ant-spin-spinning {
      display: flex;
      align-items: center;
      justify-content: center;
   }
`;

const Register = () => {
   const [, setPage] = useState(1);
   const [registerData, setRegisterData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [pageSize, setPageSize] = useState(null);
   const LIMIT = 3;

   useEffect(() => {
      setIsLoading(true);
      const unsub = firebaseApp
         .firestore()
         .collection("happyoil-registers")
         .onSnapshot((snapshot) => {
            let sizeOfCollection = snapshot.size;
            setPageSize(sizeOfCollection);

            firebaseApp
               .firestore()
               .collection("happyoil-registers")
               .orderBy("index", "desc")
               .startAt(sizeOfCollection)
               .limit(LIMIT)
               .onSnapshot(async (snapshot) => {
                  const registerData = await snapshot.docs.map((item) =>
                     item.data(),
                  );
                  setRegisterData(registerData);
               });
            setIsLoading(false);
         });
      return () => {
         unsub();
      };
   }, []);

   console.log("registerData : ", registerData);

   const createCsv = (data) => {
      let test = XLSX.utils.json_to_sheet(data);
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, test, "test");
      XLSX.writeFile(wb, "export_register_data.xlsx");
   };

   const exportToCsv = async () => {
      firebaseApp
         .firestore()
         .collection("happyoil-registers")
         .onSnapshot(async (snapshot) => {
            let sizeOfDocument = snapshot.size;
            const LIMIT = 10000;

            if (sizeOfDocument >= 38000) {
               const LOOP_COUNT = Math.ceil(sizeOfDocument / LIMIT);

               const LOOP_COUNT_ARRAY = Array.from(
                  Array(LOOP_COUNT).keys(),
               ).map((item) => item);

               let lastIndex = 1;

               for (const index of LOOP_COUNT_ARRAY) {
                  console.log("lastIndex : ", lastIndex);
                  const getRef = await firebaseApp
                     .firestore()
                     .collection("happyoil-registers")
                     .orderBy("index")
                     .startAt(lastIndex)
                     .limit(LIMIT)
                     .get();
                  const getData = await getRef.docs.map((item) => item.data());
                  lastIndex = getData[getData.length - 1].index + 1;
                  createCsv(getData);
               }
            } else {
               const getRef = await firebaseApp
                  .firestore()
                  .collection("happyoil-registers")
                  .orderBy("index")
                  .startAt(1)
                  .limit(LIMIT)
                  .get();
               const getData = await getRef.docs.map((item) => item.data());
               createCsv(getData);
            }
         });
   };

   const searchByName = async (search) => {
      if (search) {
         const getRef = await firebaseApp
            .firestore()
            .collection("happyoil-registers")
            .where("keyword", "array-contains", search.toLowerCase())
            .orderBy("index", "desc")
            .limit(LIMIT)
            .get();
         const getData = await getRef.docs.map((item) => item.data());
         setRegisterData(getData);
         setPage(1);
      } else {
         firebaseApp
            .firestore()
            .collection("happyoil-registers")
            .orderBy("index", "desc")
            .startAt(pageSize)
            .limit(LIMIT)
            .onSnapshot(async (snapshot) => {
               const registerData = await snapshot.docs.map((item) =>
                  item.data(),
               );
               setRegisterData(registerData);
            });
      }
   };

   return (
      <div>
         <Row>
            <Col span={12}>
               <Typography.Title level={3}>ข้อมูลการลงทะเบียน</Typography.Title>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
               <Button
                  style={{ background: "#005219", color: "white" }}
                  onClick={() => exportToCsv()}
               >
                  ดึงข้อมูล excel
               </Button>
            </Col>
         </Row>
         {/* <Input
            placeholder="search"
            onChange={(event) => searchByName(event.target.value)}
         /> */}
         <BaseTable
            pagination={{
               total: pageSize,
               pageSize: LIMIT,
               onChange: async (page) => {
                  const getRef = await firebaseApp
                     .firestore()
                     .collection("happyoil-registers")
                     .orderBy("index", "desc")
                     .startAt(pageSize - LIMIT * page + LIMIT)
                     .limit(LIMIT)
                     .get();
                  const getData = await getRef.docs.map((item) => item.data());
                  setRegisterData(getData);
                  setPage(page);
               },
            }}
            size="small"
            loading={{
               spinning: isLoading,
               indicator: <LoadingIcon />,
            }}
            dataSource={registerData}
            columns={columns}
            rowKey={(item) => item.index}
         />
      </div>
   );
};

export default memo(Register);
