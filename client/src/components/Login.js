import { Formik, Form, Field, ErrorMessage } from 'formik';
import { login } from '../services/authService';
import * as Yup from 'yup';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Đăng nhập</h2>
      <Formik
        initialValues={{ Email: '', MatKhau: '' }}
        validationSchema={Yup.object({
          Email: Yup.string().required('Bắt buộc').email('Email không hợp lệ'),
          MatKhau: Yup.string().required('Bắt buộc'),
        })}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const res = await login(values);
            saveToken(res.data.token);
            localStorage.setItem('currentUser', JSON.stringify(res.data.user));
            navigate('/');
          } catch (err) {
            setStatus('Sai email hoặc mật khẩu');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div className="mb-3">
              <label>Email</label>
              <Field name="Email" className="form-control" />
              <ErrorMessage name="Email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Mật khẩu</label>
              <Field name="MatKhau" type="password" className="form-control" />
              <ErrorMessage name="MatKhau" component="div" className="text-danger" />
            </div>
            {status && <div className="text-danger mb-2">{status}</div>}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Đăng nhập
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
