import { FC, useState, useContext } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import styled from 'styled-components';

type TFValues = {
  email: string;
  password: string;
};

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const { dispatchAuth, token } = useContext<IAuthContext>(AuthContext);
  const [redirectTo] = useSearchParams();
  const { fetchMe, loading } = useClient();

  const onEmailChange = (ev: any): void => {
    setEmail(ev.target.value);
  };

  const onPasswordChange = (ev: any): void => {
    setPassword(ev.target.value);
  };

  const formSubmit = async (values: TFValues) => {
    setErr('');
    setMsg('');
    setMsg('Submitting');
    let formData = {
      email: values.email,
      password: values.password
    };
    const request: TRequest = {
      method: 'POST',
      path: '/auth/login',
      data: formData
    };
    if (!loading) {
      const response: TLoginResponse = await fetchMe(request);
      if (response?.access_token) {
        setMsg('');
        dispatchAuth({
          type: AUTH_ACTION.LOGIN,
          payload: {
            user: response?.user,
            userId: response?.userId.toString(),
            scopes: PERMISSION[response?.role.toUpperCase()],
            token: response?.access_token
          }
        });
      }
      setMsg('');
      setErr('login failed');
      setTimeout(() => {
        setErr('');
      }, 1500);
    }
  };

  if (token && !loading) {
    let redirect: string | null = redirectTo.get('redirectTo');
    return redirect ? (
      <Navigate to={redirect} />
    ) : (
      <Navigate to="/bookmarks/page/1/page_size/10" />
    );
  } else {
    return (
      <div className="flex flex-col flex-nowrap justify-center items-center h-screen">
        <LoginContainer>
          <div className="flex justify-center items-center flex-col select-none min-w-[15.625rem]">
            <div>
              <img
                className="max-w-[100px] w-full pb-8"
                src={webmaneLogo}
                alt="webmane logo"
              />
            </div>
            <div className="pb-8">
              <h1>Login</h1>
            </div>
          </div>
          <Form onFinish={(values: TFValues) => formSubmit(values)}>
            <Form.Item
              name="email"
              rules={[
                { required: true },
                { whitespace: true },
                { type: 'email', message: 'Valid email required' }
              ]}
              hasFeedback
            >
              <NeuInput
                placeholder="email"
                type="text"
                value={email}
                onChange={onEmailChange}
                autoFocus={true}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Password required' },
                {
                  type: 'string',
                  min: 8,
                  max: 30,
                  message: 'Must be at least 8 characters'
                }
              ]}
              hasFeedback
            >
              <NeuPasswordInput
                placeholder="password"
                type="password"
                value={password}
                onChange={onPasswordChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item label="">
              <NeuButton
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                Login
              </NeuButton>
            </Form.Item>
          </Form>
          {msg && <Alert message={msg} type="success" />}
          {err && <Alert message={err} type="error" />}
        </LoginContainer>
      </div>
    );
  }
};

const LoginContainer = styled.div`
  border-radius: 4px;
  border: 1px solid hsla(0, 0%, 55%, 0.02);
  box-shadow:
    6px 6px 10px hsla(0, 0%, 0%, 0.2),
    -6px -6px 10px hsla(0, 0%, 40%, 0.1);
  padding: 2.5rem;
`;

export default Login;
