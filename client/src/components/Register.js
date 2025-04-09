import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { register } from '../services/authService';
import * as Yup from 'yup';

const Register = () => {
  return (
    <div className="container mt-5">
      <h2>Đăng ký</h2>
      <Formik
        initialValues={{
          HoTen: '',
          Email: '',
          MatKhau: '',
          NgaySinh: '',
          GioiTinh: 'Nam',
        }}
        validationSchema={Yup.object({
          HoTen: Yup.string().required('Bắt buộc'),
          Email: Yup.string().email().required('Bắt buộc'),
          MatKhau: Yup.string().min(6).required('Bắt buộc'),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            const res = await register(values);
            alert(res.data.message);
            resetForm();
          } catch (err) {
            alert(err.response.data.message || 'Lỗi');
          }
        }}
      >
        <Form>
          <div className="mb-3">
            <label>Họ tên</label>
            <Field name="HoTen" className="form-control" />
            <ErrorMessage name="HoTen" className="text-danger" component="div" />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <Field name="Email" type="email" className="form-control" />
            <ErrorMessage name="Email" className="text-danger" component="div" />
          </div>
          <div className="mb-3">
            <label>Mật khẩu</label>
            <Field name="MatKhau" type="password" className="form-control" />
            <ErrorMessage name="MatKhau" className="text-danger" component="div" />
          </div>
          <div className="mb-3">
            <label>Ngày sinh</label>
            <Field name="NgaySinh" type="date" className="form-control" />
          </div>
          <div className="mb-3">
            <label>Giới tính</label>
            <Field as="select" name="GioiTinh" className="form-control">
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </Field>
          </div>
          <button type="submit" className="btn btn-primary">Đăng ký</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
