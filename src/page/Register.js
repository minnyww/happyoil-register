import { memo, useState } from "react";
import Typography from "antd/lib/typography";
import Input from "antd/lib/input";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Card from "antd/lib/card";
import Button from "antd/lib/button";
import notification from "antd/lib/notification";
import { firebaseApp } from "../config/config";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";

const BaseCard = styled(Card)`
   box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
   border-radius: 12px;
`;

const ErrorText = styled.label`
   color: #005219;
`;

const Register = () => {
   const [isLoading, setIsLoading] = useState(false);

   const { handleSubmit, errors, control } = useForm();

   const addTestData = async ({ fullName, email, phoneNumber, other }) => {
      setIsLoading(true);
      try {
         let size = await firebaseApp
            .firestore()
            .collection("happyoil-registers")
            .get();
         let index = size === 0 ? 1 : size.size + 1;

         firebaseApp
            .firestore()
            .collection("happyoil-registers")
            .add({
               fullName: fullName,
               time: Date.now(),
               registerTime: new Date(Date.now()).toLocaleString(),
               email: email,
               phoneNumber: phoneNumber,
               other: other,
               index: index,
            });
         notification["success"]({
            message: "ลงทะเบียนเรียบร้อย",
            description: "ระบบทำการลงทะเบียนให้ท่านเรียบร้อยแล้ว",
         });
      } catch (error) {
         notification["success"]({
            message: "เกิดข้อผิดพลาด",
            description:
               "ระบบไม่สามารถลงทะเบียนให้ท่านได้ กรุณาลองใหม่อีกครั้ง",
         });
      } finally {
         setIsLoading(false);
      }
   };

   const onSubmit = (data) => {
      addTestData({
         fullName: data.fullName,
         email: data.email,
         phoneNumber: data.phoneNumber,
         other: data.other,
      });
   };

   return (
      <Row>
         <Col
            xl={{ span: 14, push: 5 }}
            lg={{ span: 14, push: 5 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
         >
            <BaseCard bordered>
               <Col
                  style={{ display: "flex", justifyContent: "center" }}
                  xl={{ span: 16, push: 4 }}
                  lg={{ span: 16, push: 4 }}
                  sm={{ span: 24 }}
                  xs={{ span: 24 }}
               >
                  <img
                     src="https://happyoilgroup.com/wp-content/uploads/2020/04/logo.png"
                     width={200}
                     height={150}
                     alt="happy-oil-logo"
                     style={{ objectFit: "contain" }}
                  />
               </Col>
               <Typography.Title
                  level={3}
                  style={{ textAlign: "center", color: "#005219" }}
               >
                  ลงทะเบียนรับคำปรึกษาตู้เติมน้ำมันอัตโนมัติกับผู้เชี่ยวชาญ
               </Typography.Title>
               <Row gutter={[16, 16]}>
                  <form
                     style={{ width: "100%" }}
                     onSubmit={handleSubmit(onSubmit)}
                  >
                     <Col span={24}>
                        <Controller
                           defaultValue=""
                           control={control}
                           name="fullName"
                           rules={{
                              required: {
                                 value: true,
                                 message: "กรุณากรอกชื่อ-นามสกุล",
                              },
                           }}
                           render={({ onChange }) => (
                              <Input
                                 placeholder="ชื่อ-นามสกุล"
                                 onChange={(e) => onChange(e.target.value)}
                              />
                           )}
                        />
                        {errors?.fullName && (
                           <ErrorText>{errors?.fullName?.message}</ErrorText>
                        )}
                     </Col>
                     <Col span={24}>
                        <Controller
                           defaultValue=""
                           control={control}
                           name="email"
                           rules={{
                              required: {
                                 value: true,
                                 message: "กรุณากรอกอีเมล",
                              },
                              pattern: {
                                 // eslint-disable-next-line no-useless-escape
                                 value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                 message: "กรุณากรอกอีเมลให้ถูกต้อง",
                              },
                           }}
                           render={({ onChange }) => (
                              <Input
                                 placeholder="อีเมล"
                                 onChange={(e) => onChange(e.target.value)}
                              />
                           )}
                        />
                        {errors?.email && (
                           <ErrorText>{errors?.email?.message}</ErrorText>
                        )}
                     </Col>
                     <Col span={24}>
                        <Controller
                           defaultValue=""
                           control={control}
                           name="phoneNumber"
                           rules={{
                              required: {
                                 value: true,
                                 message: "กรุณากรอกเบอร์โทรศัพท์",
                              },
                              pattern: {
                                 value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                                 message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
                              },
                           }}
                           render={({ onChange }) => (
                              <Input
                                 placeholder="เบอร์โทรศัพท์"
                                 onChange={(e) => onChange(e.target.value)}
                              />
                           )}
                        />
                        {errors?.phoneNumber && (
                           <ErrorText>{errors?.phoneNumber?.message}</ErrorText>
                        )}
                     </Col>
                     <Col span={24}>
                        <Controller
                           defaultValue=""
                           control={control}
                           name="other"
                           render={({ onChange }) => (
                              <Input.TextArea
                                 rows={4}
                                 placeholder="รายละเอียดอื่นๆ (ไม่บังคับ)"
                                 onChange={(e) => onChange(e.target.value)}
                              />
                           )}
                        />
                     </Col>
                     <Col span={24}>
                        <Button
                           loading={isLoading}
                           htmlType="submit"
                           block
                           size="large"
                           style={{ background: "#005219", color: "white" }}
                        >
                           ลงทะเบียน
                        </Button>
                     </Col>
                  </form>
               </Row>
            </BaseCard>
         </Col>
      </Row>
   );
};

export default memo(Register);
