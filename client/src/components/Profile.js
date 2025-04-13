import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { changePassword, deleteAccount, getUserProfile, updateProfile } from '../services/authService';
import { getToken, removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [profileValues, setProfileValues] = useState({
    HoTen: '',
    Email: '',
    NgaySinh: '',
    GioiTinh: '',
    Avatar: '',
  });

  const [passwordValues, setPasswordValues] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [profileStatus, setProfileStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(token);
        setProfileValues({
          HoTen: data.HoTen || '',
          Email: data.Email || '',
          NgaySinh: data.NgaySinh ? data.NgaySinh.split('T')[0] : '',
          GioiTinh: data.GioiTinh || '',
          Avatar: data.Avatar || '',
        });
      } catch (err) {
        console.error('Lỗi khi lấy profile:', err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleDelete = async () => {
    if (window.confirm('Bạn chắc chắn muốn xóa tài khoản?')) {
      await deleteAccount(token);
      removeToken();
      navigate('/login');
    }
  };

  return (
    <div className="container">
      <h2>Thông tin cá nhân</h2>
      <Formik
        initialValues={profileValues}
        enableReinitialize
        validationSchema={Yup.object({
          HoTen: Yup.string().required('Bắt buộc'),
          Email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
          NgaySinh: Yup.date().nullable().typeError('Ngày sinh không hợp lệ'),
          GioiTinh: Yup.string().oneOf(['Nam', 'Nữ', 'Khác'], 'Giới tính không hợp lệ'),
          Avatar: Yup.string().url('Avatar phải là URL hợp lệ'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await updateProfile(values, token);
            setProfileStatus('Cập nhật thông tin thành công!');
          } catch (err) {
            setProfileStatus(err.response?.data?.message || 'Cập nhật thông tin thất bại!');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label>Họ tên</label>
              <Field name="HoTen" className="form-control" />
              <ErrorMessage name="HoTen" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <Field name="Email" type="email" className="form-control" />
              <ErrorMessage name="Email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Ngày sinh</label>
              <Field name="NgaySinh" type="date" className="form-control" />
              <ErrorMessage name="NgaySinh" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Giới tính</label>
              <Field as="select" name="GioiTinh" className="form-control">
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Field>
              <ErrorMessage name="GioiTinh" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Avatar (URL)</label>
              <Field name="Avatar" className="form-control" />
              <ErrorMessage name="Avatar" component="div" className="text-danger" />
            </div>

            {profileStatus && <div className="mb-2 text-info">{profileStatus}</div>}
            <button type="submit" className="btn btn-primary me-2" disabled={isSubmitting}>
              Cập nhật thông tin
            </button>
          </Form>
        )}
      </Formik>

      <h2 className="mt-4">Đổi mật khẩu</h2>
      <Formik
        initialValues={passwordValues}
        validationSchema={Yup.object({
          oldPassword: Yup.string().required('Bắt buộc'),
          newPassword: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Bắt buộc'),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await changePassword(values, token);
            setPasswordStatus('Đổi mật khẩu thành công!');
            resetForm();
          } catch (err) {
            setPasswordStatus(err.response?.data?.message || 'Đổi mật khẩu thất bại!');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label>Mật khẩu cũ</label>
              <Field name="oldPassword" type="password" className="form-control" />
              <ErrorMessage name="oldPassword" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Mật khẩu mới</label>
              <Field name="newPassword" type="password" className="form-control" />
              <ErrorMessage name="newPassword" component="div" className="text-danger" />
            </div>

            {passwordStatus && <div className="mb-2 text-info">{passwordStatus}</div>}
            <button type="submit" className="btn btn-warning me-2" disabled={isSubmitting}>
              Đổi mật khẩu
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-4">
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Xóa tài khoản
        </button>
      </div>
    </div>
  );
};

export default Profile;
