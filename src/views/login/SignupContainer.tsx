// import { FC, useContext, useState } from 'react';
// import { Form, Alert } from 'antd';

// import webmaneLogo from '../../img/LionHeadLOGO.svg';

// import styled from 'styled-components';
// import { NeuButton } from '../../components/button/NeuButton';
// import { NeuInput } from '../../components/form/input/NeuInput';
// import { NeuPasswordInput } from '../../components/form/input/NeuPasswordInput';
// import useClient from '../../hooks/useClient';
// import { TLoginResponse, TRequest } from '../../models/models';
// import { AUTH_ACTION, IAuthContext } from '../../components/auth/useAuth';
// import { PERMISSION } from '../../lib/Permissions';
// import { AuthContext } from '../../components/auth/AuthContext';
// import { useNavigate } from 'react-router-dom';

// type TValues = {
//   email: string;
//   confirmPassword: string;
//   password: string;
// };

// const SignupForm: FC = () => {
//   const [msg, setMsg] = useState('');
//   const [err, setErr] = useState('');
//   const { fetchMe, loading } = useClient();
//   const { dispatchAuth } = useContext<IAuthContext>(AuthContext);
//   const navigate = useNavigate();

//   const formSubmit = async (values: TValues) => {
//     setErr('');
//     setMsg('');
//     let formData = {
//       email: values.email,
//       password: values.password,
//       confirm_password: values.confirmPassword
//     };
//     if (!loading) {
//       setMsg('Submitting');

//       const request: TRequest = {
//         method: 'POST',
//         path: '/auth/register',
//         data: formData
//       };

//       const response: TLoginResponse = await fetchMe(request);

//       if (response?.access_token) {
//         setErr('');
//         setMsg('Created');
//         dispatchAuth({
//           type: AUTH_ACTION.LOGIN,
//           payload: {
//             user: response?.user,
//             userId: response?.userId.toString(),
//             scopes: PERMISSION[response?.role.toUpperCase()],
//             token: response?.access_token
//           }
//         });
//         navigate('/bookmarks/page/1/page_size/10');
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <LoginContainer>
//         <div className="flex justify-center items-center flex-col select-none min-w-[15.625rem]">
//           <div>
//             <img
//               className="max-w-[100px] w-full pb-8"
//               src={webmaneLogo}
//               alt="webmane logo"
//             />
//           </div>
//           <div className="pb-8">
//             <h1>Webmane Signup</h1>
//           </div>
//         </div>
//         <Form
//           labelCol={{ span: 8 }}
//           wrapperCol={{ span: 30 }}
//           onFinish={(values: TValues) => formSubmit(values)}
//         >
//           <Form.Item
//             name="email"
//             rules={[
//               { required: true },
//               { whitespace: true },
//               { type: 'email', message: 'Valid email required' }
//             ]}
//             hasFeedback
//           >
//             <NeuInput placeholder="email" type="text" autoFocus={true} />
//           </Form.Item>
//           <Form.Item
//             name="password"
//             dependencies={['confirmPassword']}
//             rules={[
//               { required: true, message: 'Password required' },
//               {
//                 type: 'string',
//                 min: 8,
//                 max: 30,
//                 message: 'Must be at least 8 characters'
//               },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue('confirmPassword') === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject('The two passwords must match');
//                 }
//               })
//             ]}
//             hasFeedback
//           >
//             <NeuPasswordInput placeholder="password" type="password" />
//           </Form.Item>
//           <Form.Item
//             name="confirmPassword"
//             dependencies={['password']}
//             rules={[
//               { required: true, message: 'Password required' },
//               {
//                 type: 'string',
//                 min: 8,
//                 max: 30,
//                 message: 'Must be at least 8 characters'
//               },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue('password') === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject('The two passwords must match');
//                 }
//               })
//             ]}
//             hasFeedback
//           >
//             <NeuPasswordInput placeholder="confirm password" type="password" />
//           </Form.Item>

//           <Form.Item>
//             <NeuButton type="primary" htmlType="submit" className="w-full">
//               Signup
//             </NeuButton>
//           </Form.Item>
//         </Form>
//         {msg && <Alert message={msg} type="success" />}
//         {err && <Alert message={err} type="error" />}
//       </LoginContainer>
//     </div>
//   );
// };

// const LoginContainer = styled.div`
//   border-radius: 4px;
//   border: 1px solid hsla(0, 0%, 55%, 0.02);
//   box-shadow: 6px 6px 10px hsla(0, 0%, 0%, 0.2),
//     -6px -6px 10px hsla(0, 0%, 40%, 0.1);
//   padding: 2.5rem;
// `;

// export default SignupForm;
